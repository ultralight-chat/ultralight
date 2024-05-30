import React, { useContext, createContext } from 'react';
import { LogBox, StyleSheet } from 'react-native';

import { Navigation } from './components/navigation/navigation';

import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
	sessioncontext,
	SessionContextProvider,
} from './components/contextprovider';

import thread from './models/thread';
import message from './models/message';
import reaction from './models/reactionAgg';
import user from './models/user';

LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
]);

const App = () => {
	//const Drawer = createDrawerNavigator<DrawerProps>();
	// const navigation = useNavigation();

	return (
		<SafeAreaProvider>
			<SessionContextProvider>
				<Navigation></Navigation>
			</SessionContextProvider>
		</SafeAreaProvider>
	);
};

export type Props = {
	Login: { vm };
	Messages: {
		thread: thread;
		vm;
		quotedmessage: message;
		parentmessage: message;
		updatemessage: message;
		user: user;
	};
	Threads: { vm };
	MessageContext: { vm; message: message; pressPosition: number };
	ReactionUsers: { vm; reaction: reaction };
};

export type DrawerProps = {
	MessageHambugerMenu: { thread: thread };
};

export default App;
