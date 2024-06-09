import { FlashList } from '@shopify/flash-list';
import { Image, StyleSheet } from 'react-native';

import { user } from '../../models/user';

export const LastReadList = (props: { lastreadusers: user[] }) => {
  return (
    <FlashList
      style={{
        flex: 1,
        height: 20,
        marginTop: -20,
        marginRight: 5,
      }}
      scrollEnabled={false}
      horizontal={true}
      inverted={true}
      data={props.lastreadusers}
      keyExtractor={(user) => String(user.profileimageuri)}
      renderItem={({ item }) => {
        return (
          <Image
            style={LastReadListStyle.ProfileImage}
            source={{
              uri: item.profileimageuri,
            }}
          />
        );
      }}
    ></FlashList>
  );
};

const LastReadListStyle = StyleSheet.create({
  ProfileImage: {
    height: 18,
    width: 18,
    marginHorizontal: 1,
    borderRadius: 10,
    overflow: 'hidden',
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});
