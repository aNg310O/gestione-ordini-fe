import axios from "axios";
import authHeader from "./auth-header";

//const API_URL = "https://heroku-be-gestione-ordini.herokuapp.com/api/auth/";
const API_LOG_URL = "https://manage-order.herokuapp.com/logging/"

class Logging {
  log(severity, username, page, text) {
    return axios.post(API_LOG_URL, {
        severity,
        username,
        page,
        text
      }, { headers: authHeader() })
  }
}

export default new Logging();
