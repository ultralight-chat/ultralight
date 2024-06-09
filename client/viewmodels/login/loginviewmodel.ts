import axios from 'axios';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import user from '../../models/user';
import { Platform } from 'react-native';
import { io } from 'socket.io-client';

const loginViewModel = () => {
  // const [error, setError] = useState('');
  const saveSession = async () => {
    // if (window.document.cookie) {
    //     try {
    //         const cookieObject: any =
    //         window.document.cookie
    //             .split(';')
    //             .map(v => v.split('='))
    //             .reduce((acc, v) => {
    //             acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    //             return acc;
    //         }, {});

    //     if (cookieObject?.user && cookieObject.token) {
    //         AsyncStorage.setItem("token", cookieObject.token);
    //         AsyncStorage.setItem("user", cookieObject.user);

    //         const userObj = JSON.parse(JSON.parse(cookieObject.user));
    //         if (userObj?.length === 1)
    //             return userObj[0] as user;
    //     }
    //     } catch(ex){ }

    // } else {
    //     const userObj = JSON.parse(JSON.parse(await AsyncStorage.getItem("user")));

    //     if (userObj?.length === 1)
    //         return userObj[0] as user;
    // }

    const socket = io(process.env.dev_api_server, { autoConnect: true });

    socket.connect();

    // socket.auth = { token: user.userid };

    if (Platform.OS === 'web') {
      return {
        socket: socket,
        user: {
          userid: 1,
          firstname: 'Admin',
          lastname: 'Admin',
          nickname: '',
          profileimage: '',
        } as user,
      };
    } else {
      return {
        socket: socket,
        user: {
          userid: 1,
          firstname: 'Admin',
          lastname: 'Admin',
          nickname: '',
          profileimage: '',
        } as user,
      };
    }
  };

  const getLoggedInUserProfile = () => {};

  return { saveSession };
};

export default loginViewModel;
