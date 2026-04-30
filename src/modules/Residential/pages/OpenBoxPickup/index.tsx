/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { useSelector } from "react-redux";
import { _pushToastMessage } from "../../../../helpers/messages";
import { _handleError } from "../../../../helpers/errors";
import OrderService from "../../../../services/order.service";
import DoorLockerService from "../../../../services/door_locker.service";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { clear_pickup, set_pickup } from "../../../../redux/actions/pickup";
import CasilleroLleno from "../../assets/casillero_lleno.png";
import { FiCheck, FiLock } from "react-icons/fi";

const OpenBoxPickup = () => {
  const [state, setState] = useState({
    data: "",
    modal: { headerText: "", contentText: "", open: false, type: "warning" },
  });
  const navigate = useNavigate();
  const Order = new OrderService();
  const DoorLocker = new DoorLockerService();
  const { pickup, session } = useSelector((state: any) => ({ pickup: state.pickup, session: state.session }));
  const { boxes } = pickup;
  const dispatch: any = useDispatch();
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (!boxes?.length || hasAutoOpened.current) return;

    const _openPendingDoors = async () => {
      hasAutoOpened.current = true;
      const pending = boxes.filter((item: any) => !item.opened);
      if (!pending.length) return;

      try {
        dispatch(set_loader({ is_loading: true }));
        const nextBoxes = [...boxes];

        for (const box of pending) {
          const payload: any = {
            com: session?.profile?.door_com_number,
            driveboard: box.desk_number,
            door: box.desk_door_number,
            box,
          };

          const response = await DoorLocker.openDoor(payload);
          if (response?.data?.status === "error") {
            throw new Error("No fue posible abrir una de las puertas.");
          }

          const idx = nextBoxes.findIndex((item: any) => item.id === box.id);
          if (idx >= 0) nextBoxes[idx] = { ...nextBoxes[idx], opened: true };
        }

        dispatch(set_pickup({ boxes: nextBoxes }));
      } catch (e: any) {
        _handleError(e, e.message || "No fue posible abrir los casilleros.");
      } finally {
        dispatch(set_loader({ is_loading: false }));
      }
    };

    void _openPendingDoors();
  }, [boxes, dispatch, session]);

  const _handleConfirmModal = async () => {
    const { boxes: pickupBoxes, reservation } = pickup;
    const closed: any = pickupBoxes.find((item: any) => !item.opened);

    if (closed) {
      _pushToastMessage({
        type: "error",
        header: "Error",
        text: "Abre todas las puertas antes de finalizar.",
      });
      _handleCancelModal();
      return;
    }

    try {
      dispatch(set_loader({ is_loading: true }));
      await Order.finishOrder({
        id: reservation.id,
        reservation_type:
          reservation?.reservation_type === "residential_custody_delivered"
            ? "residential_custody_picked"
            : "residential_picked",
      });
      navigate("/");
      dispatch(clear_pickup());
    } catch (e: any) {
      _handleError(
        e,
        "No se puede completar el retiro. Encuentra una persona responsable que te informe sobre tu problema."
      );
    } finally {
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

  const firstBox = boxes?.[0];
  const doorNumber = firstBox?.door_number || firstBox?.desk_door_number || "-";

  return (
    <div className="container-fluid h-100 res-page">
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleConfirmModal}
        onCancel={_handleCancelModal}
      />
      <Header />

      <div className="res-content d-flex justify-content-center align-items-center">
        <div className="res-pickup-open-guided">
          <div className="res-pickup-open-guided__hero-icon" aria-hidden="true">
            <FiCheck />
          </div>

          <h1 className="res-pickup-open-guided__title">¡Retira tu paquete!</h1>
          <p className="res-pickup-open-guided__subtitle">Tu casillero se abrirá automáticamente.</p>

          <img src={CasilleroLleno} alt="Casillero con paquete" className="res-pickup-open-guided__locker" />

          <div className="res-pickup-open-guided__door-card" aria-label={`Puerta ${doorNumber}`}>
            <span>Puerta N°</span>
            <i aria-hidden="true" />
            <strong>{doorNumber}</strong>
          </div>

          <button type="button" className="res-pickup-open-guided__finish" onClick={_handleConfirmModal}>
            Finalizar
          </button>

          <p className="res-pickup-open-guided__note">
            <FiLock aria-hidden="true" />
            <span>No olvides cerrar el casillero al terminar.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpenBoxPickup;
