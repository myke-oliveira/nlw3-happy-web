import axios from 'axios';

const api = axios.create({
  url: 'http://localhost:3333',
});

export default api;