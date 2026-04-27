import { createAction } from "redux-actions";

export const SET_CODES: any = createAction("SET_CODES");
export const CLEAR_CODES: any = createAction("CLEAR_CODES");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_codes = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_CODES(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const clear_codes = () => {
  return (dispatch: any) => {
    dispatch(CLEAR_CODES());
    dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};
