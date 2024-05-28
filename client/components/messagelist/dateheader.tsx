import moment from 'moment';
import { ListRenderItem, Text } from 'react-native';
import { MessageListStyle } from './messageliststyle';

export const DateHeader: ListRenderItem<Date> = ({ item }) => {
  return (
    <Text style={MessageListStyle.DateHeader}>
      {moment(item).calendar(null, {
        sameElse: 'MMM D, yyyy',
        lastWeek: 'dddd',
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
      })}
    </Text>
  );
};
