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
        <div className="res-confirm-guided">
          <div className="res-confirm-guided__panel">
            <p className="res-confirm-guided__eyebrow">Antes de finalizar</p>
            <h1 className="res-confirm-guided__title">Cierra la puerta del casillero</h1>
            <p className="res-confirm-guided__hint">Empuja la puerta hasta escuchar el clic.</p>

            <div className="res-confirm-guided__actions">
              <button
                type="button"
                className="res-confirm-guided__primary res-confirm-guided__primary--danger"
                onClick={_handleGoBackToBoxSelection}
              >
                No me sirve el casillero
              </button>

              <button
                type="button"
                className="res-confirm-guided__secondary"
                onClick={_handleConfirmOrder}
              >
                Finalizar
              </button>

              <div className="res-confirm-guided__countdown" aria-live="polite">
                <span className="res-confirm-guided__countdown-label">Finaliza automáticamente en</span>
                <span className="res-confirm-guided__timer-badge" aria-label="Tiempo restante para finalizar automáticamente">
                <RegressiveCounter
                  clearIntervalAction={intervalStateControl}
                  handleCallback={_handleConfirmOrder}
                />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
