import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, FlatList, Pressable, LogBox } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FlashList } from '@shopify/flash-list';

import { sessioncontext } from '../contextprovider';
import { Props } from '../../App';
import messageviewmodel from '../../viewmodels/messages/messageviewmodel';
import Thread from './thread';
import thread from '../../models/thread';
import { Observer } from 'mobx-react-lite';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type routeType = NativeStackScreenProps<Props, 'Threads'>;

const ThreadList = ({ route, navigation }: routeType) => {
  const { getThreads, cache } = route.params.vm;

  const session = useContext(sessioncontext);

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
          data={cache.threads}
          extraData={cache.threads}
          estimatedItemSize={42}
          onEndReachedThreshold={0.9}
          onEndReached={fetchMore}
          refreshing={null}
          keyExtractor={(item: thread) => item.threadid.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                // cache.touch(item);
                navigation.navigate('Messages', {
                  thread: item,
                  vm: messageviewmodel(session, item),
                  quotedmessage: null,
                  parentmessage: null,
                  updatemessage: null,
                  user: session.user,
                });
              }}
            >
              <Thread
                key={index}
                item={item}
                index={0}
                separators={{
                  highlight: function (): void {
                    throw new Error('Function not implemented.');
                  },
                  unhighlight: function (): void {
                    throw new Error('Function not implemented.');
                  },
                  updateProps: function (
                    select: 'leading' | 'trailing',
                    newProps: any
                  ): void {
                    throw new Error('Function not implemented.');
                  },
                }}
              ></Thread>
            </Pressable>
          )}
        />
      )}
    </Observer>
  );
};

export default ThreadList;
