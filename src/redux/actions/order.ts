import { createAction } from "redux-actions";

export const SET_ORDER: any = createAction("SET_ORDER");
export const CLEAR_ORDER: any = createAction("CLEAR_ORDER");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_order = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_ORDER(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const clear_order = () => {
  return (dispatch: any) => {
    dispatch(CLEAR_ORDER());
    dispatch(SAVE_STATE());
  };
};
