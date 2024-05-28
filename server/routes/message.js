import Router from 'express-promise-router';

// validators
import * as v from '../validators/messageValidator.js'; 

// controllers
import message from '../controllers/message.js';

const router = new Router();

router
.get('/messages/:messageid/threads/:threadid&parentid=:parentid&userid=:userid', v.getMessages, message.getMessages)
.get('/messages/users/:userid/conversations', v.getConversations, message.getConversations)
.get('/messages/:messageid/threads/:threadid/attachments/:attachmentid', v.getAttachment, message.getAttachment)
.patch('/messages/:messageid/threads/:threadid&parentid=:parentid&deletedby=:deletedby', v.deleteMessage, message.deleteMessage) 
.patch('/messages/:messageid/threads/:threadid&parentid=:parentid&updatedby=:updatedby&quotedmessageid=:quotedmessageid?', v.updateMessage, message.updateMessage)
.put('/messages/:messageid/threads/:threadid&parentid=:parentid&userid=:userid', v.react, message.react)
.put('/messages/:messageid/threads/:threadid/topics/:topicid&addedby=:addedby', v.addTopic, message.addTopic)
.post('/messages/threads/:threadid&parentid=:parentid&createdby=:createdby&quotedmessageid=:quotedmessageid?', v.createMessage, message.createMessage)
.delete('/messages/:messageid/threads/:threadid&parentid=:parentid&userid=:userid', v.deleteReaction, message.deleteReaction)

export default router;