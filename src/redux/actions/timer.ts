import { createAction } from "redux-actions";

export const SET_TIMER: any = createAction("SET_TIMER");
export const RESET_TIMER: any = createAction("RESET_TIMER");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_timer = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_TIMER(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const reset_timer = () => {
  return (dispatch: any) => {
    dispatch(RESET_TIMER());
    dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};
