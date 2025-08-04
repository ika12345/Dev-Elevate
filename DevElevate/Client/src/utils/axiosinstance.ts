import axios from 'axios';

const instance = axios.create({
  baseURL: `http://localhost:8000/api`,
  withCredentials: true, // This is the key change!
  headers: {
    'Content-Type': 'application/json',
  },
});


export default instance;
