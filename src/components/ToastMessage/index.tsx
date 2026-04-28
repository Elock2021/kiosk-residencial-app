import { Notification } from "rsuite";

const ToastMessage = (props: any) => {
  const { type, header, text } = props;
  const validTypes = ["success", "info", "warning", "error"];
  const safeType = validTypes.includes(type) ? type : "info";

  const message = (
    <Notification
      type={safeType}
      header={header || "Notificación"}
      duration={10000}
      closable
      className={`kiosk-toast kiosk-toast--${safeType}`}
    >
      {text}
    </Notification>
  );

  return message;
};

export default ToastMessage;
