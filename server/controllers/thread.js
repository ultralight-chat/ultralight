import db, { io, socket } from '../app.js';

export default {
  getThreads: async (req, res) => { 
    const { userid } = req.params;

    try {
      const data = await db.query(
        `SELECT getthreads(
          ${userid})`);

      const results = data.rows[0].getthreads;

      var threads = JSON.parse(results).map((t) => t.threadid.toString())

      if (threads && threads.length > 0)
        socket
          .join(threads)

      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(results);
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  createThread: async (req, res) => { 
    const { createdby } = req.params;
    const name = req.body.name;

    try {
      const data = await db.query(
        `SELECT createthread(
          \'${name}\', 
          ${createdby})`)

      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].createthread)
        .status(200)
        .send();
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  updateThread: async (req, res) => { 
    const { threadid, name, modifiedby } = req.params;

    try {
      const data = await db.query(
        `SELECT updatethread(
          ${threadid}, 
          \'${name}\', 
          ${modifiedby})`);

      io
        .to(threadid)
        .emit('updatethread', data.rows[0].updatethread);
        
      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].updatethread)
        .status(200)
        .send();
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteThread: async (req, res) => { 
    const { threadid, deletedby } = req.params;

    try {
      const data = await db.query(
        `SELECT deletethread(
          ${threadid}, 
          ${deletedby})`);
        
      io
        .to(threadid)
        .emit('deletethread', data.rows[0].deletethread);  

      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].deletethread)
        .status(200)
        .send();
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  createTopic: async (req, res) => { 
    const { threadid, createdby } = req.params;
    const name = req.body.name;

    try {
      const topic = await db.query(
        `SELECT createtopic(
          ${threadid}, 
          \'${name}\', 
          ${createdby})`);

      return res
        // .set('content-type', 'application/JSON')
        // .send(data.rows[0].createtopic)
        .status(200)
        .send();
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  readMessage: async (req, res) => { 
    const { threadid, messageid, readbyid } = req.params;

    try {
      const data = await db.query(
        `SELECT readmessage(
          ${threadid}, 
          ${messageid}, 
          ${readbyid})`);

      io
        .to(threadid)
        .emit('read', {messageid: messageid, user: data.rows[0].readmessage});
        
      return res
        .status(200)
        .send();
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
}