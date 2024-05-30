import React from 'react';
import { View, LogBox } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RouteProps } from '../../App';
import ThreadList from '../../components/threadlist/threadlist';
import { ThreadStoreProvider } from '../../components/contextproviders';

LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
]);

type routeType = NativeStackScreenProps<RouteProps, 'Threads'>;

const ThreadView = ({ route, navigation }: routeType) => {
	return (
		<View
			style={{
				backgroundColor: '#19172B',
				flex: 1,
				paddingTop: 5,
				minHeight: 2,
				minWidth: 2,
			}}
		>
			<ThreadStoreProvider>
				<ThreadList route={route} navigation={navigation} />
			</ThreadStoreProvider>
		</View>
	);
};

export default ThreadView;
