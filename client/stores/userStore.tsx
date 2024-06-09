import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { makeAutoObservable, ObservableMap } from 'mobx';

import { RootStore } from './rootstore';
import thread from '../models/thread';
import { threadmember, user } from '../models/user';

export class UserStore {
  rootStore: RootStore;
  loggedInUser: user;
  members: ObservableMap<thread, threadmember[]>;

  constructor(rootStore: RootStore, loggedInUser: user) {
    this.rootStore = rootStore;
    this.loggedInUser = loggedInUser;
    this.members = new ObservableMap();
    makeAutoObservable(this);
  }

  set(thread: thread, loggedInUser?: user, members?: threadmember[]) {
    if (loggedInUser) this.loggedInUser = loggedInUser;
    this.members.set(thread, members);
  }
  add(thread: thread, member: threadmember) {
    this.members.get(thread).push(member);
  }
  remove(thread: thread, member: threadmember) {
    let members = this.members.get(thread);
    const mindex = members.findIndex((m) => m.userid === member.userid);
    members[mindex] = member; //Replace to update deletedby
  }
  update(thread: thread, member: threadmember) {
    let members = this.members.get(thread);
    const mindex = members.findIndex((m) => m.userid === member.userid);
    members[mindex] = member; //Replace to update deletedby
  }
}

const UserStoreContext = createContext<UserStore>({} as UserStore);
const UserContext = createContext<user>({} as user);

//Pattern from here https://github.com/mobxjs/mobx-react-lite/issues/74
export const UserStoreProvider = ({ rootStore, children }) => {
  const [userStore, setUserStore] = useState<UserStore>(null);
  const [loggedInUser, setLoggedInUser] = useState<user>(null);

  if (!UserStore) setUserStore(new UserStore(rootStore, loggedInUser));

  return (
    <UserStoreContext.Provider value={userStore}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStoreContext = (): UserStore =>
  useContext(UserStoreContext);
export const useUserContext = (): user => useContext(UserContext);
