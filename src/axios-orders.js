import axios from 'axios';

const instance = axios.create({
  baseURL:'https://react-my-burger-80b03.firebaseio.com/'
});

export default instance;
