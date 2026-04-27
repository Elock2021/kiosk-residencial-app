import { handleActions } from "redux-actions";
import { CLEAR_DELIVERY, SET_DELIVERY } from "../actions/delivery";

export const INITIAL_STATE = {
  reservation: {},
  boxes: {}
};

export default handleActions(
  {
    [SET_DELIVERY]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [CLEAR_DELIVERY]: () => {
      return { ...INITIAL_STATE };
    },
  },
  INITIAL_STATE
);
