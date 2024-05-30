import { createContext, useContext, useState } from 'react';

import thread from '../models/thread';
import { ThreadStore } from '../stores/threadstore';
import { MessageStore } from '../stores/messagestore';

const SessionContext = createContext(null);
const MessageStoreContext = createContext(null);
const ThreadStoreContext = createContext(null);

export const SessionProvider = ({ children }) => {
	const [session, setSession] = useState(null);

	return (
		<SessionContext.Provider value={session}>
			{children}
		</SessionContext.Provider>
	);
};

export const ThreadStoreProvider = ({ children }) => {
	const threadStore = new ThreadStore();
	return (
		<ThreadStoreContext.Provider value={threadStore}>
			{children}
		</ThreadStoreContext.Provider>
	);
};

export const MessageStoreProvider = ({ thread: thread, children }) => {
	const messageStore = new MessageStore(thread);
	return (
		<MessageStoreContext.Provider value={messageStore}>
			{children}
		</MessageStoreContext.Provider>
	);
};

export const useSession = (): Session => useContext(SessionContext);
export const useThreadStore = (): ThreadStore => useContext(ThreadStoreContext);
export const useMessageStore = (thread: thread): MessageStore =>
	useContext(MessageStoreContext);
