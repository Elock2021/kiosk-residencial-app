import Header from "../../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import AvailableBoxesWithSelect from "../../../../components/AvailableBoxesWithSelect";
import OrderService from "../../../../services/order.service";
import { useSelector } from "react-redux";
import { _handleError } from "../../../../helpers/errors";
import { useDispatch } from "react-redux";
import { set_order } from "../../../../redux/actions/order";
import { _pushToastMessage } from "../../../../helpers/messages";
import { set_loader } from "../../../../redux/actions/loader";

const Boxes = () => {
  const [state, setState] = useState({
    data: "",
    modal: { headerText: "", contentText: "", open: false, type: "warning" },
    boxes: [],
    updated: 0,
  });
  const navigate = useNavigate();
  const Order = new OrderService();
  const dispatch: any = useDispatch();
  const { order, session } = useSelector((state: any) => ({ order: state.order, session: state.session }));

  const _handleNext = () => {
    setState({
      ...state,
      modal: {
        ...state.modal,
        contentText: `¿Estas seguro que necesita solo estas cajas?`,
        open: true,
      },
    });
  };

  const _handleConfirmModal = async () => {
    try {
      const selectedBoxes: any = state.boxes?.filter(
        (item: any) => item.quantity_selected > 0
      );

      if (selectedBoxes?.length === 0) {
        _pushToastMessage({
          type: "error",
          text: "Hay que selecionar por lo menos una caja antes de continuar.",
          header: "Aviso",
        });
        _handleCancelModal();
        return;
      }

      dispatch(set_loader({ is_loading: true }));

      const response: any = await Order.init({
        user: order.user,
        boxes: selectedBoxes,
        terminal: session?.profile,
      });
      _handleCancelModal();
      dispatch(
        set_order({ order: response.data?.order, boxes: response.data?.boxes })
      );
      dispatch(set_loader({ is_loading: false }));
      navigate("/companies");
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
      setState({
        ...state,
        modal: {
          ...state.modal,
          open: false,
        },
        updated: state.updated + 1,
      });
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

  const _handleCallbackBoxes = (payload: any) => {
    setState({ ...state, boxes: payload });
  };

  return (
    <div className="container-fluid h-100 res-page">
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleConfirmModal}
        onCancel={_handleCancelModal}
      />
      <Header />
      <div className="res-content d-flex align-items-center justify-content-center">
        <div className="res-shell d-flex flex-column justify-content-between">
          <div>
            <h2 className="res-title mb-2">Selecciona las cajas disponibles</h2>
            <p className="res-context-text mb-3">
              Marca la cantidad que necesitas y continúa para confirmar.
            </p>
            <AvailableBoxesWithSelect
              onUpdateBox={_handleCallbackBoxes}
              update={state.updated}
            />
          </div>

          <div className="res-footer-actions mt-3">
            <button
              className="main-button"
              onClick={() => navigate("/", { replace: true })}
            >
              Cancelar
            </button>
            <button className="main-button-yellow" onClick={_handleNext}>
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boxes;
