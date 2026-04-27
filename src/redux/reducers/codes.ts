import { handleActions } from "redux-actions";
import { CLEAR_CODES, SET_CODES } from "../actions/codes";

export const INITIAL_STATE = {
  codes: [],
};

export default handleActions(
  {
    [SET_CODES]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
    [CLEAR_CODES]: () => {
      return { ...INITIAL_STATE };
    },
  },
  INITIAL_STATE
);
