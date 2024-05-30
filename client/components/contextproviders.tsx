import { createContext, useContext, useState } from 'react';
import { RootStore } from '../stores/rootstore';

import thread from '../models/thread';

const Context = createContext(null);
const StoreContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  return <Context.Provider value={session}>{children}</Context.Provider>;
};

export const StoreProvider = ({ children }) => {
  const store = new RootStore();
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useMessageStore = (thread: thread): RootStore =>
  useContext(StoreContext);
