import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ListRenderItem,
  Pressable,
  LogBox,
} from "react-native";
import thread from "../../models/thread";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const Thread: ListRenderItem<thread> = ({ item }) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 2,
        paddingVertical: 5,
      }}
    >
      <Image
        style={{
          height: 35,
          width: 35,
          marginTop: 4,
          marginRight: 6,
          borderRadius: 40,
          overflow: "hidden",
        }}
        resizeMode="cover"
        source={{
          uri: item.iconurl,
        }}
      />
      <View
        style={{
          flexShrink: 1,
          flexDirection: "column",
          paddingBottom: 2,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: item.unreadcount > 0 ? "bold" : "normal",
            }}
          >
            {item.name}
          </Text>
          {item.unreadcount > 0 ? (
            <Text
              style={{
                color: "orange",
                fontSize: 16,
                fontWeight: "bold",
                // alignSelf: 'center',
                paddingLeft: 5,
              }}
            >
              ({item.unreadcount} unread)
            </Text>
          ) : null}
        </View>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: item.unreadcount > 0 ? "bold" : "normal",
          }}
        >
          {item.description}
        </Text>
      </View>
    </View>
  );
};

export default Thread;
