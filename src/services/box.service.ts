import api from "./api";
import store from "../redux/store";

class BoxService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.security_token}`;
  }

  available_boxes = async (payload: any) => {
    try {
      const response = await api.get(
        `/terminal/boxes/available-boxes/${payload}`,
        payload
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  getBoxesStatus = async (payload: any) => {
    try {
      const response = await api.get(
        `/terminal/get-boxes-status/${payload}`,
        payload
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default BoxService;
