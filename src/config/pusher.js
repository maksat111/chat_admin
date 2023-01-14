import Pusher from "pusher-js";
import {getToken} from '../utils/getToken';

const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY,{
    broadcaster: 'pusher',
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    authEndpoint: process.env.REACT_APP_PUSHER_AUTH_ENDPOINT,
    wsHost: process.env.REACT_APP_PUSHER_WS_HOST,
    wsPort: process.env.REACT_APP_PUSHER_WS_PORT,
    disableStats: true,
    forceTLS: false,
    encrypted: false,
    enabledTransports: ['ws','wss'],
    auth: {
        headers: {
            Authorization: `Bearer ${getToken() || JSON.parse(localStorage.getItem("chat").token)}`,
            Accept: 'application/json',
        },
      },
});

export default pusher;