import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Observer, observer } from 'mobx-react-lite';
import { FlatList, Pressable, LogBox, SectionList, Text } from 'react-native';

import { Props } from '../../App';
import Message from '../../components/messagelist/message';
import message from '../../models/message';
import { FlashList } from '@shopify/flash-list';
import { MessageListStyle } from './messageliststyle';
import moment from 'moment';
import { DateHeader } from './dateheader';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type routeType = NativeStackScreenProps<Props, 'Messages'>;

const MessageList = ({ route, navigation }: routeType) => {
  const { getMessages, thread, cache } = route.params.vm;

  const [lastmessageid, setlastmessageid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMessages(thread, cache.messages.slice(-1)?.messageid || 0, 0);
  }, [lastmessageid]);

  const fetchMore = () => {
    if (!isLoading && lastmessageid)
      getMessages(thread, cache.messages.slice(-1)?.messageid || 0, 0);
  };

  return (
    <Observer>
      {() => (
        <FlashList
          //bounces={false}
          scrollEnabled={true}
          overScrollMode={'never'}
          data={cache.messages}
          extraData={cache.messages}
          inverted={true}
          estimatedItemSize={80}
          onEndReachedThreshold={0.9}
          onEndReached={
            null
            //   setlastmessageid(
            //   cache.messages.slice(-1)?.messageid || 0
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
                    item.deletedbyid == null
                      ? navigation.navigate('MessageContext', {
                          vm: route.params.vm,
                          message: item,
                          pressPosition: e.nativeEvent.pageY,
                        })
                      : null;
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
