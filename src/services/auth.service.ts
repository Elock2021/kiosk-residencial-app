import api from "./api";

class AuthService {
  signin = async (payload: any) => {
    try {
      const response = await api.post("/auth/terminal/sign-in", payload);
      return response;
    } catch (e: any) {
      return Promise.reject(e);
    }
  };
}

export default AuthService;
