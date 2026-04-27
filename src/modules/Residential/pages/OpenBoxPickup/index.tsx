/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { useSelector } from "react-redux";
import { _pushToastMessage } from "../../../../helpers/messages";
import { _handleError } from "../../../../helpers/errors";
import OrderService from "../../../../services/order.service";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { clear_pickup } from "../../../../redux/actions/pickup";
import RegressiveCounter from "../../../../components/RegressiveCounter";
import BoxToOpenPickupResidential from "../../../../components/BoxToOpenPickupResidential";

const OpenBoxPickup = () => {
  const [state, setState] = useState({
    data: "",
    modal: { headerText: "", contentText: "", open: false, type: "warning" },
  });
  const navigate = useNavigate();
  const Order = new OrderService();
  const { pickup } = useSelector((state: any) => ({ pickup: state.pickup }));
  const { boxes } = pickup;
  const dispatch: any = useDispatch();
  const [paused, setPaused] = useState(true);

  const [intervalStateControl, setIntervalStateControl] = useState(0);

  useEffect(() => {
    const closed: any = boxes.find((item: any) => !item.opened);
    if (!closed) setPaused(false);
  }, [pickup]);

  const _handleConfirmModal = async () => {
    const { boxes, reservation } = pickup;
    const closed: any = boxes.find((item: any) => !item.opened);

    if (closed) {
      _pushToastMessage({
        type: "error",
        header: "Error",
        text: "Abre todas las puertas antes de finalizar.",
      });
      _handleCancelModal();
      return;
    }

    setIntervalStateControl(intervalStateControl + 1);

    try {
      dispatch(set_loader({ is_loading: true }));
      await Order.finishOrder({
        id: reservation.id,
        reservation_type:
          reservation?.reservation_type === "residential_custody_delivered"
            ? "residential_custody_picked"
            : "residential_picked",
      });
      dispatch(set_loader({ is_loading: true }));
      navigate("/");
      dispatch(set_loader({ is_loading: false }));
      dispatch(clear_pickup());
    } catch (e: any) {
      _handleError(
        e,
        "No se puede completar el retiro. Encuentra una persona responsable que te informe sobre tu problema."
      );
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleCancelModal = () => {
    setState({
      ...state,
      modal: {
        ...state.modal,
        open: false,
      },
    });
  };

  return (
    <div className="container-fluid h-100 res-page">
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleConfirmModal}
        onCancel={_handleCancelModal}
      />
      <Header />
      <div className="res-content px-4 d-flex flex-column justify-content-around">
        <BoxToOpenPickupResidential action="pickup" />
        <div className="res-footer-actions res-footer-actions--center mb-4">
          <button className="main-button" onClick={_handleConfirmModal}>
            <div className="d-flex justify-content-center align-items-center">
              <div className="me-3">Finalizar</div>
              <RegressiveCounter
                clearIntervalAction={intervalStateControl}
                handleCallback={_handleConfirmModal}
                paused={paused}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpenBoxPickup;
