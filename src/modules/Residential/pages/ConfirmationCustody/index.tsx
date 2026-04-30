import { useRef } from "react";
import Header from "../../components/Header";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { set_loader } from "../../../../redux/actions/loader";
import OrderService from "../../../../services/order.service";
import { _handleError } from "../../../../helpers/errors";
import { sleep } from "../../../../helpers/functions";
import { FiCheck, FiLock, FiMessageCircle, FiSmartphone } from "react-icons/fi";
import CasilleroChicoRefV2 from "../../assets/casillero_chico_ref_v2.png";

const ConfirmationCustody = () => {
  const { order } = useSelector((state: any) => ({ order: state.order }));
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const isProcessing = useRef(false);
  const Order = new OrderService();

  const _handleConfirmOrder = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      dispatch(set_loader({ is_loading: true }));
      sleep(1);
      await Order.confirmCustodyOrder(order);
      dispatch(set_loader({ is_loading: false }));
      navigate("/");
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    } finally {
      isProcessing.current = false;
    }
  };

  return (
    <div className="container-fluid h-100 res-page">
      <Header />

      <div className="res-content d-flex justify-content-center align-items-center">
        <div className="res-custody-confirm">
          <div className="res-custody-confirm__hero-icon" aria-hidden="true">
            <FiCheck />
          </div>

          <h1 className="res-custody-confirm__title">¡Casillero abierto!</h1>

          <div className="res-custody-confirm__card">
            <div className="res-custody-confirm__card-visual" aria-hidden="true">
              <div className="res-custody-confirm__visual-circle">
                <img src={CasilleroChicoRefV2} alt="" />
              </div>
            </div>
            <div className="res-custody-confirm__divider" aria-hidden="true" />
            <div className="res-custody-confirm__card-copy">
              <h2>Guarda tus pertenencias</h2>
              <p>Coloca tus cosas dentro del casillero y cierra la puerta .</p>
              <button
                type="button"
                className="res-custody-confirm__card-back"
                onClick={() => navigate(-1)}
              >
                No me sirve este casillero
              </button>
            </div>
          </div>

          <div className="res-custody-confirm__footer-card">
            <div className="res-custody-confirm__footer-item">
              <div className="res-custody-confirm__footer-icon" aria-hidden="true">
                <FiMessageCircle />
              </div>
              <p>Te enviamos el código de retiro por SMS a tu teléfono.</p>
            </div>
            <div className="res-custody-confirm__footer-divider" aria-hidden="true" />
            <div className="res-custody-confirm__footer-item">
              <div className="res-custody-confirm__footer-icon" aria-hidden="true">
                <FiSmartphone />
              </div>
              <p>Revisa tu teléfono cuando lo necesites.</p>
            </div>
          </div>

          <div className="res-custody-confirm__warning">
            <div className="res-custody-confirm__warning-icon" aria-hidden="true">
              <FiLock />
            </div>
            <div className="res-custody-confirm__warning-copy">
              <strong>No olvides cerrar la puerta del casillero</strong>
            </div>
          </div>

          <button type="button" className="res-custody-confirm__finalize" onClick={_handleConfirmOrder}>
            <span>Finalizar</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmationCustody;
