import { toaster } from "rsuite";
import ToastMessage from "../components/ToastMessage";

export const _pushToastMessage = (data: {
  type: string;
  header: string;
  text: string;
  placement?:
    | "topStart"
    | "topCenter"
    | "topEnd"
    | "bottomStart"
    | "bottomCenter"
    | "bottomEnd";
}) => {
  const message: any = ToastMessage(data);
  toaster.push(message, { placement: data.placement || "bottomCenter" });
};
