import { _pushToastMessage } from "./messages";

export const _handleError = (e: any, defaultMessage: any = "") => {
  _pushToastMessage({
    type: "error",
    header: "Error",
    text: e.response?.data?.message || defaultMessage,
  });
};
