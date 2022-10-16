import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://zoo-animal-api.herokuapp.com/',
});

instance.interceptors.response.use(
  res => res.data,
  error => Promise.reject(error),
);

export default instance;
