/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import BoxToOpenPickup from "../../../../components/BoxToOpenPickup";
import { useSelector } from "react-redux";
import { _pushToastMessage } from "../../../../helpers/messages";
import { _handleError } from "../../../../helpers/errors";
import OrderService from "../../../../services/order.service";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { clear_pickup } from "../../../../redux/actions/pickup";
import RegressiveCounter from "../../../../components/RegressiveCounter";
import { sleep } from "../../../../helpers/functions";

const OpenBoxDeliveryService = () => {
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
    sleep(1)

    try {
      dispatch(set_loader({ is_loading: true }));

      await Order.deliveryService({
        id: reservation.id,
        reservation_type: "residential_delivered",
      });

      dispatch(set_loader({ is_loading: true }));
      navigate("/");
      dispatch(set_loader({ is_loading: false }));
      dispatch(clear_pickup());
    } catch (e: any) {
      _handleError(
        e,
        "No fue posible completar la entrega. Encuentra una persona responsable que te informe sobre tu problema."
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
    <div className="container-fluid h-100">
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleConfirmModal}
        onCancel={_handleCancelModal}
      />
      <Header />
      <div className="content-section px-4 d-flex flex-column justify-content-around">
        <BoxToOpenPickup action="pickup" />
        <div className="row">
          <div className="col-12 text-center px-0">
            {/* <button
              className="me-4 px-4 py-2 border-0 main-button bold"
              onClick={() => navigate("/", { replace: true })}
            >
              Cancelar
            </button> */}
            <button
              className="px-4 py-2 main-button bold"
              onClick={_handleConfirmModal}
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="me-3">Finalizar</div>
                <RegressiveCounter clearIntervalAction={intervalStateControl} handleCallback={_handleConfirmModal} paused={paused} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenBoxDeliveryService;
