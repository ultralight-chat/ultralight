import { makeAutoObservable } from 'mobx';
import thread from '../../models/thread';

const threadCache = (session) => {
	const cache = makeAutoObservable({
		threads: <thread[]>[],
		set: (threads: thread[]) => {
			cache.threads = threads;
		},
		delete: (thread: thread) => {
			const threadindex = cache.threads.findIndex(
				(m) => m.threadid === thread.threadid
			);

			cache.threads.splice(threadindex, 1);
		},
		add: (thread: thread) => {
			cache.threads = [thread].concat(cache.threads);
		},
		update: (thread: thread) => {
			const oldthread = cache.threads.find(
				(m) => m.threadid === thread.threadid
			);

			oldthread.unreadcount = 0;
			// oldthread.modifiedbyid = user.userid;
			// oldthread.modifieddate = thread.modifieddate;
			// oldthread = thread;
		},
		touch: (thread: thread) => {
			const oldthread = cache.threads.find(
				(m) => m.threadid === thread.threadid
			);

			oldthread.unreadcount = 0;
		},
	});
	return cache;
};

export default threadCache;
