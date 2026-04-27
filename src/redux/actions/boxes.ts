import { createAction } from "redux-actions";

export const SET_BOXES: any = createAction("SET_BOXES");
export const CLEAR_BOXES: any = createAction("CLEAR_BOXES");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_boxes = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_BOXES(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};

export const clear_boxes = () => {
  return (dispatch: any) => {
    dispatch(CLEAR_BOXES());
    dispatch(SAVE_STATE());
  };
};
