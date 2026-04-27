import { handleActions } from "redux-actions";
import { RESET_TIMER, SET_TIMER } from "../actions/timer";

export const INITIAL_STATE = {
  seconds: process.env.REACT_APP_TIMER_SECONDS,
};

export default handleActions(
  {
    [SET_TIMER]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [RESET_TIMER]: () => {
      return { ...INITIAL_STATE };
    },
  },
  INITIAL_STATE
);
