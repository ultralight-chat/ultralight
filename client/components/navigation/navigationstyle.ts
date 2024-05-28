import { StyleSheet } from 'react-native';

export const NavigationStyle = StyleSheet.create({
  MessagesHeader: {
    flexGrow: 1,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
  },
  ThreadIcon: {
    height: 40,
    width: 40,
    marginRight: 15,
    borderRadius: 40,
    overflow: 'hidden',
    alignSelf: 'center',
    resizeMode: 'cover',
  },
});
