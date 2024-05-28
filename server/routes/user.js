import Router from 'express-promise-router';

// validators
import * as v from '../validators/userValidator.js'; 

// controllers
import user from '../controllers/user.js';

const router = new Router();

router

  .get('/users/threads/:threadid/messages/:parentid/conversation-members', v.getConversationMembers, user.getConversationMembers)
  .get('/users/:userid', v.getUser, user.getUser)
  .patch('/users/:userid/threads/:threadid&nickname=:nickname&modifiedby=:modifiedby', v.updateNickname, user.updateNickname)
  .patch('/users/:userid/threads/:threadid&addedby=:addedby', v.joinThread, user.joinThread)
  .patch('/users/:userid/threads/:threadid&removedby=:removedby', v.leaveThread, user.leaveThread)
  .patch('/users/:userid&deletedby=:deletedby', v.deleteUser, user.deleteUser)
  .patch('/users', v.createUser, user.createUser)
  .put('/users/:userid/threads/:threadid/topics/:topicid', v.addUserToTopic, user.addUserToTopic)

export default router;