import React, { useContext, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  Text,
  View,
  LogBox,
  FlatList,
} from 'react-native';

import { DocumentPickerAsset, getDocumentAsync } from 'expo-document-picker';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer } from 'mobx-react-lite';
import { makeAutoObservable } from 'mobx';
import { LinearGradient } from 'expo-linear-gradient';
import Autolink from 'react-native-autolink';
import he from 'he';

import { message, draftMessage } from '../../models/message';

import { MessageStoreProvider } from '../../stores/messagestore';
import MessageList from '../../components/messagelist/messagelist';

import vm from '../../viewmodels/messages/messageviewmodel';

import { MessageViewStyle } from './messageviewstyle';

import SendIcon from '../../assets/sendicon.svg';
import EditIcon from '../../assets/editicon.svg';
import AttachmentIcon from '../../assets/attachment.svg';
import CancelIcon from '../../assets/cancel.svg';
import GenericFile from '../../assets/genericfile.svg';

import { RouteProps } from '../../components/navigation/navigation';

type routeType = NativeStackScreenProps<RouteProps, 'Messages'>;

const MessageView = ({ route, navigation }: routeType) => {
  const { thread } = route.params;

  const {
    createMessage,
    updateMessage,
    deleteMessage,
    startTyping,
    endTyping,
  } = vm(thread);

  const [draftMessage, setDraftMessage] = useState<draftMessage>(
    {} as draftMessage
  );
  const [typing, setTyping] = useState(false);

  return (
    <Observer>
      {() => (
        <LinearGradient
          colors={['#19172B', '#5800A3', '#FF9412']}
          style={messagesviewstyle.Background}
        >
          <View style={{ flex: 1 }}>
            <MessageStoreProvider rootStore={null}>
              <MessageList route={route} navigation={navigation} />
            </MessageStoreProvider>
            {draftMessage.quotedmessage ? (
              <View
                style={{
                  alignSelf: 'flex-start',
                  opacity: 0.5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Pressable
                  onPress={() =>
                    setDraftMessage({ ...draftMessage, quotedmessage: null })
                  }
                >
                  <CancelIcon
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 6,
                    }}
                  ></CancelIcon>
                </Pressable>

                <Autolink
                  style={[
                    MessageViewStyle.QuotedMessage,
                    draftMessage.quotedmessage?.deletedby != null
                      ? MessageViewStyle.Deleted
                      : { color: 'white' },
                  ]}
                  stripTrailingSlash={false}
                  stripPrefix={false}
                  text={
                    draftMessage.quotedmessage?.message
                      ? he.decode(draftMessage.quotedmessage.message)
                      : ''
                  }
                ></Autolink>
              </View>
            ) : null}
            <View
              style={{
                backgroundColor: '#0C0C0C',
                flexDirection: 'row',
                width: '100%',
                maxHeight: 100,
                // alignSelf: "flex-start",
              }}
            >
              <Pressable
                onPress={() => {
                  getDocumentAsync({
                    multiple: true,
                  }).then((results) =>
                    setDraftMessage({
                      ...draftMessage,
                      attachments: results.assets,
                    })
                  );
                }}
              >
                <AttachmentIcon
                  style={{
                    width: 28,
                    height: 28,
                    marginTop: 11,
                    marginLeft: 6,
                    marginRight: 2,
                  }}
                />
              </Pressable>

              <View style={{ flex: 1, justifyContent: 'center' }}>
                <TextInput
                  style={{
                    flexGrow: 1,
                    marginLeft: 5,
                    marginVertical: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 0,
                    borderRadius: 10,
                    color: 'white',
                    backgroundColor: '#374151',
                    fontSize: 16,
                    borderWidth: 0,
                  }}
                  multiline={true}
                  placeholder="Message"
                  placeholderTextColor="white"
                  value={draftMessage.message}
                  onChangeText={(message) => {
                    message.length > 0 ? startTyping() : endTyping();
                    setDraftMessage({ ...draftMessage, message: message });
                  }}
                />
              </View>

              {draftMessage.updatedMessage ? (
                <Pressable
                  onPress={() => {
                    updateMessage({
                      ...draftMessage,
                      message: draftMessage.updatedMessage,
                    });
                    setDraftMessage({} as draftMessage);
                  }}
                >
                  <EditIcon
                    style={{
                      marginLeft: 6,
                      marginRight: 8,
                      width: 36,
                      height: 50,
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    createMessage(draftMessage);
                    setDraftMessage({} as draftMessage);
                    endTyping();
                  }}
                >
                  <SendIcon
                    style={{
                      marginLeft: 6,
                      marginRight: 8,
                      width: 36,
                      height: 50,
                    }}
                  />
                </Pressable>
              )}
            </View>
          </View>
          {draftMessage.attachments?.length > 0 ? (
            <FlatList
              style={{
                maxHeight: 60,
                flex: 1,
                width: '100%',
                backgroundColor: '#0C0C0C',
              }}
              scrollEnabled={true}
              horizontal={true}
              data={draftMessage.attachments}
              keyExtractor={(item) => item.uri}
              renderItem={({ index, item }) => (
                <View style={{ alignItems: 'center', width: 60 }}>
                  {item.mimeType?.startsWith('image') ? (
                    <Image
                      style={{
                        width: 45,
                        height: 45,
                        margin: 10,
                        borderRadius: 10,
                        overflow: 'hidden',
                        alignSelf: 'center',
                      }}
                      resizeMode="cover"
                      source={{
                        uri: item.uri,
                      }}
                    />
                  ) : (
                    <GenericFile
                      style={{
                        width: 45,
                        height: 45,
                        margin: 10,
                        borderRadius: 10,
                        overflow: 'hidden',
                        alignSelf: 'center',
                      }}
                    />
                  )}

                  <Pressable
                    style={{
                      position: 'absolute',
                      width: '25%',
                      height: '25%',
                      right: 1,
                      top: 3,
                    }}
                    // onPress={() => draftMessage.removeAttachment(index)}
                  >
                    <CancelIcon />
                  </Pressable>
                </View>
              )}
            ></FlatList>
          ) : null}
        </LinearGradient>
      )}
    </Observer>
  );
};

const messagesviewstyle = StyleSheet.create({
  Background: {
    flex: 1,
    flexDirection: 'column',
    minHeight: 2,
    minWidth: 2,
    // backgroundColor: '#19172B',
  },
  SendIcon: {
    marginLeft: 6,
    marginRight: 8,
    width: 36,
    height: 50,
  },
});

export default MessageView;
