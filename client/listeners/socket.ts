import { io } from 'socket.io-client';

const Socket = () => {
  const connect = () => {
    const socket = io(process.env.dev_api_server, {
      autoConnect: true,
      transports: ['websocket'],
    });

    // socket.auth = { token: user.userid };
    return socket.connect();
  };

  return { connect };
};

export default Socket;
