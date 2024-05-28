import { useCallback, useContext, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// import { observable, computed } from 'mobx';
import axios from 'axios';

import { Props } from '../../App';
import threadCache from './threadcache';
import thread from '../../models/thread';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const threadViewModel = (session) => {
  // const [error, setError] = useState('');

  const cache = threadCache(session);

  // const makeObject = (param) => {
  // 	return typeof param === 'string' ? JSON.parse(param) : param;
  // }

  const getThreads = async () => {
    await axios
      .get(`${process.env.dev_api_server}/threads/users/${session.user.userid}`)
      .then((response) => {
        // setError(error);
        cache.set(response.data);
      })
      .catch((error) => console.log(error));
  };

  const createThread = async (name: string, description: string) => {
    var formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    //formData.append("iconurl", iconurl);

    await axios({
      method: 'post',
      url: `${process.env.dev_api_server}/threads?createdby=${session.user.userid}`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        // setError(error);
        cache.add(response.data);
      })
      .catch((error) => console.log(error));
  };

  const deleteThread = async (threadid: number) => {
    await axios
      .patch(
        `${process.env.dev_api_server}/threads/${threadid}&deletedby=${session.user.userid}`
      )
      .then((response) => {
        // setError(error);
        cache.delete(response.data);
      })
      .catch((error) => console.log(error));
  };

  return {
    cache,
    getThreads,
    createThread,
    deleteThread,
  };
};

export default threadViewModel;
