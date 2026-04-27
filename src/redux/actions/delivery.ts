import { createAction } from "redux-actions";

export const SET_DELIVERY: any = createAction("SET_DELIVERY");
export const CLEAR_DELIVERY: any = createAction("CLEAR_DELIVERY");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_delivery = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_DELIVERY(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const clear_delivery = () => {
  return (dispatch: any) => {
    dispatch(CLEAR_DELIVERY());
    dispatch(SAVE_STATE());
  };
};
