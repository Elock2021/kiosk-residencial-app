import api from "./api";
import store from "../redux/store";

class TerminalService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.security_token}`;
  }

  setModule = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/module/set-module`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  setDoors = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/module/set-doors`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default TerminalService;
