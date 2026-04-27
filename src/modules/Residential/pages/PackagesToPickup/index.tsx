import { useSelector } from "react-redux";
import CardAvailableBoxes from "../../../../components/CardAvailableBoxes";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { _pushToastMessage } from "../../../../helpers/messages";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import OrderService from "../../../../services/order.service";
import { set_pickup } from "../../../../redux/actions/pickup";

/* eslint-disable react-hooks/exhaustive-deps */
const PackagesToPickup = () => {
  const { order, session } = useSelector((state: any) => ({ order: state.order, session: state.session }));
  const { user } = order;
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const [reservations, setReservations] = useState<any[]>([]);
  const searchUrl = new URLSearchParams(window.location.search);

  useEffect(() => {
    _handleGetReservations();
  }, [order]);

  const _handleGetReservations = async () => {
    try {
      if (!user) {
        _pushToastMessage({
          type: "error",
          text: "Esta acción no esta disponible para este usuario.",
          header: "Error",
        });
        navigate("/");
        return;
      }
      dispatch(set_loader({ is_loading: true }));

      const response = await new OrderService().getReservationsByUser({
        delivery_user_id: user.id,
        terminal_id: session?.profile?.id,
      });

      const wait_flow = searchUrl.get("waitflow");

      if (response?.data?.length === 0) {
        dispatch(set_loader({ is_loading: false }));
        if (!wait_flow || wait_flow === "false") {
          _pushToastMessage({
            type: "info",
            text: "No hay encomienda para el residente seleccionado.",
            header: "Información",
          });
        }
        navigate("/");
        return;
      }

      if (
        response?.data?.length === 1 &&
        (!wait_flow || wait_flow === "false")
      ) {
        dispatch(set_loader({ is_loading: false }));
        dispatch(
          set_pickup({
            reservation: response.data[0],
            boxes: response.data[0].boxes,
          })
        );
        navigate("/pickup-without-code/packages/pickup");
        return;
      }

      setReservations(response.data);
      dispatch(set_loader({ is_loading: false }));
    } catch (error: any) {
      dispatch(set_loader({ is_loading: false }));
      _pushToastMessage({
        type: "error",
        text: "No fue posible obtener las reservas.",
        header: "Error",
      });
      navigate("/");
      return;
    }
  };

  const _handleOpenBox = (reservation: any) => {
    // Implement the logic to open the box or handle the reservation
    console.log(`Opening box for reservation #${reservation.id}`);
    dispatch(
      set_pickup({ reservation: reservation, boxes: reservation.boxes })
    );
    navigate("/pickup-without-code/packages/pickup");
  };
  return (
    <div className="container-fluid h-100">
      <Header />

      <div className="content-section">
        <div
          className="row align-items-center justify-content-center mt-5"
          style={{ height: "550px" }}
        >
          <div
            className="h-100 d-flex align-items-center justify-content-center flex-column"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              width: "85%",
              borderRadius: "30px",
            }}
          >
            <div className="bold size-15 mb-5">
              Selecciona cual paquete quieres retirar
            </div>

            <div className="d-flex align-items-center justify-content-center">
              {reservations.map((reservation: any) => (
                <CardAvailableBoxes
                  label={`Reserva #${reservation.id}`}
                  description={user?.name}
                  _handleOpenBox={() => _handleOpenBox(reservation)}
                  key={reservation.id}
                />
              ))}
            </div>
            <div>
              <button
                className="px-4 py-2 main-button bold mt-5"
                onClick={() => navigate("/")}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesToPickup;
