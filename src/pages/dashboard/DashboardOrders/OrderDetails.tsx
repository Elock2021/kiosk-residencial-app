import moment from "moment";
import { Button, Modal } from "rsuite";

const OrderDetails = (props: any) => {
  const { handleClose, size, open, title, data } = props;
  return (
    <Modal size={size} open={open} onClose={handleClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row w-100" style={{ color: "#999" }}>
          <div className="col-6">
            <div className="size-09">Nombre:</div>
            <div className="size-09 ms-1">{data?.delivery_user?.name}</div>
          </div>
          <div className="col-6">
            <div className="size-09">Fecha entrega:</div>
            <div className="size-09 ms-1">
              {data?.delivered_at
                ? moment(data?.delivered_at).format("DD/MM/YYYY HH:mm:ss")
                : "Aguardando entrega..."}
            </div>
          </div>
          <div className="col-6 mt-3">
            <div className="size-09">Puertas</div>
            <div className="size-09 ms-1">
              {data?.reservations &&
                data?.reservations[0]?.boxes
                  ?.map((box: any) => box.door_number)
                  .join(" , ")}
            </div>
          </div>

          <div className="col-6 mt-3">
            <div className="size-09">Código</div>
            <div className="size-09 ms-1">
              {data?.reservations && data?.reservations[0]?.code}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cancelar
        </Button>
        <Button onClick={handleClose} appearance="primary">
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetails;
