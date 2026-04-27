import api from "./api_locker";

class DoorLockerService {
  openDoor = async (payload: any) => {
    // TODO: If realtime locker feedback is needed again, hook it here (socket/event stream) when opening a box.
    if (process.env.REACT_APP_ENVIROMENT === "DEVELOP") {
      return {
        data: {
          status: "success",
        },
      };
    }
    try {
      const response = await api.post(`/open-door`, payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default DoorLockerService;
