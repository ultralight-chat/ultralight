import { StyleSheet } from 'react-native';

export const MessageViewStyle = StyleSheet.create({
  QuotedMessage: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 14,
    backgroundColor: '#3F3E49',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  Deleted: {
    color: 'red',
    fontWeight: 'bold',
  },
});
