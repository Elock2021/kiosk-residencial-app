import { handleActions } from "redux-actions";
import { CLEAR_BOXES, SET_BOXES } from "../actions/boxes";

export const INITIAL_STATE = {
  box_list: [],
};

export default handleActions(
  {
    [SET_BOXES]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [CLEAR_BOXES]: () => {
      return { ...INITIAL_STATE };
    },
  },
  INITIAL_STATE
);
