import React, { useContext } from "react";
import {
  Alert,
  useWindowDimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
  LogBox,
  Platform,
} from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Clipboard from "expo-clipboard";

import { sessioncontext } from "../contextprovider";
import { Props } from "../../App";
import messageviewmodel from "../../viewmodels/messages/messageviewmodel";

import AddIcon from "../../assets/addicon.svg";
import ReplyIcon from "../../assets/replyicon.svg";
import CopyIcon from "../../assets/copyicon.svg";
import EditIcon from "../../assets/editicon.svg";
import DeleteIcon from "../../assets/deleteicon.svg";
import QuoteIcon from "../../assets/quoteicon.svg";
import he from "he";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

type routeType = NativeStackScreenProps<Props, "MessageContext">;

const MessageModal = ({ route, navigation }: routeType) => {
  const { thread, deleteMessage, react } = route.params.vm;
  const { message } = route.params;

  const session = useContext(sessioncontext);

  const { height } = useWindowDimensions();

  const footerHeight = 140;
  const headerHeight = 20;
  const minReactionBottom = height - footerHeight;
  const maxReactionTop = headerHeight;

  const reactions = [
    {
      id: 1,
      reaction: "❤️",
    },
    {
      id: 2,
      reaction: "🙂",
    },
    {
      id: 3,
      reaction: "☹️",
    },
    {
      id: 4,
      reaction: "🔥",
    },
    {
      id: 5,
      reaction: "👍",
    },
    {
      id: 6,
      element: (
        <AddIcon
          style={{
            transform: [{ translateX: -4 }, { translateY: 4 }],
            width: 40,
            height: 40,
          }}
        ></AddIcon>
      ),
    },
  ];

  const actions = [
    {
      id: 1,
      title: "Reply",
      element: (
        <ReplyIcon
          style={{
            transform: [{ translateX: -4 }, { translateY: 2 }],
            width: 40,
            height: 40,
          }}
        />
      ),
      action: async () => {
        navigation.navigate("Messages", {
          thread: thread,
          vm: route.params.vm,
          quotedmessage: null,
          parentmessage: message,
          updatemessage: null,
          user: session.user,
        });
      },
    },
    {
      id: 2,
      title: "Quote",
      element: (
        <QuoteIcon
          style={{
            transform: [{ translateX: -3 }, { translateY: 6 }],
            width: 46,
            height: 46,
          }}
        />
      ),
      action: async () => {
        navigation.navigate("Messages", {
          thread: thread,
          vm: route.params.vm,
          quotedmessage: message,
          parentmessage: null,
          updatemessage: null,
          user: session.user,
        });
      },
    },
    {
      id: 3,
      title: "Edit",
      element: (
        <EditIcon
          style={{
            transform: [{ translateY: -5 }],
            width: 30,
            height: 30,
          }}
        />
      ),
      action: async () => {
        navigation.navigate("Messages", {
          thread: thread,
          vm: route.params.vm,
          quotedmessage: null,
          parentmessage: null,
          updatemessage: message,
          user: session.user,
        });
      },
    },
    {
      id: 4,
      title: "Delete",
      element: (
        <DeleteIcon
          style={{
            width: 39,
            height: 39,
          }}
        />
      ),
      action: () => {
        deleteMessage(thread, message);
        navigation.goBack();
      },
    },
    {
      id: 5,
      title: "Copy",
      element: (
        <CopyIcon
          style={{
            transform: [{ translateX: -3 }],
            width: 40,
            height: 40,
          }}
        />
      ),
      action: async () => {
        await Clipboard.setStringAsync(he.decode(message.message), {}).then(
          () => {
            navigation.goBack();
          }
        );
        return true;
      },
    },
  ];

  return (
    <Modal
      onRequestClose={async () => {
        navigation.goBack();
      }}
      transparent={true}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          marginBottom: 75,
          alignItems: "stretch",
          flexDirection: "column",
        }}
      >
        <Pressable
          style={{ flexGrow: 1, height: "100%" }} //Empty space. Press to go back.
          onPress={async () => {
            navigation.goBack();
          }}
        >
          <View style={{ flexGrow: 1 }}></View>
        </Pressable>
        <View
          style={{
            backgroundColor: "#374151",
            height: 52,
            width: "90%",
            position: "absolute",
            marginHorizontal: "5%",
            marginTop:
              route.params.pressPosition - 10 > minReactionBottom
                ? minReactionBottom
                : route.params.pressPosition - 10 < maxReactionTop
                ? maxReactionTop
                : route.params.pressPosition - 10,
            marginBottom: "auto",
            borderRadius: 10,
            shadowRadius: 10,
            justifyContent: "space-evenly",
            flexDirection: "row",
            zIndex: 1,
          }}
        >
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-evenly",
              marginBottom: 7,
              marginTop: 3,
            }}
            horizontal={true}
            scrollEnabled={false}
            data={reactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  react(message, item.reaction);
                  navigation.goBack();
                }}
              >
                {item.element}
                <Text style={{ color: "white", fontSize: 32 }}>
                  {item.reaction}
                </Text>
              </Pressable>
            )}
          />
        </View>
        {/* <Pressable
          style={{ flex: 1 }} //Empty space. Press to go back.
          onPress={async () => {
            navigation.goBack();
          }}
        >
          <View style={{ flex: 1 }} />
        </Pressable> */}
      </View>

      <View
        style={{
          backgroundColor: "#374151",
          height: 75,
          width: "100%",
          bottom: 0,
          position: "absolute",
          flex: 1,
          justifyContent: "space-evenly",
          flexDirection: "row",
        }}
      >
        <FlatList
          contentContainerStyle={{
            justifyContent: "space-evenly",
            flexGrow: 1,
            paddingBottom: 9,
          }}
          horizontal={true}
          scrollEnabled={false}
          data={actions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <View style={{ flexGrow: 1 }}></View>
              <Pressable onPress={item.action}>
                {item.element}
                <Text style={{ color: "white", fontSize: 14 }}>
                  {item.title}
                </Text>
              </Pressable>
            </View>
          )}
        ></FlatList>
      </View>

      {
        //item.parentid === 0 || item.parentid == null ? ( //if message is top-level, show reply input field
        // 	<Input width={'100%'}></Input>
        // ) : null
      }
    </Modal>
  );
};

export default MessageModal;
