import { createAction } from "redux-actions";

export const SET_PICKUP: any = createAction("SET_PICKUP");
export const CLEAR_PICKUP: any = createAction("CLEAR_PICKUP");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_pickup = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_PICKUP(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const clear_pickup = () => {
  return (dispatch: any) => {
    dispatch(CLEAR_PICKUP());
    dispatch(SAVE_STATE());
  };
};
