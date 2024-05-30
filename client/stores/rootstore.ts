import { ThreadStore } from './threadstore';
import { MessageStore } from './messagestore';

export class RootStore {
	threadStore: ThreadStore;
	messagestore: MessageStore;

	constructor() {
		this.threadStore = new ThreadStore(this);
		this.messagestore = new MessageStore(this);
	}
}
