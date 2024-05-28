import Router from 'express-promise-router';

// validators
import * as v from '../validators/threadValidator.js'; 

// controllers
import thread from '../controllers/thread.js';


const router = new Router();

router
  .get('/threads/users/:userid/', v.getThreads, thread.getThreads)
  .patch('/threads/:threadid&name=:name&modifiedby=:modifiedby', v.updateThread, thread.updateThread)
  .patch('/threads/:threadid&deletedby=:deletedby', v.deleteThread, thread.deleteThread)
  .patch('/threads/:threadid/messages/:messageid&readbyid=:readbyid', v.readMessage, thread.readMessage)
  .put('/topics/threads/:threadid&createdby=:createdby', v.createTopic, thread.createTopic)
  .post('/threads?createdby=:createdby', v.createThread, thread.createThread)

export default router;