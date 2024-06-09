import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Image, View, Text, Pressable } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Models
import thread from '../../models/thread';
import { message } from '../../models/message';
import reaction from '../../models/reaction';

//Views
import Login from '../../views/login/loginview';
import Messages from '../../views/messages/messageview';
import Threads from '../../views/threads/threadview';

//Components
import { sessioncontext } from '../contextprovider';
import MessageModal from '../messagelist/_modals/messagecontextmodal';

//ViewModels
import threadviewmodel from '../../viewmodels/threads/threadviewmodel';

//Styles
import { NavigationStyle } from './navigationstyle';

//Assets
import HamburgerMenu from '../assets/hamburger.svg';

export type RouteProps = {
  Login;
  Messages: { thread: thread };
  Threads;
  MessageContext: { thread: thread; message: message; pressPosition: number };
  ReactionUsers: { reaction: reaction };
};

export type DrawerProps = {
  MessageHambugerMenu: { thread: thread };
};

const Navigation = (props: any) => {
  const Stack = createNativeStackNavigator<RouteProps>();
  const session = useContext(sessioncontext);

  const insets = useSafeAreaInsets(); //Should use SafeAreaView from this library instead if possible?

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Threads">
        {!session ? (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={Login}
          ></Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="Threads"
              component={Threads}
              options={() => ({
                headerShown: true,
                headerStyle: {
                  backgroundColor: '#374151',
                  borderBottomWidth: 0,
                },
                headerTitleStyle: {
                  fontWeight: 'bold',
                  color: 'white',
                },
                headerRight: () => (
                  <HamburgerMenu style={{ height: 30, width: 30 }} />
                ),
              })}
            />
            <Stack.Screen
              name="Messages"
              component={Messages}
              options={({ route, navigation }) => ({
                header: () => (
                  <View
                    style={[
                      NavigationStyle.MessagesHeader,
                      {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                      },
                    ]}
                  >
                    <HeaderBackButton
                      tintColor="white"
                      onPress={navigation.goBack}
                    />
                    <Image
                      style={NavigationStyle.ThreadIcon}
                      source={{
                        uri: route.params.thread.iconurl,
                      }}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: 'white',
                      }}
                    >
                      {route.params.thread.name}
                    </Text>
                    <Pressable
                      style={{
                        position: 'absolute',
                        right: 10,
                      }}
                      onPress={() => {}}
                    >
                      <HamburgerMenu style={{ height: 30, width: 30 }} />
                    </Pressable>
                  </View>
                ),
              })}
            />

            <Stack.Screen
              options={{
                headerShown: false,
                presentation: 'transparentModal',
              }}
              name="MessageContext"
              component={MessageModal}
            />
          </>
        )}
      </Stack.Navigator>
      {/* <Drawer.Navigator
							screenOptions={{
								drawerStyle: {
									backgroundColor: '#c6cbef',
									width: 240,
								},
								drawerStatusBarAnimation: 'slide',
							}}
						>
							{/* <Drawer.Screen name="MessageHamburgerMenu" component={MessageHamburgerMenu}/>}
						</Drawer.Navigator> */}
    </NavigationContainer>
  );
};

export { Navigation };
