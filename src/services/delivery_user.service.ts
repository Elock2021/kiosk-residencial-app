import api from "./api";
import store from "../redux/store";

class DeliveryUserService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.security_token}`;
  }

  list_users = async (payload: any) => {
    try {
      const response = await api.get(
        `/terminal/delivery-users/users/${payload}`,
        payload
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  filter_users = async ({
    terminal_id,
    params,
  }: {
    terminal_id: string;
    params: any;
  }) => {
    
    const queue_string = Object.keys(params).map((key) => {
      return `${key}=${params[key]}`;
    }).join('&');

    try {
      const response = await api.get(
        `/terminal/delivery-users/users/${terminal_id}?${queue_string}`,
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  list_users_pickup_box = async (payload: any) => {
    try {
      const response = await api.get(
        `/terminal/delivery-users/pickup-box/users/${payload}`,
        payload
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default DeliveryUserService;
