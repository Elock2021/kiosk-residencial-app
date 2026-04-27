/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import { Button, Input, Modal, SelectPicker } from "rsuite";
import { com_list, number_list } from "./select_data";

const TestComDoors = (props: any) => {
  const { backdrop, open, title, handleClose } = props;
  const [state, setState] = useState<any>({ inputs: {} });
  const [door, setDoor] = useState('0');
  const [comDoor, setComDoor] = useState('COM1');
  const [driveboard, setDriveboard] = useState('0');

  const _handleOnChangeInput = ({ name, value }: any) => {
    state.inputs[name] = value;
    setState({ ...state });
  };

  return (
    <Modal
      backdrop={backdrop}
      keyboard={false}
      open={open}
      onClose={handleClose}
      size="lg"
    >
      <Modal.Header>
        <Modal.Title style={{ fontWeight: "500" }}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="mt-3" style={{ color: "#000" }}>
        <div className="row w-100 align-items-end">
          <div className="col-12 size-09 mt-4 mb-2 bold">Abrir Puerta</div>
          <div className="col-3">
            <label>COM</label>
            <SelectPicker
              data={com_list}
              value={comDoor}
              className="w-100"
              placeholder="Seleciona un puerto"
              onChange={(value: any) => setComDoor(value)}
              locale={{ searchPlaceholder: "Buscar" }}
            />
          </div>
          <div className="col-3">
            <label>Driveboard</label>
            <SelectPicker
              data={number_list}
              value={driveboard}
              className="w-100"
              placeholder="Seleciona un driveboard"
              onChange={(value: any) => setDriveboard(value)}
              locale={{ searchPlaceholder: "Buscar" }}
            />
          </div>
          <div className="col-3">
            <label>Puerta</label>
            <SelectPicker
              data={number_list}
              value={door}
              className="w-100"
              placeholder="Seleciona una puerta"
              onChange={(value: any) => setDoor(value)}
              locale={{ searchPlaceholder: "Buscar" }}
            />
          </div>
          <div className="col-3">
            <Button onClick={handleClose} appearance="primary">
              Abrir Puerta
            </Button>
          </div>
        </div>

        <hr style={{ opacity: ".1" }} />

        <div className="row w-100 align-items-center">
          <div className="col-12 size-09 mt-4 mb-2 bold">Leer Código Qr</div>
          <div className="col-3">
            <label>Código</label>
            <Input
              className="mb-3"
              onChange={(value: any) =>
                _handleOnChangeInput({ name: "com_qrcode", value })
              }
              value={state.inputs.com_qrcode}
            />
          </div>
          <div className="col-3">
            <Button onClick={handleClose} appearance="primary">
              Leer Código
            </Button>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TestComDoors;
