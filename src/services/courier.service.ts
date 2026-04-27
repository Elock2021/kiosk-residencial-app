import api from "./api";
import store from "../redux/store";

class CourierService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.security_token}`;
  }

  list = async () => {
    try {
      const response = await api.get(`/terminal/couriers/list/select-list`);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default CourierService;
