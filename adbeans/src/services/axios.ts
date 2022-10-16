import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://zoo-animal-api.herokuapp.com/',
});

export default instance;
