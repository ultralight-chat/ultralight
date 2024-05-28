import { ListRenderItem, Text, FlatList } from "react-native";

import reaction from "../../models/reactionAgg";

const ReactionUsers: ListRenderItem<reaction> = ({ item }) => {
  return (
    <FlatList
      scrollEnabled={true}
      data={item.users}
      keyExtractor={(item) => item.userid.toString()}
      renderItem={({ item, index }) => {
        return <Text>{item.username}</Text>;
      }}
    ></FlatList>
  );
};
