import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, Pressable, LogBox } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FlashList } from '@shopify/flash-list';

import { RouteProps } from '../../App';
import messageviewmodel from '../../viewmodels/messages/messageviewmodel';
import Thread from './thread';
import thread from '../../models/thread';
import { Observer } from 'mobx-react-lite';
import { useThreadStore } from '../contextproviders';

LogBox.ignoreLogs([
	'Non-serializable values were found in the navigation state',
]);

type routeType = NativeStackScreenProps<RouteProps, 'Threads'>;

const ThreadList = ({ route, navigation }: routeType) => {
	const { getThreads, cache } = route.params.vm;

	const threadStore = useThreadStore();

	const [shouldFetch, setShouldFetch] = useState(true);
	const fetchMore = useCallback(() => setShouldFetch(true), []);

	useEffect(() => {
		if (shouldFetch) {
			getThreads();
		}
	}, [shouldFetch]);

	return (
		<Observer>
			{() => (
				<FlashList
					scrollEnabled={true}
					data={threadStore.threads}
					extraData={threadStore.threads}
					estimatedItemSize={42}
					onEndReachedThreshold={0.9}
					onEndReached={fetchMore}
					refreshing={null}
					keyExtractor={(item: thread) => item.threadid.toString()}
					renderItem={({ item, index }) => (
						<Pressable
							onPress={() => {
								navigation.navigate('Messages', {
									thread: item,
								});
							}}
						>
							<Thread
								key={index}
								item={item}
								index={index}
								separators={null}
							></Thread>
						</Pressable>
					)}
				/>
			)}
		</Observer>
	);
};

export default ThreadList;
