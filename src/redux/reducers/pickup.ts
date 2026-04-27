import { handleActions } from "redux-actions";
import { CLEAR_PICKUP, SET_PICKUP } from "../actions/pickup";

export const INITIAL_STATE = {
  reservation: {},
  boxes: []
};

export default handleActions(
  {
    [SET_PICKUP]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [CLEAR_PICKUP]: () => {
      return { ...INITIAL_STATE };
    },
  },
  INITIAL_STATE
);
