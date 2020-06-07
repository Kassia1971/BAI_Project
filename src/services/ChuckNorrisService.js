import http from "../http-externalCall";

export const ChuckNorrisService = {
  getRandom() {
      return http.get("/random");
    }
  }

