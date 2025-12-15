import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://ucg-deckbuilder.test', // @TODO this shouldn't be hardcoded
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});
