import { cloneElement } from "react";
import { Modal } from "rsuite";

const ModalComponent = (props: any) => {
  const { handleClose, size, open, title, children } = props;
  return (
    <Modal size={size} open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>
          <span className="size-09 bold">{title}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cloneElement(children, { handleClose: handleClose })}
      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
