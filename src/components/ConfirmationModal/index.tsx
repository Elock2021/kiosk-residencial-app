import { HiBadgeCheck } from "react-icons/hi";
import { TiWarning } from "react-icons/ti";
import { TiDelete } from "react-icons/ti";

const ConfirmationModal = (props: any) => {
  const { open, type, headerText, contentText, onConfirm, onCancel } = props;

  const Warning = () => <TiWarning className="res-confirm-icon res-confirm-icon--warning" />;
  const Danger = () => <TiDelete className="res-confirm-icon res-confirm-icon--danger" />;
  const Success = () => <HiBadgeCheck className="res-confirm-icon res-confirm-icon--success" />;

  const Types: any = {
    undefined: "",
    success: <Success />,
    danger: <Danger />,
    warning: <Warning />,
  };

  return (
    <div
      className={`${open ? "d-flex" : "d-none"} justify-content-center align-items-center res-confirm-overlay`}
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 2000,
        background: "var(--res-overlay, rgba(0, 0, 0, 0.65))",
      }}
    >
      {/* Design decision: consistent modal actions improve clarity for touch users. */}
      <div
        className="row p-4 res-confirm-card"
        style={{
          width: "min(680px, 94vw)",
          background: "var(--res-surface, #f3f3f3)",
          borderRadius: "20px",
          border: "1px solid var(--res-border-strong, rgba(0,0,0,0.24))",
          color: "var(--res-text, #1b1b1b)",
        }}
      >
        <div className="size-09 bold d-flex align-items-center gap-2">
          {Types[type]} {headerText || "Confirmación"}
        </div>
        <div className="py-3">{contentText || "¿Está seguro de que desea realizar esta acción?"}</div>
        <div className="text-end d-flex justify-content-end gap-2">
          <button className="main-button btn btn-outline-secondary px-4 py-2" onClick={onCancel}>
            Cancelar
          </button>
          <button className="main-button-yellow btn btn-outline-dark px-4 py-2" onClick={onConfirm}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
