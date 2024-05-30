import { createContext, useEffect, useState } from 'react';

const context = createContext(null);

export const SessionContextProvider = (props: any) => {
	const [session, setSession] = useState(null);

	useEffect(() => {
		const saveUser = async () => {
			setSession(await loginViewModel().saveSession());
		};

		saveUser();
	}, []);

	return (
		<sessioncontext.Provider value={session}>
			{props.children}
		</sessioncontext.Provider>
	);
};

export const ThreadProvider = (props: any) => {
	const [session, setThreadStore] = useState(null);

	useEffect(() => {
		const saveUser = async () => {
			setSession(await loginViewModel().saveSession());
		};

		saveUser();
	}, []);

	return (
		<sessioncontext.Provider value={session}>
			{props.children}
		</sessioncontext.Provider>
	);
};
