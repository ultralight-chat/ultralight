import { createContext, useContext, useState } from 'react';
import { ObservableMap, makeAutoObservable } from 'mobx';

import { RootStore } from './rootstore';
import thread from '../models/thread';

export class ThreadStore {
  rootStore: RootStore;
  threads: thread[];

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.threads = [] as thread[];
    makeAutoObservable(this);
  }

  set(threads: thread[]) {
    this.threads = threads;
  }
  delete(thread: thread) {
    const threadindex = this.threads.findIndex(
      (m) => m.threadid === thread.threadid
    );

    this.threads.splice(threadindex, 1);
  }
  add(thread: thread) {
    this.threads = [thread].concat(this.threads);
  }
  update(thread: thread) {
    const oldthread = this.threads.find((m) => m.threadid === thread.threadid);

    oldthread.unreadcount = 0;
    // oldthread.modifiedbyid = user.userid;
    // oldthread.modifieddate = thread.modifieddate;
    // oldthread = thread;
  }
  touch(thread: thread) {
    const oldthread = this.threads.find((m) => m.threadid === thread.threadid);

    oldthread.unreadcount = 0;
  }
}

const ThreadStoreContext = createContext(null);

export const ThreadStoreProvider = ({ rootStore, children }) => {
  const [threadStore] = useState(new ThreadStore(rootStore));

  return (
    <ThreadStoreContext.Provider value={threadStore}>
      {children}
    </ThreadStoreContext.Provider>
  );
};

export const useThreadStore = (): ThreadStore => useContext(ThreadStoreContext);
