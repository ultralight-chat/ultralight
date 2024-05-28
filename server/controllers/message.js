import db, {io} from '../app.js';
import s3 from '../services/s3.js'

export default {
  getMessages: async (req, res) => { 
    const { messageid, threadid, parentid, userid } = req.params;

    try {
      const data  = await db.query(
        `SELECT getmessages(
          ${messageid}, 
          ${threadid}, 
          ${parentid},
          ${userid})`);

      if (messageid === 0) {
        const lastReadMessage = JSON.parse(data.rows[0].getmessages)[0];
        const user = lastReadMessage?.lastread.find((u) => u.userid == userid);

        io
          .to(threadid)
          .emit('read', {messageid: lastReadMessage.messageid, user: user})
      }

      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].getmessages);
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },

  getAttachment: async (req, res) => { 
    const { messageid, threadid, attachmentid } = req.params;

    try {



      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].getmessages);
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },

  createMessage: async (req, res) => { 
    const { threadid, parentid, createdby, quotedmessageid, message } = req.params;
    var attachments = req.body.attachments;
    const socketid = req.headers.socketid;

    try {
      const amap = JSON.stringify(attachments?.map((a) => ({filename: a.info.filename, mimetype: a.info.mimeType})))

      const response = await db.query(
        `SELECT createmessage(
        ${createdby}, 
        ${threadid}, 
        \'${message}\', 
        ${parentid}, 
        ${quotedmessageid || null},
        \'${amap || []}\')`
      );

      const messageResponse = response.rows[0].createmessage;
      const attachmentsResponse = JSON.parse(messageResponse)[0].attachments;

      if(attachments && attachmentsResponse?.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          attachments[i].attachmentid = attachmentsResponse[i].attachmentid;
        }

        const uploadMap = attachments.map(s3.uploadFile);
        Promise.all(uploadMap)
          .then(async (results) => {
            const uploadsResponse = await db.query(
              `SELECT completeuploads(
              ${threadid}, 
              ${response.messageid}, 
              \'${results}\')`
            );

            io
            .to(threadid)
            .emit('createmessage', { message: uploadsResponse, socketid: socketid }); 
          })
      } else {
        io
        .to(threadid)
        .emit('createmessage', {message: response, socketid: socketid});
      }

      return res
        .status(200)
        .send();
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  updateMessage: async (req, res) => {
    const { threadid, parentid, messageid, updatedby, quotedmessageid } = req.params;
    const message = req.body.message;

    try {
      const data = await db.query(
        `SELECT updatemessage(
          ${threadid},
          ${parentid},
          ${messageid}, 
          \'${message}\', 
          ${updatedby},
          ${quotedmessageid})`);
      
      io
        .to(threadid)
        .emit('updatemessage', {message: data.rows[0].updatemessage});

      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].updatemessage)
        .status(200)
        .send();
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  react: async (req, res) => {
    const { threadid, parentid, messageid, userid } = req.params;
    const reactiontype = req.body.reactiontype;

    try {
      const data = await db.query(
        `SELECT react(
          ${threadid}, 
          ${parentid}, 
          ${messageid}, 
          ${userid},
          \'${reactiontype}\')`);
      
      io
      .to(threadid)
      .emit('react', {reaction: data.rows[0].react});
  
      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].react)
        .status(200)
        .send();
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteReaction: async (req, res) => {
    const { threadid, parentid, messageid, userid } = req.params;
    const reactiontype = req.body.reactiontype;

    try {
      const data = await db.query(
        `SELECT deletereaction(
          ${threadid},
          ${parentid},
          ${messageid}, 
          ${userid},
          \'${reactiontype}\')`);

        io
          .to(threadid) //TODO: find out how to notify parentid since it's not returned with the react query
          .emit('react', {message: {messageid: messageid, threadid: threadid, parentid: parentid, createdby: userid}, reaction: data.rows[0].deletereaction});
    
      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].deletereaction)
        .status(200)
        .send();
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  addTopic: async (req, res) => {
    const { threadid, messageid, topicid, addedby } = req.params;

    try {
      const data = await db.query(
        `SELECT addtopic(
          ${threadid}, 
          ${messageid}, 
          ${topicid}, 
          ${addedby})`);

        io
        .to(threadid)
        .emit('createtopic', {message: data.rows[0].addtopic, topic: topicid}); // TODO: send actual topic instead of just id

      return res
        .set('content-type', 'application/JSON')
        .send(data.rows[0].addtopic)
        .status(200);
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteMessage: async (req, res) => {
    const { threadid, parentid, messageid, deletedby } = req.params;

    try {
      const data = await db.query(
        `SELECT deletemessage(
          ${threadid},
          ${parentid},
          ${messageid}, 
          ${deletedby})`);

      io
        .to(threadid)
        .emit('deletemessage', {message: data.rows[0].deletemessage});

      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].deletemessage);
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
  getConversations: async (req, res) => { 
    const { userid } = req.params;

    try {
      const data = await db.query(
        `SELECT getconversations(
          ${userid})`);
      
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].getconversations);
    } 
    catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}