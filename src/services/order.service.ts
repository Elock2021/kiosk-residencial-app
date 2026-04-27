import api from "./api";
import store from "../redux/store";

class OrderService {
  constructor() {
    const { session } = store.getState();
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${session.security_token}`;
  }

  init = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/init`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  initCustody = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/custody/init`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  initPickupBox = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/init-pickup-box`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  confirmOrder = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/confirm`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  confirmCustodyOrder = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/custody/confirm`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  confirmOrderPickupBox = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/confirm-pickup-box`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  cancelOrder = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/cancel`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  checkCode = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/check-code`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  getReservationsByUser = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/get-reservations-by-user`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  checkReservationCode = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/reservation/check-code`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  checkReservationServiceCode = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/reservation/services/check-code`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  checkReservationServiceCodeHome = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/reservation/services/check-code/home`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  finishOrder = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/finish-order`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  deliveryService = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/delivery/services`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  deliveryOrder = async (payload: any) => {
    try {
      const response = await api.post(`/terminal/orders/delivery-order`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };

  validOrders = async (payload: any) => {
    try {
      const response = await api.get(
        `/terminal/orders/valid-orders/${payload}`
      );
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default OrderService;
