import React, { useContext, createContext } from 'react';
import { LogBox, StyleSheet } from 'react-native';

import { Navigation } from './components/navigation/navigation';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { SessionProvider } from './components/contextproviders';

import thread from './models/thread';
import message from './models/message';
import reaction from './models/reactionAgg';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  //const Drawer = createDrawerNavigator<DrawerProps>();
  // const navigation = useNavigation();

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <Navigation></Navigation>
      </SessionProvider>
    </SafeAreaProvider>
  );
};

export default App;
