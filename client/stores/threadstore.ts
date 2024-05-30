import { makeAutoObservable } from 'mobx';

import { RootStore } from './rootstore';
import thread from '../models/thread';

export class ThreadStore {
	rootStore: RootStore;
	threads: thread[];
	isLoading = true;

	constructor(root: RootStore) {
		makeAutoObservable(this);
		this.rootStore = this.rootStore;
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
