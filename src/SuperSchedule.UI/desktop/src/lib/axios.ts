import Axios from "axios";

import { API_URL } from "../config/index";

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
  },
});
