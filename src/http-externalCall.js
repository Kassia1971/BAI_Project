import axios from "axios";

export default axios.create({
  baseURL: "https://api.icndb.com/jokes",
  headers: {
    "Content-type": "application/json"
  }
});
