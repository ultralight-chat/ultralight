import React from 'react';
import { Navigation } from './components/navigation/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SessionProvider } from './components/contextproviders';

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
