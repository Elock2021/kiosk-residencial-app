import axios from "axios";
import { clear_session } from "../redux/actions/session";
import store from "../redux/store";
import { navigationRef } from "../helpers/navigationHelper";
import moment from "moment";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-type": "application/json",
  },
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || "30000"),
});

instance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error && error.message && error.message.includes("timeout")) {
      const Window: any = window;
      const message =
        "No fue posible completar la solicitud en el tiempo esperado. API EXTERNA - url: " +
        error?.config?.url +
        " - " +
        moment().format("YYYY-MM-DD HH:mm:ss");
      console.log(message);

      if (Window && Window.electronAPI) {
        Window.electronAPI.createErrorLog(message);
      }

      if (navigationRef.navigate) {
        navigationRef.navigate("/");
      } else {
        window.location.href = "/";
      }

      return Promise.reject({
        message:
          "No fue posible completar la solicitud en el tiempo esperado. Por favor intente nuevamente.",
      });
    }
    if (error.response && error.response.status === 401) {
      const dispatch: any = store.dispatch;
      dispatch(clear_session());
    }
    return Promise.reject(error);
  }
);

export default instance;
