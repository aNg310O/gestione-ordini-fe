import axios from 'axios';

export default axios.create({
  //baseURL: `http://localhost:8082/api/gestione-ordini/`,
  //baseURL: `http://localhost:8081/`,
  baseURL: `https://gestione-ordini-be.vercel.app/`,
  responseType: "json"
});
