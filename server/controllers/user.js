import db from '../app.js';

export default {
  // getUsers: async (req, res) => { 

  // },
  getUser: async (req, res) => { 
    const { userid } = req.params;

    try {
      const data = await db.query(
        `SELECT getuser(
          ${userid})`);
        
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].getuser);
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  createUser: async (req, res) => { 
    const { firstname, lastname, email } = req.body;

    try {
      const data = await db.query(
        `SELECT createuser(
          \'${firstname}\', 
          \'${lastname}\'
          \'${email}\')`);

      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].createuser);    
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  deleteUser: async (req, res) => { 
    const { userid, deletedby } = req.params;

    try {
      const data = await db.query(
        `SELECT deleteuser(
          ${userid}, 
          ${deletedby})`);
      
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].deleteuser);   
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  joinThread: async (req, res) => { 
    const { userid, threadid, addedby } = req.params;

    try {
      const data = await db.query(
        `SELECT jointhread(
          ${userid},
          ${threadid},
          ${addedby})`);

      req.io
        .to(threadid)
        .emit('jointhread', data.rows[0].jointhread);
          
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].jointhread);
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  leaveThread: async (req, res) => { 
    const { userid, threadid, removedby } = req.params;

    try {
      const data = await db.query(
        `SELECT leavethread(
          ${userid}, 
          ${threadid}, 
          ${removedby})`);
      
      req.io
        .to(threadid)
        .emit('leavethread', data.rows[0].leavethread);
          
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].leavethread); 
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },

  getConversationMembers: async (req, res) => { 
    const { threadid, parentid } = req.params;

    try {
      const data = await db.query(
        `SELECT getconversationmembers(
          ${threadid}, 
          ${parentid})`);
      
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].getconversationmembers); 
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  updateNickname: async (req, res) => { 
    const { threadid, userid, modifiedby } = req.params;
    const { nickname } = req.body.nickname;

    try {
      const data = await db.query(
        `SELECT updatenickname(
          ${threadid},
          ${userid},
          \'${nickname}\',
          ${modifiedby})`);
      
      req.io
        .to(threadid)
        .emit('updatenickname', data.rows[0].updatenickname);   

      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].updatenickname); 
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  },
  addUserToTopic: async (req, res) => { 
    const { threadid, userid, topicid } = req.params;

    try {
      const data = await db.query(
        `SELECT addusertotopic(
          ${threadid}, 
          ${userid}, 
          ${topicid})`);
      
      return res
        .set('content-type', 'application/JSON')
        .status(200)
        .send(data.rows[0].addusertotopic); 
    } 
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
  }
}