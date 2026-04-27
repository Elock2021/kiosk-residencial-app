import { Notification } from "rsuite";

const ToastMessage = (props: any) => {
  const { type, header, text } = props;
  const message = (
    <Notification
      type={type}
      header={header}
      duration={10000}
      closable
      style={{ color: "#000" }}
    >
      {text}
    </Notification>
  );

  return message;
};

export default ToastMessage;
