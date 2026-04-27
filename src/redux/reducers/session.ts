import { handleActions } from "redux-actions";
import { SET_SESSION, CLEAR_SESSION } from "../actions/session";

export const INITIAL_STATE = {
  is_logged: false,
  is_connected: false,
  sign_in_component: true,
  created_at: undefined,
};

export default handleActions(
  {
    [SET_SESSION]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [CLEAR_SESSION]: () => {
      return {...INITIAL_STATE};
    },
  },
  INITIAL_STATE
);
