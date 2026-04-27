import { createAction } from "redux-actions";

export const SET_LOADER: any = createAction("SET_LOADER");
export const SAVE_STATE: any = createAction("SAVE_STATE");

export const set_loader = (payload: any) => {
  return async (dispatch: any) => {
    await dispatch(SET_LOADER(payload));
    await dispatch(SAVE_STATE());
    return Promise.resolve();
  };
};
