import { LogBox, Platform } from 'react-native';

import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { io } from 'socket.io-client';
import _ from 'lodash';

import user from '../../models/user';
import message from '../../models/message';
import thread from '../../models/thread';
import reaction from '../../models/reaction';
import { createContext, useContext } from 'react';
import { sessioncontext } from '../../components/contextprovider';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useStores } from '../../components/contextproviders';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const messageViewModel = (session, thread: thread) => {
  // const [error, setError] = useState('');

  const rootStore = useStores();

  rootStore.messageStore;

  session.socket
    .on('createmessage', (data) => {
      const message = makeObject(data.message)[0];

      messageStore.removeRead(message.createdbyid);
      messageStore.add(message);

      if (data.socketid != session.socket.id) {
        readMessage(message);
      }
    })
    .on('deletemessage', (data) =>
      messageStore.delete(makeObject(data.message)[0])
    )
    .on('updatemessage', (data) =>
      messageStore.update(makeObject(data.message)[0])
    )
    .on('react', (data) => {
      messageStore.react(makeObject(data.reaction)[0]);
    })
    .on('read', (data) => {
      const user = makeObject(data.user);

      messageStore.removeRead(user.userid);
      messageStore.addRead(data.messageid, user);
    });

  const makeObject = (param) => {
    return typeof param === 'string' ? JSON.parse(param) : param;
  };

  const getMessages = async (
    thread: thread,
    firstmessageid: number,
    parentid: number
  ) => {
    if ((await NetInfo.fetch()).isConnected) {
      await axios
        .get(
          `${process.env.dev_api_server}/messages/${firstmessageid}/threads/${thread.threadid}&parentid=0&userid=${session.user.userid}`
        )
        .then((response) => {
          // setError(error);
          // localStorage.setItem('messages', response.data);

          // var messages: message[] = response.data;
          // var prevDate = '';
          // for (let i = 0; i < messages.length; i++) {
          // 	prevDate = DateTime.fromISO(messages[i].createddate).tolocaleString()
          // 	var nextDate = DateTime.fromISO(messages[i + 1].createddate).tolocaleString()
          // 	// if (nextDate !== prevDate) {
          // 	// 	messages.splice(i, 0, DateTime.fromISO(messages[i + 1].createddate).toFormat()
          // 	// }
          // }

          messageStore.set(response.data);
        })
        .catch((error) => console.log(error));
    } else {
      // const messagesString = localStorage.getItem('messages') || '[]'
      // const messages = JSON.parse(messagesString);
      // setMessages(messages || []);
    }
  };

  const readMessage = (message: message) => {
    axios
      .patch(
        `${process.env.dev_api_server}/threads/${message.threadid}/messages/${message.messageid}&readbyid=${session.user.userid}`
      )
      .then((response) => {
        // messageStore.update(response.data[0]);
      })
      .catch((error) => console.log(error));
  };

  const createMessage = (
    thread: thread,
    messageText: string,
    parentMessage?: message,
    quotedmessage?: message,
    attachments?: DocumentPicker.DocumentPickerAsset[]
  ) => {
    var formData = new FormData();
    formData.append('message', messageText);

    attachments?.forEach((a) => {
      formData.append(
        'attachments',
        a.file ??
          ({
            //uses a.file for web, or blob for mobile. Both are injested as filestreams
            uri: a.uri,
            type: a.mimeType,
            size: a.size || 0,
            name: a.name,
          } as unknown as Blob)
      );
    });

    axios({
      method: 'post',
      url: `${process.env.dev_api_server}/messages/threads/${
        thread.threadid
      }&parentid=${parentMessage?.messageid ?? 0}&createdby=${
        session.user.userid
      }&quotedmessageid=${quotedmessage?.messageid ?? 0}`,
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
        // messageStore.add(response.data[0]);
      })
      .catch((error) => console.log(error));
  };

  const deleteMessage = async (thread: thread, message: message) => {
    await axios
      .patch(
        `${process.env.dev_api_server}/messages/${message.messageid}/threads/${thread.threadid}&parentid=${message.parentid}&deletedby=${session.user.userid}`
      )
      .then((response) => {
        // setError(error);
        // messageStore.delete(response.data[0]);
      })
      .catch((error) => console.log(error));
  };

  const updateMessage = (
    thread: thread,
    message: message,
    messageText: string,
    quotedMessage?: message
  ) => {
    axios
      .patch(
        `${process.env.dev_api_server}/messages/${message.messageid}/threads/${
          thread.threadid
        }&parentid=${message.parentid || 0}&updatedby=${
          session.user.userid
        }&quotedmessageid=${quotedMessage?.messageid || 0}`,
        {
          message: messageText,
        }
      )
      .then((response) => {
        // messageStore.update(response.data[0]);
      })
      .catch((error) => console.log(error));
  };

  const react = async (message: message, reactionType: string) => {
    const reaction = message.reactions.find(
      (r) => r.reactiontype === reactionType
    );

    if (
      !reaction ||
      !reaction.users?.find((u) => u.userid == session.user.userid)
    ) {
      //if reaction doesnt exist or user hasn't reacted yet
      await axios
        .put(
          `${process.env.dev_api_server}/messages/${message.messageid}/threads/${message.threadid}&parentid=${message.parentid}&userid=${session.user.userid}`,
          {
            reactiontype: reactionType,
          }
        )
        .then((response) => {
          // messageStore.react(response.data[0]);
        })
        .catch((error) => console.log(error));
    } else {
      await axios
        .delete(
          `${process.env.dev_api_server}/messages/${message.messageid}/threads/${message.threadid}&parentid=${message.parentid}&userid=${session.user.userid}`,
          {
            data: { reactiontype: reactionType },
          }
        )
        .then((response) => {
          // setError(error);
          // messageStore.react(response.data[0]);
          console.log(response);
        })
        .catch((error) => console.log(error));
    }
  };

  // const startTyping = async (threadid, parentid) => {socket.emit("typing", {threadid, parentid})};

  // const endTyping = async (threadid, parentid) => {socket.emit("typingstop", {threadid, parentid})};

  const startTyping = async (thread: thread, parentMessage?: message) => {};
  const endTyping = async (thread: thread, parentMessage?: message) => {};

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
    thread,
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
