import React, { useCallback, useContext, useMemo } from 'react';
import {
  Image,
  ListRenderItem,
  FlatList,
  View,
  Text,
  Pressable,
  LogBox,
} from 'react-native';

import Autolink from 'react-native-autolink';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer } from 'mobx-react-lite';
import moment from 'moment';
import he from 'he';

import { Props } from '../../App';
import message from '../../models/message';
import Attachment from './attachment';
import thread from '../../models/thread';
import { MessageListStyle } from './messageliststyle';

import DefaultProfileIcon from '../../assets/default_pfp.svg';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type routeType = NativeStackScreenProps<Props, 'Messages'>;

const Message: ListRenderItem<message> = ({ item }) => {
  const route = useRoute<routeType['route']>();
  const navigation = useNavigation<routeType['navigation']>();

  const user = route.params.user;
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
            item.parentid === 0
              ? MessageListStyle.Parent
              : MessageListStyle.Child,
          ]}
        >
          {item.lastmessagecreatedbyid != item.createdbyid ? (
            <Image
              style={MessageListStyle.ProfileImageStandard}
              resizeMode="cover"
              source={{
                uri: item.createdbyprofileimage
                  ? item.createdbyprofileimage
                  : 'https://i.imgur.com/FwPobTp.png',
              }}
            />
          ) : (
            <View style={{ width: 47 }}></View>
          )}
          <View style={{ flex: 1, flexDirection: 'column' }}>
            {item.quotedmessage ? (
              <View style={{ marginBottom: 1 }}>
                {item.lastmessagecreatedbyid != item.createdbyid ? (
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
                      {item.quotedmessage.createdbyid == user.userid
                        ? 'You'
                        : item.quotedmessage.createdbyname}
                    </Text>
                    <Text
                      style={[
                        {
                          color: 'white',
                          fontSize: 12,
                        },
                      ]}
                    >
                      {' replied to '}
                    </Text>
                    <Text
                      style={[
                        {
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                        },
                      ]}
                    >
                      {item.quotedmessage.createdbyid == user.userid
                        ? 'you'
                        : item.createdbyname}
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
                    MessageListStyle.QuoteText,
                    item.quotedmessage.deletedbyid != null
                      ? MessageListStyle.Deleted
                      : { color: 'white' },
                  ]}
                >
                  {item.quotedmessage.deletedbyid != null
                    ? 'Deleted'
                    : item.quotedmessage.message
                    ? he.decode(item.quotedmessage.message)
                    : ''}
                </Text>
              </View>
            ) : (
              <>
                {item.lastmessagecreatedbyid != item.createdbyid ? (
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
                MessageListStyle.Message,
                {
                  backgroundColor:
                    item.createdbyid === user.userid ? '#457995' : '#374151',
                },
              ]}
              stripTrailingSlash={false}
              stripPrefix={false}
              text={
                item.deletedbyid != null
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
                                ? MessageListStyle.Reacted
                                : MessageListStyle.NotReacted,
                            ]}
                            onPress={() => {
                              route.params.vm.react(
                                messageItem,
                                item.reactiontype
                              );
                            }}
                            onLongPress={() => {
                              navigation.navigate('ReactionUsers', {
                                vm: route.params.vm,
                                reaction: item,
                              });
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
                              {item.users.length}
                            </Text>
                          </Pressable>
                        )}
                      </Observer>
                    )}
                  ></FlatList>
                ) : null}
              </View>
            ) : null}
            {item.lastread.every((lr) =>
              [user.userid, item.createdbyid].includes(lr.userid)
            ) ? null : (
              <Pressable
                style={{
                  height: 20,
                }}
                onPress={null}
              >
                <Observer>
                  {() => (
                    <FlatList
                      style={{
                        flex: 1,
                        height: 20,
                        marginTop: -20,
                        marginRight: 5,
                      }}
                      scrollEnabled={false}
                      horizontal={true}
                      inverted={true}
                      data={item.lastread}
                      keyExtractor={(item) => item.userid.toString()}
                      renderItem={({ item }) => (
                        <>
                          {item.userid != messageItem.createdbyid &&
                          item.userid != user.userid ? (
                            <Image
                              style={MessageListStyle.ProfileImageSmall}
                              source={{
                                uri: item.profileimage,
                              }}
                            />
                          ) : null}
                        </>
                      )}
                    ></FlatList>
                  )}
                </Observer>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </Observer>
  );
};

export default Message;
