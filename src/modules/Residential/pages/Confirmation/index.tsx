import { useRef, useState } from "react";
import RegressiveCounter from "../../../../components/RegressiveCounter";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { useNavigate, useParams } from "react-router-dom";
import OrderService from "../../../../services/order.service";
import { _handleError } from "../../../../helpers/errors";
import { sleep } from "../../../../helpers/functions";
// import BoxImage from "../../../../assets/svg/box_black.svg?react";

const Confirmation = () => {
  const [intervalStateControl, setIntervalStateControl] = useState(0);
  const { order } = useSelector((state: any) => ({ order: state.order }));
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const isProcessing = useRef(false);

  const Order = new OrderService();

  const _stopCounter = () => {
    setIntervalStateControl((prev) => prev + 1);
  };

  const _handleConfirmOrder = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      dispatch(set_loader({ is_loading: true }));

      _stopCounter();

      sleep(1);

      await Order.confirmOrder(order);
      dispatch(set_loader({ is_loading: false }));
      navigate("/");
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    } finally {
      isProcessing.current = false;
    }
  };

  const _handleGoBackToBoxSelection = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    const targetPath = params.apartment
      ? `/open-box-delivery/${params.apartment}`
      : "/open-box-delivery";

    try {
      _stopCounter();
      dispatch(set_loader({ is_loading: true }));

      if (order.order?.id) {
        await Order.cancelOrder({ id: order.order.id });
      }
    } catch (e: any) {
      _handleError(e, "No fue posible cancelar. ");
    } finally {
      dispatch(set_loader({ is_loading: false }));
      navigate(targetPath);
      isProcessing.current = false;
    }
  };

  return (
    <div className="container-fluid h-100 res-page">
      <Header />

      <div className="res-content d-flex justify-content-center align-items-center">
        <div className="res-confirm-flow">
          <div className="res-confirm-title">Recuerde cerrar el casillero al finalizar</div>
          <button className="main-button res-secondary" onClick={_handleGoBackToBoxSelection}>
            No me sirve el casillero
          </button>

          <div className="w-100 text-center mt-1">
            <button className="main-button-yellow res-primary" onClick={_handleConfirmOrder}>
              <div className="d-flex justify-content-center align-items-center">
                <div className="me-3">Finalizar</div>
                <RegressiveCounter
                  clearIntervalAction={intervalStateControl}
                  handleCallback={_handleConfirmOrder}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
