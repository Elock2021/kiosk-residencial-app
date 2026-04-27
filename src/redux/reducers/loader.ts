import { handleActions } from "redux-actions";
import { SET_LOADER } from "../actions/loader";

export const INITIAL_STATE = {
  is_loading: false,
};

export default handleActions(
  {
    [SET_LOADER]: (state: any, action: any) => {
      return { ...state, ...action.payload };
    },
  },
  INITIAL_STATE
);
