import { ThreadStore } from './threadstore';
import { MessageStore } from './messagestore';
import { UserStore } from './userStore';
import { user } from '../models/user';

export class RootStore {
  threadStore: ThreadStore;
  messageStore: MessageStore;
  userStore: UserStore;

  constructor(loggedInUser: user) {
    this.userStore = new UserStore(this, loggedInUser);
    this.threadStore = new ThreadStore(this);
    this.messageStore = new MessageStore(this);
  }
}
