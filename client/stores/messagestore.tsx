import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { makeAutoObservable, ObservableMap } from 'mobx';

import { message } from '../models/message';
import thread from '../models/thread';
import { RootStore } from './rootstore';

export class MessageStore {
  rootStore: RootStore;
  messages: ObservableMap<thread, message[]>;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.messages = new ObservableMap();
    makeAutoObservable(this);
  }

  //Note - due to how flatlist default position works, we show items in reverse order, so
  //the array functions will be reversed as well.
  set(thread: thread, messages: message[]) {
    this.messages.set(thread, messages);
  }
  prepend(thread: thread, messages: message[]) {
    this.messages.merge([[thread, messages]]);
  }
  add(thread: thread, message: message) {
    const messages = this.messages.get(thread);
    if (message.parentid === 0) {
      message.lastmessagecreatedby = messages[0]?.createdby; //Set lastmessagecreatedbyid on the new message since it's not efficient in SQL
      messages.unshift(message);
    } else {
      const mindex = messages.findIndex(
        (m) => m.messageid === message.parentid
      );
      message.lastmessagecreatedby = this.messages[mindex].createdbyid;
      messages.splice(mindex, 0, message);
    }
  }
  update(thread: thread, message: message) {
    this.messages.get(thread).map((m) => {
      if (m.messageid === message.messageid) return message;
      else if (m.quotedmessage.messageid === message.messageid) {
        m.quotedmessage = message;
        return m;
      }
    });
  }
  react(
    thread: thread,
    messageid: number,
    reactions: {
      reactiontype: string;
      reactioncount: number;
      reacted: boolean;
    }[]
  ) {
    this.messages.get(thread).find((m) => (m.messageid = messageid)).reactions =
      reactions;
  }
  //This is the same as Update - combine?
  delete(thread: thread, message: message) {
    this.messages.get(thread).map((m) => {
      if (m.messageid === message.messageid) return message;
      else if (m.quotedmessage.messageid === message.messageid) {
        m.quotedmessage = message;
        return m;
      }
    });
  }
  // addRead(thread, message, userid) {
  //   this.messages.get(thread).find((m) => m.messageid === message.messageid)?.lastread.push(user);
  // }
  // removeRead(userid) {
  //   const message = this.messages.find((m) =>
  //     m.lastread.find((u) => u.userid === userid)
  //   );

  //   if (message) {
  //     const userIndex = message.lastread.findIndex((u) => u.userid === userid);

  //     if (userIndex != -1) {
  //       message.lastread.splice(userIndex, 1);
  //     }
  //   }
  // }
}

const MessageStoreContext = createContext<MessageStore>({} as MessageStore);

//Pattern from here https://github.com/mobxjs/mobx-react-lite/issues/74
export const MessageStoreProvider = ({ rootStore, children }) => {
  const [messageStore, setMessageStore] = useState<MessageStore>(null);

  if (!messageStore) setMessageStore(new MessageStore(rootStore));

  return (
    <MessageStoreContext.Provider value={messageStore}>
      {children}
    </MessageStoreContext.Provider>
  );
};

export const useMessageStore = (): MessageStore =>
  useContext(MessageStoreContext);
