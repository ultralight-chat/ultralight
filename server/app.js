import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// postgres
import pg from 'pg';

// express
import http from 'http';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import busboy from 'connect-busboy';
import * as fs from 'fs';
import { S3Client } from '@aws-sdk/client-s3';
// import PQueue from "p-queue";

// routes
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import threadRouter from './routes/thread.js';
import messageRouter from './routes/message.js';

// passport
import passport from 'passport';
import { verifytoken } from './middleware/auth.js';

// socket.io
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

const pool = new pg.Pool({
  user: process.env.db_dev_user,
  database: process.env.db_dev_database,
  password: process.env.db_dev_password,
  port: process.env.db_dev_port,
  host: process.env.db_dev_host,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors({ origin: '*' }));

// passport initialization
app.use(
  session({
    secret: process.env.google_secret, //TODO: Provide different secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, //Set to true when https enabled
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  busboy({
    upload: true,
    immediate: true,
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  })
);

app.use((req, res, next) => {
  if (req.busboy) {
    var attachments = [];

    req.busboy.on('file', (name, file, info) => {
      attachments.push({ file, info });
    });
    // req.body.attachments = (req.body.attachments || []).concat({file, info})});
    req.busboy.on('field', (name, value, info) => {
      req.params.message = value;
    });
    req.busboy.on('finish', (name, value, info) => {
      req.body.attachments = attachments;
    });
  }
  next();
});

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.google_clientid,
//       clientSecret: process.env.google_secret,
//       callbackURL: `http://localhost:3025/auth/google/callback`,
//       scope: ['profile', 'email', 'coverPhotos'],
//     },
//     (accesstoken, refreshtoken, profile, cb) => {
//       console.log(accesstoken, refreshtoken, profile, cb);
//     }
//   )
// );

const client = new S3Client({
  region: process.env.s3_region,
  credentials: {
    accessKeyId: process.env.s3_accesskey,
    secretAccessKey: process.env.s3_secret,
  },
});

// app.all('*', verifytoken); //Verify token for every route

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.use('/', authRouter);
app.use('/', userRouter);
app.use('/', threadRouter);
app.use('/', messageRouter);

var socket;
io.on('connection', (socketObj) => {
  socketObj
    .on('typing', (data) => {
      io.to(data.threadid).broadcast.emit('typing', data);
    })
    .on('typingstop', (data) => {
      io.to(data.threadid).broadcast.emit('typingstop', data);
    })
    .on('disconnect', (data) => {
      console.log(data);
    });

  socket = socketObj;
});

server.listen(process.env.express_port, () => {
  console.log('Express listening on ' + process.env.express_port);
});

export { io, socket, client };

export default {
  query: (text, params) => pool.query(text, params),
};
