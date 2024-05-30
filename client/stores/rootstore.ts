import { ThreadStore } from './threadstore';
import { MessageStore } from './messagestore';

export class RootStore {
  threadStore: ThreadStore;
  messageStore: MessageStore;

  constructor() {
    this.threadStore = new ThreadStore(this);
    this.messageStore = new MessageStore(this);
  }
}
