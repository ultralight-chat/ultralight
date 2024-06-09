import { LogBox, Platform } from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { io } from 'socket.io-client';
import _ from 'lodash';

import { user } from '../../models/user';
import { message, draftMessage } from '../../models/message';
import thread from '../../models/thread';
import reaction from '../../models/reaction';
import { sessioncontext } from '../../components/contextprovider';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useMessageStore } from '../../stores/messagestore';
import { useSession } from '../../components/contextproviders';

const messageViewModel = (thread: thread) => {
  const session = useSession();
  const messageStore = useMessageStore();

  session.socket
    .on('createmessage', (data) => {
      const message = makeObject(data.message)[0];

      // messageStore.removeRead(message.createdbyid);
      messageStore.add(thread, message);

      if (data.socketid != session.socket.id) {
        readMessage(message);
      }
    })
    .on('deletemessage', (data) =>
      messageStore.delete(thread, makeObject(data.message)[0])
    )
    .on('updatemessage', (data) =>
      messageStore.update(thread, makeObject(data.message)[0])
    )
    .on('react', (data) => {
      messageStore.react(thread, data.messageid, makeObject(data.reaction)[0]);
    })
    .on('read', (data) => {
      const user = makeObject(data.user);

      // messageStore.removeRead(user.userid);
      // messageStore.addRead(data.messageid, user);
    });

  const makeObject = (param) => {
    return typeof param === 'string' ? JSON.parse(param) : param;
  };

  const getMessages = async (firstmessageid: number, parentid: number) => {
    await axios
      .get(
        `${process.env.dev_api_server}/messages/${firstmessageid}/threads/${thread.threadid}&parentid=${parentid}&userid=${session.user.userid}`
      )
      .then((response) => {
        messageStore.set(thread, response.data);
      })
      .catch((error) => console.log(error));
  };

  const readMessage = async (message: message) => {
    await axios
      .patch(
        `${process.env.dev_api_server}/threads/${message.threadid}/messages/${message.messageid}&readbyid=${session.user.userid}`
      )
      .then((response) => {
        messageStore.set(thread, response.data);
      })
      .catch((error) => console.log(error));
  };

  const createMessage = (message: draftMessage) => {
    var formData = new FormData();
    formData.append('message', message.message);

    message.attachments?.forEach((a) => {
      formData.append('attachments', {
        //uses a.file for web, or blob for mobile. Both are injested as filestreams
        a, // Test this - if it doesn't work may need to update
      } as unknown as Blob);
    });

    axios({
      method: 'post',
      url: `${process.env.dev_api_server}/messages/threads/${
        message.threadid
      }&parentid=${message.parentid}&createdby=${
        session.user.userid
      }&quotedmessageid=${message.quotedmessage?.messageid ?? 0}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        socketid: session.socket.id,
      },
      transformRequest: (data, headers) => {
        // WORKAROUND - override data to return formData since axios converts that to string
        return formData;
      },
    })
      .then((response) => {
        // setError(error);
        messageStore.add(thread, response.data);
      })
      .catch((error) => console.log(error));
  };

  const deleteMessage = async (message: message) => {
    axios
      .patch(
        `${process.env.dev_api_server}/messages/${message.messageid}/threads/${message.threadid}&parentid=${message.parentid}&deletedby=${session.user.userid}`
      )
      .then((response) => {
        // setError(error);
        messageStore.delete(thread, response.data);
      })
      .catch((error) => console.log(error));
  };

  const updateMessage = async (message: draftMessage) => {
    axios
      .patch(
        `${process.env.dev_api_server}/messages/${message.messageid}/threads/${
          message.threadid
        }&parentid=${message.parentid || 0}&updatedby=${
          session.user.userid
        }&quotedmessageid=${message.quotedmessage?.messageid || 0}`,
        {
          message: message.message,
        }
      )
      .then((response) => {
        messageStore.update(thread, response.data);
      })
      .catch((error) => console.log(error));
  };

  const react = async (message: message, reactionType: string) => {
    //if reaction doesnt exist or user hasn't reacted yet
    await axios
      .put(
        `${process.env.dev_api_server}/messages/${message.messageid}/threads/${message.threadid}&parentid=${message.parentid}&userid=${session.user.userid}`,
        {
          reactiontype: reactionType,
        }
      )
      .then((response) => {
        messageStore.react(thread, response.data[0], response.data[1]);
      })
      .catch((error) => console.log(error));
  };

  // const startTyping = async (threadid, parentid) => {socket.emit("typing", {threadid, parentid})};

  // const endTyping = async (threadid, parentid) => {socket.emit("typingstop", {threadid, parentid})};

  const startTyping = async () => {};
  const endTyping = async () => {};

  const saveFile = async (messages: message[]) => {
    // if (Platform.OS === 'android') {
    // 	const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
    // 	if (permissions.granted) {
    // 		await StorageAccessFramework.createFileAsync(
    // 			permissions.directoryUri,
    // 			'filename',
    // 			'application/json'
    // 		).then(async (fileUri) => {
    // 			await FileSystem.writeAsStringAsync(
    // 				fileUri,
    // 				JSON.stringify(messages),
    // 				{ encoding: FileSystem.EncodingType.UTF8 }
    // 			).catch((e) => {
    // 				console.log(e);
    // 			});
    // 	})
    // }} else if (Platform.OS === 'ios') {
    // 	if (!(await Sharing.isAvailableAsync())) {
    // 		Sharing.shareAsync(fileUri).catch((error) => {
    // 			console.log(error);
    // 		});
    // 	}
    // }
  };

  return {
    startTyping,
    endTyping,
    getMessages,
    createMessage,
    deleteMessage,
    updateMessage,
    react,
  };
};

export default messageViewModel;
