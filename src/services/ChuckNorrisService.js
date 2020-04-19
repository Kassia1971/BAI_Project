import http from "../http-externalCall";
class TutorialDataService {
  getRandom() {
      return http.get("/random");
    }
  }

export default new TutorialDataService();
