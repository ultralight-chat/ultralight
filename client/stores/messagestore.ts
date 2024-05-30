import { makeAutoObservable } from 'mobx';

import { RootStore } from './rootstore';
import message from '../models/message';
import thread from '../models/thread';

export class MessageStore {
  rootStore: RootStore;
  messages: message[];
  isLoading = true;

  constructor(root: RootStore) {
    makeAutoObservable(this, null, { name: 'MessageStore' });
    this.rootStore = root;
  }

  get(thread: thread) {
    return this.messages.filter();
  }
  set(messages: message[]) {
    this.messages = (this.messages || []).concat(messages);
  }
  add(message: message) {
    if (message.parentid === 0) {
      message.lastmessagecreatedbyid = this.messages[0]?.createdbyid; //Set lastmessagecreatedbyid on the new message since it's not efficient in SQL
      this.messages = [message].concat(this.messages);
    } else {
      const mindex = this.messages.findIndex(
        (m) => m.messageid === message.parentid
      );
      message.lastmessagecreatedbyid = this.messages[mindex].createdbyid;
      this.messages.splice(mindex, 0, message);
    }
  }
  update(message: message) {
    const oldMessage = this.messages.find(
      (m) => m.messageid === message.messageid
    );

    oldMessage.modifiedbyid = message.modifiedbyid;
    oldMessage.modifieddate = message.modifieddate;
    oldMessage.message = message.message;
  }
  react(reaction) {
    // const oldMessage = this.messages.find(
    //   (m) => m.messageid.toString() === reaction.messageid.toString()
    // );
    // const currentreaction = oldMessage.reactions.find(
    //   (r) => r.reactiontype === reaction.reactiontype
    // );
    // if (!currentreaction) {
    //   //if no one has reacted, add the reaction with this user
    //   oldMessage.reactions.push(<reactionAgg>{
    //     reactiontype: reaction.reactiontype,
    //     reacted: reaction.createdbyid === session.user.userid ? 1 : 0,
    //     users: [
    //       { userid: reaction.createdbyid, nickname: reaction.createdbyname },
    //     ],
    //   });
    //   return;
    // }
    // const userIndex = currentreaction.users.findIndex(
    //   (u) => u.userid === reaction.createdbyid
    // );
    // if (userIndex != -1) {
    //   //if user has already reacted
    //   if (currentreaction.users.length === 1) {
    //     //if user is the only one who has reacted, delete the whole reaction
    //     oldMessage.reactions.splice(
    //       oldMessage.reactions.findIndex(
    //         (r) => r.reactiontype === currentreaction.reactiontype
    //       ),
    //       1
    //     );
    //   } else {
    //     //if other users have also reacted, remove this user from the list
    //     currentreaction.users.splice(userIndex, 1);
    //     currentreaction.reacted = currentreaction.users.some(
    //       (u) => u.userid === session.user.userid
    //     )
    //       ? 1
    //       : 0;
    //   }
    // } else {
    //   //if the reaction exists but the user hasn't reacted yet, add them
    //   currentreaction.users.push(<user>{
    //     userid: reaction.createdbyid,
    //     nickname: reaction.createdbyname,
    //   });
    //   currentreaction.reacted =
    //     reaction.createdbyid === session.user.userid ? 1 : 0;
    // }
  }
  delete(messageObj) {
    const message = this.messages.find(
      (m) => m.messageid === messageObj.messageid
    );

    message.deletedbyid = messageObj.deletedbyid;
    message.deleteddate = messageObj.deleteddate;
    message.message = null;
    message.quotedmessage = null;
    message.reactions = [];
    message.attachments = [];

    this.messages
      .filter((m) => m.quotedmessage?.messageid === messageObj.messageid)
      .forEach((m) => {
        m.quotedmessage.deletedbyid = messageObj.deletedbyid;
        m.quotedmessage.message = null;
      });
  }
  addRead(messageid, user) {
    this.messages.find((m) => m.messageid === messageid)?.lastread.push(user);
  }
  removeRead(userid) {
    const message = this.messages.find((m) =>
      m.lastread.find((u) => u.userid === userid)
    );

    if (message) {
      const userIndex = message.lastread.findIndex((u) => u.userid === userid);

      if (userIndex != -1) {
        message.lastread.splice(userIndex, 1);
      }
    }
  }
}
