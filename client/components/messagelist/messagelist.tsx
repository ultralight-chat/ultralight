import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, Text, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer, observer } from 'mobx-react-lite';
import { FlashList } from '@shopify/flash-list';

//models
import { message } from '../../models/message';

//views

//components
import { useMessageStore } from '../../stores/messagestore';
import { useUserContext } from '../../stores/userStore';
import { useSession } from '../contextproviders';
import Message from '../../components/messagelist/message';

//viewmodels
import vm from '../../viewmodels/messages/messageviewmodel';

//assets

import { RouteProps } from '../../components/navigation/navigation';

type routeType = NativeStackScreenProps<RouteProps, 'Messages'>;

const MessageList = ({ route, navigation }: routeType) => {
  const { thread } = route.params;

  const { getMessages } = vm(thread);

  const session = useSession();
  const messageStore = useMessageStore();

  const [lastmessageid, setlastmessageid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMessages(0, 0);
  }, [lastmessageid]);

  const fetchMore = (parentMessage?: message) => {
    if (!isLoading && lastmessageid)
      getMessages(
        messageStore.messages.get(thread)?.slice(-1)[0]?.messageid || 0,
        parentMessage?.messageid ?? 0
      );
  };

  return (
    <Observer>
      {() => (
        <FlashList
          //bounces={false}
          scrollEnabled={true}
          overScrollMode={'never'}
          data={messageStore.messages.get(thread)}
          extraData={messageStore.messages.get(thread)}
          inverted={true}
          estimatedItemSize={80}
          onEndReachedThreshold={0.9}
          onEndReached={
            null
            //   setlastmessageid(
            //   messageStore.messages.slice(-1)?.messageid || 0
            // )
          }
          refreshing={isLoading}
          keyExtractor={(item: message) => String(item.messageid)}
          renderItem={({ item, index }) => {
            return (
              <>
                <Pressable
                  delayLongPress={300}
                  onLongPress={(e) => {
                    if (
                      !item.deletedby ||
                      item.deletedby === session.user.userid
                    )
                      navigation.navigate('MessageContext', {
                        thread: thread,
                        message: item,
                        pressPosition: e.nativeEvent.pageY,
                      });
                  }}
                >
                  <Message
                    key={item.messageid}
                    item={item}
                    index={index}
                    separators={null}
                  ></Message>
                </Pressable>
              </>
            );
          }}
        />
      )}
    </Observer>
  );
};

const MessageListStyle = StyleSheet.create({});

export default MessageList;
