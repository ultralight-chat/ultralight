import { StyleSheet } from 'react-native';

export const MessageListStyle = StyleSheet.create({
  Parent: {
    paddingLeft: 5,
  },
  Child: {
    marginLeft: 53,
    paddingLeft: 10,
    borderLeftColor: '#80ffff',
    borderLeftWidth: 0.5,
  },
  ParentQuote: {
    paddingLeft: 5,
    marginLeft: 48,
    marginRight: 5,
  },
  ChildQuote: {
    marginLeft: 101,
    marginRight: 5,
    paddingLeft: 10,
  },
  QuoteText: {
    backgroundColor: '#3F3E49',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    opacity: 0.5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  ProfileImageStandard: {
    height: 35,
    width: 35,
    marginHorizontal: 6,
    marginTop: 6,
    borderRadius: 40,
    overflow: 'hidden',
  },
  ProfileImageSmall: {
    height: 18,
    width: 18,
    marginHorizontal: 1,
    borderRadius: 10,
    overflow: 'hidden',
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  Message: {
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  Deleted: {
    color: 'red',
    fontWeight: 'bold',
  },
  Reacted: {
    borderColor: '#363636',
    backgroundColor: '#457995',
  },
  NotReacted: {
    backgroundColor: '#374151',
  },
  DateHeader: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    backgroundColor: '#3F3E49',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
