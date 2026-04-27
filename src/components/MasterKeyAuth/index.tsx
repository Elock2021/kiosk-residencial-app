/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Input, Modal } from "rsuite";
import { set_loader } from "../../redux/actions/loader";
import MasterKeyService from "../../services/masterkey.service";
import Keyboard from "../Keyboard";

const MasterKeyAuth = (props: any) => {
  const {
    backdrop,
    open,
    title,
    handleConfirm,
    handleClose,
    description,
    action,
    order
  } = props;
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const keyboardRef = useRef<any>();
  const [state, setState] = useState({ data: "" });
  const MasterKey = new MasterKeyService();
  const dispatch: any = useDispatch();

  useEffect(() => {
    if (open) {
      setState({ ...state, data: "" });
    }
  }, [open]);

  const _handleOnKeyPress = (button: any) => {
    console.log("[state]", state.data, "[button]", button);
  };

  const _handleOnChange = (value: any) => {
    setState({ ...state, data: value.toUpperCase() });
  };

  const _handleOnChangeInput = (value: any) => {
    setState({
      ...state,
      data: value.toUpperCase(),
    });
    keyboardRef.current.setInput(value);
  };

  const _handleConfirm = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const payload: any = {
        key: state.data,
        terminal_id: session?.profile?.id,
        action: action || null,
        description: description,
        order_id: order?.id
      };
      await MasterKey.validateAndLogMasterkey(payload);
      handleConfirm({ status: "success", message: "Log creado con éxito." });
    } catch (e: any) {
      handleConfirm({ status: "error", message: e.message });
    }
  };

  return (
    <Modal
      backdrop={backdrop}
      keyboard={false}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>
        <Modal.Title style={{ fontWeight: "500" }}>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="mt-3" style={{ color: "#000" }}>
        <Input
          className="mb-3"
          onChange={_handleOnChangeInput}
          value={state.data}
        />
        <div className="w-100 keyboard-master-key">
          <Keyboard
            keyboardRef={keyboardRef}
            layoutType="spanish_basic_without_space"
            onKeyPress={_handleOnKeyPress}
            onChange={_handleOnChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} appearance="subtle">
          Cancel
        </Button>
        <Button onClick={_handleConfirm} appearance="primary">
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MasterKeyAuth;
