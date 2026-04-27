import { useState } from "react";
import RegressiveCounter from "../../../../components/RegressiveCounter";
import Header from "../../components/Header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { useNavigate } from "react-router-dom";
import OrderService from "../../../../services/order.service";
import { _handleError } from "../../../../helpers/errors";
import { sleep } from "../../../../helpers/functions";
// import BoxImage from "../../../../assets/svg/box_black.svg?react";

const ConfirmationCustody = () => {
  const [intervalStateControl, setIntervalStateControl] = useState(0);
  const { order } = useSelector((state: any) => ({ order: state.order }));
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  // const params = useParams();

  const Order = new OrderService();

  const _handleConfirmOrder = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));

      setIntervalStateControl(intervalStateControl + 1);

      sleep(1);

      await Order.confirmCustodyOrder(order);
      dispatch(set_loader({ is_loading: false }));
      navigate("/");
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    }
  };

  // const _handleCancelOrder = async () => {
  //   try {
  //     dispatch(set_loader({ is_loading: true }));
  //     await Order.cancelOrder({ id: order.order?.id });
  //     dispatch(set_loader({ is_loading: false }));
  //     navigate(`/open-box-custody/${params.phone}`);
  //   } catch (e: any) {
  //     _handleError(e, "No fue posible cancelar. ");
  //     dispatch(set_loader({ is_loading: false }));
  //   }
  // };

  return (
    <div className="container-fluid h-100 res-page">
      <Header />

      <div className="res-content d-flex justify-content-center align-items-center">
        <div className="res-confirm-flow">
          <div className="res-confirm-title">Recuerde cerrar el casillero al finalizar</div>
          <div className="w-100 text-center mt-1">
            <button className="main-button res-secondary" onClick={_handleConfirmOrder}>
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

export default ConfirmationCustody;
