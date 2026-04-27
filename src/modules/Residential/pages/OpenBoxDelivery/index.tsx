import Header from "../../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import BoxToOpenDelivery from "../../../../components/BoxToOpenDelivery";
import { useSelector } from "react-redux";
import { _handleError } from "../../../../helpers/errors";
import OrderService from "../../../../services/order.service";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import RegressiveCounter from "../../../../components/RegressiveCounter";
import { sleep } from "../../../../helpers/functions";

const OpenBoxDelivery = () => {
  const [state, setState] = useState({
    data: "",
    modal: { headerText: "", contentText: "", open: false, type: "warning" },
    modal_cancel: { headerText: "", contentText: "", open: false, type: "warning" },
  });

  const [intervalStateControl, setIntervalStateControl] = useState(0);

  const { order } = useSelector((state: any) => ({ order: state.order }));
  const navigate = useNavigate();
  const Order = new OrderService();
  const dispatch: any = useDispatch();

  const _handleConfirmOrder = async () => {
    try {
      const boxOpened: any = order.boxes?.filter((item: any) => item.opened);

      if (boxOpened.length === 0) {
        _handleCancelOrder();
        return;
      }

      order.boxes = boxOpened;

      dispatch(set_loader({ is_loading: true }));

      setIntervalStateControl(intervalStateControl + 1);

      sleep(1)

      await Order.confirmOrder(order);
      dispatch(set_loader({ is_loading: false }));
      navigate("/");
    } catch (e: any) {
      _handleError(e, e.message);
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
      modal_cancel: {
        ...state.modal_cancel,
        open: false,
      },
    });
  };

  const _handleCancelOrder = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));
      await Order.cancelOrder({ id: order.order?.id });
      dispatch(set_loader({ is_loading: false }));
      navigate("/");
    } catch (e: any) {
      _handleError(e, "No fue posible cancelar. ");
      dispatch(set_loader({ is_loading: false }));
    }
  };

  return (
    <div className="container-fluid h-100">
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleConfirmOrder}
        onCancel={_handleCancelModal}
      />

      <ConfirmationModal
        {...state.modal_cancel}
        onConfirm={_handleCancelOrder}
        onCancel={_handleCancelModal}
      />
      <Header />
      <div className="content-section px-4 d-flex flex-column justify-content-around">
        <BoxToOpenDelivery module="residential" action="residential" />
        <div className="row">
          <div className="col-12 text-center px-0">
            <button
              className="px-4 py-2 border-0 main-button bold"
              onClick={_handleConfirmOrder}
            >
              <div className="d-flex justify-content-center align-items-center">
                <div className="me-3">Finalizar</div>
                <RegressiveCounter clearIntervalAction={intervalStateControl} handleCallback={_handleConfirmOrder} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenBoxDelivery;
