import React, { useCallback, useContext, useMemo } from 'react';
import {
  Image,
  ListRenderItem,
  FlatList,
  View,
  Text,
  Pressable,
  LogBox,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer } from 'mobx-react-lite';
import Autolink from 'react-native-autolink';
import moment from 'moment';
import he from 'he';

import { message } from '../../models/message';

import { useUserContext } from '../../stores/userStore';
import Attachment from './attachment';

import vm from '../../viewmodels/messages/messageviewmodel';

import { RouteProps } from '../../components/navigation/navigation';
import { LastReadList } from './lastreadlist';

type routeType = NativeStackScreenProps<RouteProps, 'Messages'>;

const Message: ListRenderItem<message> = ({
  item,
}: ListRenderItemInfo<message>) => {
  const route = useRoute<routeType['route']>();
  const navigation = useNavigation<routeType['navigation']>();

  const { thread } = route.params;

  const loggedInUser = useUserContext();

  const messageItem = item; //used to distinguish between nested items/flatlists

  return (
    <Observer>
      {() => (
        <View
          style={[
            {
              flexGrow: 1,
              flexDirection: 'row',
              marginBottom: 3,
            },
            item.parentid === 0 ? messageStyle.Parent : messageStyle.Child,
          ]}
        >
          {item.lastmessagecreatedby != item.createdby ? (
            <Image
              style={messageStyle.ProfileImageStandard}
              resizeMode="cover"
              source={{
                uri: item
                  ? item.profileimageuri
                  : 'https://i.imgur.com/FwPobTp.png', // TODO: replace
              }}
            />
          ) : (
            <View style={{ width: 47 }}></View>
          )}
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {item.quotedmessage ? (
              <View style={{ marginBottom: 1 }}>
                {item.lastmessagecreatedby != item.createdby ? (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      marginBottom: 1,
                      marginLeft: 10,
                    }}
                  >
                    <Text
                      style={[
                        {
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {`${
                        item.quotedmessage.createdby === loggedInUser.userid
                          ? 'You'
                          : item.quotedmessage.createdbyname
                      } replied to ${
                        item.quotedmessage.createdby == loggedInUser.userid
                          ? 'you'
                          : item.createdbyname
                      }`}
                    </Text>

                    <Text
                      style={{ color: 'white', fontSize: 12, paddingLeft: 4 }}
                    >
                      {moment(item.createddate).format('h:mm a')}
                    </Text>
                  </View>
                ) : null}
                <Text
                  style={[
                    messageStyle.QuoteText,
                    item.quotedmessage.deletedby != null
                      ? messageStyle.Deleted
                      : { color: 'white' },
                  ]}
                >
                  {item.quotedmessage.deletedby != null
                    ? 'Deleted'
                    : item.quotedmessage.message
                    ? he.decode(item.quotedmessage.message)
                    : ''}
                </Text>
              </View>
            ) : (
              <>
                {item.lastmessagecreatedby != item.createdby ? (
                  <View
                    style={{ flex: 1, paddingLeft: 10, flexDirection: 'row' }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      {item.createdbyname}
                    </Text>
                    <Text
                      style={{ color: 'white', fontSize: 12, paddingLeft: 4 }}
                    >
                      {moment(item.createddate).format('h:mm a')}
                    </Text>
                  </View>
                ) : null}
              </>
            )}
            <Autolink //Turns URLs in text into hyperlinks. TODO: Replace this functionality
              style={[
                messageStyle.Message,
                {
                  backgroundColor:
                    item.createdby === loggedInUser.userid
                      ? '#457995'
                      : '#374151',
                },
              ]}
              stripTrailingSlash={false}
              stripPrefix={false}
              text={
                item.deletedby != null
                  ? 'Deleted'
                  : item.message
                  ? he.decode(item.message)
                  : ''
              }
            ></Autolink>

            {item.attachments.length > 0 ? (
              <FlatList
                style={{ height: 300, flex: 1, width: '100%' }}
                scrollEnabled={true}
                horizontal={true}
                data={item.attachments}
                keyExtractor={(item) => item.attachmentid.toString()}
                renderItem={({ item }) => (
                  <Attachment
                    source={{
                      uri: item.attachmentid,
                      cacheKey: item.attachmentid,
                    }}
                  ></Attachment>
                )}
              ></FlatList>
            ) : null}
            {item.reactions.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  height: 28,
                  marginVertical: 3,
                  marginHorizontal: 5,
                }}
              >
                {item.reactions.length > 0 ? (
                  <FlatList
                    style={{
                      flex: 1,
                      maxWidth: '90%',
                    }}
                    scrollEnabled={false}
                    horizontal={true}
                    data={item.reactions}
                    keyExtractor={(item) => item.reactiontype}
                    renderItem={({ item }) => (
                      <Observer>
                        {() => (
                          <Pressable
                            style={[
                              {
                                paddingHorizontal: 6,
                                marginRight: 4,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRadius: 10,
                              },
                              item.reacted
                                ? messageStyle.Reacted
                                : messageStyle.NotReacted,
                            ]}
                            onPress={() => {
                              const { react } = vm(thread);
                              react(messageItem, item.reactiontype);
                            }}
                            onLongPress={() => {
                              //   navigation.navigate('ReactionUsers', {
                              //     reaction: item,
                              //   });
                            }}
                          >
                            <Text style={{ fontSize: 16 }}>
                              {item.reactiontype}
                            </Text>
                            <Text
                              style={{
                                paddingLeft: 3,
                                fontSize: 14,
                                color: 'white',
                              }}
                            >
                              {item.reactioncount}
                            </Text>
                          </Pressable>
                        )}
                      </Observer>
                    )}
                  ></FlatList>
                ) : null}
              </View>
            ) : null}
            <LastReadList lastreadusers={item.lastreadusers} />
          </View>
        </View>
      )}
    </Observer>
  );
};

const messageStyle = StyleSheet.create({
  Message: {
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  Parent: {
    paddingLeft: 5,
  },
  Child: {
    marginLeft: 53,
    paddingLeft: 10,
    borderLeftColor: '#80ffff',
    borderLeftWidth: 0.5,
  },
  ParentQuote: {
    paddingLeft: 5,
    marginLeft: 48,
    marginRight: 5,
  },
  ChildQuote: {
    marginLeft: 101,
    marginRight: 5,
    paddingLeft: 10,
  },
  QuoteText: {
    backgroundColor: '#3F3E49',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    opacity: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  Deleted: {
    color: 'red',
    fontWeight: 'bold',
  },
  Reacted: {
    borderColor: '#363636',
    backgroundColor: '#457995',
  },
  NotReacted: {
    backgroundColor: '#374151',
  },
  DateHeader: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    backgroundColor: '#3F3E49',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  ProfileImageStandard: {
    height: 35,
    width: 35,
    marginHorizontal: 6,
    marginTop: 6,
    borderRadius: 40,
    overflow: 'hidden',
  },
});

export default Message;
