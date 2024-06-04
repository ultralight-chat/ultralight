import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer, observer } from 'mobx-react-lite';
import { FlashList } from '@shopify/flash-list';

//models
import message from '../../models/message';

//views

//components
import { useMessageStore, useSession } from '../contextproviders';
import Message from '../../components/messagelist/message';
import { DateHeader } from './dateheader';

//viewmodels
import vm from '../../viewmodels/messages/messageviewmodel';

//styles

//assets

import { RouteProps } from '../../components/navigation/navigation';

type routeType = NativeStackScreenProps<RouteProps, 'Messages'>;

const MessageList = ({ route, navigation }: routeType) => {
  const { thread } = route.params;

  const { getMessages } = vm(thread);

  const session = useSession();
  const messageStore = useMessageStore(thread);

  const [lastmessageid, setlastmessageid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMessages(thread, messageStore.messages.slice(-1)[0]?.messageid || 0, 0);
  }, [lastmessageid]);

  const fetchMore = () => {
    if (!isLoading && lastmessageid)
      getMessages(
        thread,
        messageStore.messages.slice(-1)[0]?.messageid || 0,
        0
      );
  };

  return (
    <Observer>
      {() => (
        <FlashList
          //bounces={false}
          scrollEnabled={true}
          overScrollMode={'never'}
          data={messageStore.messages}
          extraData={messageStore.messages}
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
                {item.lastmessagecreateddatediff ? (
                  <DateHeader
                    item={item.createddate}
                    index={index}
                    separators={null}
                  />
                ) : null}
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

export default MessageList;
