/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "rsuite";
import moment from "moment";
import CardOpenBoxDashboard from "../../../components/CardOpenBoxDashboard";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { _handleError } from "../../../helpers/errors";
import { _pushToastMessage } from "../../../helpers/messages";
import { set_loader } from "../../../redux/actions/loader";
import DoorLockerService from "../../../services/door_locker.service";
import DashboardTemplate from "../DashboardTemplate";
import BoxService from "../../../services/box.service";
import { set_session } from "../../../redux/actions/session";
import OrderService from "../../../services/order.service";
import "../dashboard-modern.scss";

const DashboardHome = () => {
  const [actionModal, setActionModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [validOrders, setValidOrders] = useState<any[]>([]);
  const { session, loader } = useSelector((state: any) => ({ session: state.session, loader: state.loader }));
  const dispatch: any = useDispatch();
  const DoorLocker = new DoorLockerService();

  useEffect(() => {
    _refreshDashboardData();
  }, []);

  const _refreshDashboardData = async () => {
    try {
      dispatch(set_loader({ ...loader, is_loading: true }));
      const [boxesResponse, ordersResponse] = await Promise.all([
        new BoxService().getBoxesStatus(session?.profile?.username),
        new OrderService().validOrders(session?.profile?.id),
      ]);

      dispatch(set_session({ ...session, profile: boxesResponse.data?.profile }));
      setValidOrders(ordersResponse.data || []);
      dispatch(set_loader({ ...loader, is_loading: false }));
    } catch (e) {
      console.log(e);
      dispatch(set_loader({ ...loader, is_loading: false }));
    }
  };

  const _getActiveReservations = (box: any) =>
    (box?.valid_reservations || []).filter((reservation: any) => reservation.is_active);

  const _handleSelectBox = (payload: any) => {
    setSelectedBox(payload);
    setActionModal(true);
  };

  const _handleBoxAction = async (actionToExecute: "OPEN_BOX" | "CANCEL_ORDER") => {
    setActionModal(false);

    if (actionToExecute === "CANCEL_ORDER") {
      setConfirmDeleteModal(true);
      return;
    }

    await _handleOpenDoorAction(selectedBox);
  };

  const _openBox = async (box: any) => {
    const data: any = {
      com: session?.profile?.door_com_number,
      driveboard: box?.desk_number,
      door: box?.desk_door_number,
      box,
    };

    const response = await DoorLocker.openDoor(data);
    if (response.data.status === "error") {
      throw new Error("No fue posible abrir esta puerta.");
    }
  };

  const _cancelActiveReservations = async (box: any) => {
    const activeReservations = _getActiveReservations(box);
    for (const reservation of activeReservations) {
      await new OrderService().cancelOrder({
        id: reservation?.order_id,
      });
    }
    await _refreshDashboardData();
  };

  const _getSelectedOrder = () => {
    const activeReservation = _getActiveReservations(selectedBox)[0];
    if (!activeReservation?.order_id) {
      return null;
    }
    return validOrders.find((order: any) => order.id === activeReservation.order_id) || null;
  };

  const _buildFallbackOrderDetail = () => {
    const activeReservation = _getActiveReservations(selectedBox)[0];
    if (!activeReservation) {
      return null;
    }
    return {
      delivery_user: activeReservation.delivery_user || {},
      delivered_at: activeReservation.delivered_at || null,
      reservations: [{ boxes: [selectedBox], code: activeReservation.code || "-" }],
    };
  };

  const _handleOpenDoorAction = async (box: any) => {
    try {
      dispatch(set_loader({ is_loading: true }));
      await _openBox(box);
      _pushToastMessage({
        header: "Éxito",
        type: "success",
        text: "Puerta abierta con exito",
      });

      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      dispatch(set_loader({ is_loading: false }));
      if (e.message === "Network Error") {
        _handleError(
          e,
          "No fue posible conectarse a la api del terminal. Revisa la api y los COM's."
        );
      } else {
        _handleError(e, e.message);
      }
    }
  };

  const activeReservation = _getActiveReservations(selectedBox)[0];
  const orderDetail = _getSelectedOrder() || _buildFallbackOrderDetail();
  const hasActiveOrder = Boolean(activeReservation);

  const _handleConfirmDeleteOrder = async () => {
    try {
      setConfirmDeleteModal(false);
      dispatch(set_loader({ is_loading: true }));
      await _cancelActiveReservations(selectedBox);
      _pushToastMessage({
        header: "Éxito",
        type: "success",
        text: "Orden cancelada con éxito.",
      });
      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      dispatch(set_loader({ is_loading: false }));
      _handleError(e, e.message);
    }
  };

  return (
    <DashboardTemplate>
      <ConfirmationModal
        open={confirmDeleteModal}
        type="warning"
        variant="kiosk"
        headerText="Confirmar eliminación"
        contentText={`¿Está seguro que desea eliminar el pedido del residente ${
          orderDetail?.delivery_user?.name || "-"
        } en la puerta ${selectedBox?.door_number || "-"}?`}
        cancelText="Volver"
        confirmText="Sí, eliminar"
        onCancel={() => setConfirmDeleteModal(false)}
        onConfirm={_handleConfirmDeleteOrder}
      />

      <Modal
        open={actionModal}
        onClose={() => setActionModal(false)}
        size="lg"
        className="db-action-modal"
        dialogClassName="db-action-modal__dialog"
      >
        <Modal.Header closeButton={false} className="db-action-modal__header-wrap">
          <div className="db-action-modal__header">
            <div>
              <div className="db-action-modal__eyebrow">Gestión de puerta</div>
              <h2 className="db-action-modal__title">Puerta {selectedBox?.door_number}</h2>
            </div>
            <button
              type="button"
              className="db-action-modal__close"
              onClick={() => setActionModal(false)}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="db-action-modal__body">
          <div className={`db-action-modal__status ${hasActiveOrder ? "db-action-modal__status--busy" : "db-action-modal__status--free"}`}>
            {hasActiveOrder ? "Pedido activo en esta puerta" : "Puerta libre para apertura inmediata"}
          </div>

          {hasActiveOrder ? (
            <div className="db-action-modal__detail-grid">
              <div className="db-action-modal__detail-card">
                <div className="db-action-modal__detail-label">Nombre</div>
                <div className="db-action-modal__detail-value">
                  {orderDetail?.delivery_user?.name || "-"}
                </div>
              </div>
              <div className="db-action-modal__detail-card">
                <div className="db-action-modal__detail-label">Fecha entrega</div>
                <div className="db-action-modal__detail-value">
                  {orderDetail?.delivered_at
                    ? moment(orderDetail?.delivered_at).format("DD/MM/YYYY HH:mm:ss")
                    : "Aguardando entrega..."}
                </div>
              </div>
              <div className="db-action-modal__detail-card">
                <div className="db-action-modal__detail-label">Puertas</div>
                <div className="db-action-modal__detail-value">
                  {orderDetail?.reservations &&
                    orderDetail?.reservations[0]?.boxes?.map((box: any) => box.door_number)
                      .join(" , ")}
                </div>
              </div>
              <div className="db-action-modal__detail-card">
                <div className="db-action-modal__detail-label">Código</div>
                <div className="db-action-modal__detail-value">
                  {orderDetail?.reservations && orderDetail?.reservations[0]?.code}
                </div>
              </div>
            </div>
          ) : (
            <div className="db-action-modal__empty">
              Selecciona una acción para operar esta puerta.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="db-action-modal__footer">
          <div className="db-action-modal__actions">
            <Button
              appearance="primary"
              className="db-action-modal__btn db-action-modal__btn--primary"
              onClick={() => _handleBoxAction("OPEN_BOX")}
            >
              Abrir puerta
            </Button>
            {hasActiveOrder && (
              <Button
                appearance="ghost"
                className="db-action-modal__btn db-action-modal__btn--danger"
                onClick={() => _handleBoxAction("CANCEL_ORDER")}
              >
                Eliminar pedido
              </Button>
            )}
            <Button
              appearance="subtle"
              className="db-action-modal__btn db-action-modal__btn--neutral"
              onClick={() => setActionModal(false)}
            >
              Cerrar
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="w-100 px-4 py-2 mx-0 mb-4 mt-3 db-dashboard-grid">
        <div className="db-cards-grid">
          {session?.profile?.boxes?.map((currentBox: any) => (
            <CardOpenBoxDashboard
              door_number={currentBox.door_number}
              onSelectBox={_handleSelectBox}
              status={currentBox.valid_reservations?.length > 0 ? "Ocupado" : "Libre"}
              key={currentBox.id}
              data={currentBox}
            />
          ))}
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default DashboardHome;
