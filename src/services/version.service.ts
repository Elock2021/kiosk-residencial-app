import api from "./api_locker";
import store from "../redux/store";

class VersionService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common["Authorization"] = `${session.security_token}`;
  }

  actualVersion = async () => {
    try {
      const response = await api.get(`/api/v1/versions/actual`);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  checkForUpdates = async ({ terminal_id }: any) => {
    try {
      const response = await api.get(
        `/api/v1/versions/check-updates?terminal_id=${terminal_id}`
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  checkForAutoUpdates = async ({ terminal_id }: any) => {
    try {
      const response = await api.get(
        `/api/v1/versions/check-auto-updates?terminal_id=${terminal_id}`
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  updateSoftware = async ({ module }: { module: string }) => {
    try {
      const response = await api.get(
        `/api/v1/versions/update-software?module=${module}`
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default VersionService;
