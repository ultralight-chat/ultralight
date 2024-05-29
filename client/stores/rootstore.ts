import { nanoid } from 'nanoid';
import createThreadStore from './threadstore';

export const createRootStore = () => {
  return {
    threadStore: createThreadStore(),
    messageStore: createMessageStore(),
  };
};
