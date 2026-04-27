import { handleActions } from "redux-actions";
import { CLEAR_ORDER, SET_ORDER } from "../actions/order";

export const INITIAL_STATE = {
  user: {},
  boxes: [],
  company: {},
};

export default handleActions(
  {
    [SET_ORDER]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [CLEAR_ORDER]: () => {
      return { ...INITIAL_STATE };
    },
  },
  INITIAL_STATE
);
