import React, { useContext } from 'react';
import {
  View,
  LogBox,
  ImageBackground,
  Button,
  Text,
  Platform,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Props } from '../../App';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type routeType = NativeStackScreenProps<Props, 'Login'>;

const LoginView = ({ route, navigation }: routeType) => {
  return (
    <View style={{ backgroundColor: '#19172B', flex: 1, paddingTop: 5 }}>
      <ImageBackground
        source={require('../../assets/loginbackground.jpg')}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: '40%',
            height: 40,
            position: 'absolute',
            bottom: 50,
          }}
        >
          <Pressable
            onPress={async () => {
              // await WebBrowser.openBrowserAsync(`${dev_api_server}/auth/google`);
            }}
          ></Pressable>
        </View>
      </ImageBackground>
    </View>
  );
};

export default LoginView;
