import api from "./api";
import store from "../redux/store";

class MasterKeyService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.security_token}`;
  }

  validateAndLogMasterkey = async (payload: any) => {
    try {
      const response = await api.post(
        `/terminal/master-key/validate-masterkey`,
        payload
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default MasterKeyService;
