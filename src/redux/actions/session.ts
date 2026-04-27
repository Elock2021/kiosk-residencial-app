import { createAction } from "redux-actions";

export const SET_SESSION: any = createAction("SET_SESSION");
export const CLEAR_SESSION: any = createAction("CLEAR_SESSION");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_session = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_SESSION(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const clear_session = () => {
  return (dispatch: any) => {
    dispatch(CLEAR_SESSION());
    dispatch(SAVE_STATE());
  };
};
