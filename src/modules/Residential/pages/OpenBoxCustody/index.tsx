/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { useSelector } from "react-redux";
import BoxService from "../../../../services/box.service";
import { _pushToastMessage } from "../../../../helpers/messages";
import { useNavigate, useParams } from "react-router-dom";
import OrderService from "../../../../services/order.service";
import { set_order } from "../../../../redux/actions/order";
import DoorLockerService from "../../../../services/door_locker.service";
import BoxComponent from "../OpenBox/Box";

const OpenBoxCustody = () => {
  const [boxes, setBoxes] = useState<any>([]);
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const { session, order, loader } = useSelector((state: any) => ({ session: state.session, order: state.order, loader: state.loader }));

  const navigate = useNavigate();
  const params = useParams();
  const Box = new BoxService();
  const dispatch: any = useDispatch();
  const Order = new OrderService();
  const DoorLocker = new DoorLockerService();

  useEffect(() => {
    _getAvailableBoxes();
  }, []);

  const _getAvailableBoxes = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const response: any = await Box.available_boxes(session?.profile?.id);
      const { data } = response;

      let box_list = data;

      box_list.sort((a: any, b: any) => {
        return a.is_accessible ? 1 : -1;
      });

      const grouped: any = box_list.reduce((acc: any, current: any) => {
        if (acc[current.box_type_id]) {
          acc[current.box_type_id].push(current);
        } else {
          acc[current.box_type_id] = [current];
        }
        return acc;
      }, {});

      const boxes: any = [1, 2, 3].map((boxTypeId: number) => {
        const currentGroup: any[] = grouped[boxTypeId] || [];
        const target: any = currentGroup[0] || {};

        return {
          id: `${boxTypeId}`,
          name: target?.box_type?.name || `Casillero ${boxTypeId}`,
          quantity: currentGroup.length,
          width: target?.box_type?.width || 0,
          height: target?.box_type?.height || 0,
          depht: target?.box_type?.depht || 0,
          box_type_id: boxTypeId,
          quantity_selected: 1,
        };
      });

      setBoxes(boxes);

      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      _pushToastMessage({
        type: "warning",
        text: "No fue posible cargar las cajas disponibles",
        header: "Aviso",
      });
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleOnclickBox = async (box: any) => {
    try {
      dispatch(set_loader({ is_loading: true }));

      const response: any = await Order.initCustody({
        user: order.user,
        boxes: [box],
        terminal: session?.profile,
      });

      const boxes = response.data?.boxes;

      if (boxes && boxes?.length === 0)
        throw new Error("No hay cajas disponibles");

      const boxData = boxes[0];

      const payload: any = {
        com: session?.profile?.door_com_number,
        driveboard: boxData.desk_number,
        door: boxData.desk_door_number,
        box: boxData,
      };

      const responseOpenDoor = await DoorLocker.openDoor(payload);

      if (responseOpenDoor.data?.status === "error") {
        throw new Error("No fue posible abrir la puerta.");
      }

      dispatch(
        set_order({ order: response.data?.order, boxes: response.data?.boxes })
      );

      dispatch(set_loader({ is_loading: false }));

      navigate(`/confirmation/custody/${params.phone}`);
    } catch (e: any) {
      dispatch(set_loader({ is_loading: false }));
      _pushToastMessage({
        type: "error",
        text: e.message,
        header: "Error",
      });
    }
  };

  const getBoxLabel = (box: any) => {
    if (box?.box_type_id === 1) return "pequeño";
    if (box?.box_type_id === 2) return "mediano";
    if (box?.box_type_id === 3) return "grande";
    return String(box?.name || "seleccionado");
  };

  const _handleRequestBoxSelection = (box: any) => {
    setSelectedBox(box);
    setIsSelectionModalOpen(true);
  };

  const _handleCancelSelection = () => {
    setIsSelectionModalOpen(false);
    setSelectedBox(null);
  };

  const _handleConfirmSelection = async () => {
    if (!selectedBox) return;
    const boxToOpen = selectedBox;
    setIsSelectionModalOpen(false);
    setSelectedBox(null);
    await _handleOnclickBox(boxToOpen);
  };

  return (
    <div className="container-fluid h-100 res-page">
      <Header />
      <div className="res-content d-flex align-items-start justify-content-center mt-2">
        <div className="res-flow res-openbox-flow res-size-step">
          <p className="res-size-step__subtitle">
            Selecciona el espacio ideal según el tamaño de lo que deseas guardar.
          </p>

          {loader.is_loading ? (
            <div className="res-state-message">Cargando cajas...</div>
          ) : boxes.length > 0 ? (
            <div className="res-size-step__cards">
              {boxes.map((box: any) => (
                <BoxComponent key={box.box_type_id} box={box} _handleOnclickBox={_handleRequestBoxSelection} />
              ))}
            </div>
          ) : (
            <div className="res-size-step__empty res-state-message">
              <span className="d-block">No hay cajas disponibles</span>
              <span className="d-block">Por favor deje el paquete en conserjería</span>
            </div>
          )}

          <div className="w-100 text-center mt-4">
            <button
              type="button"
              className="res-help-back-button"
              onClick={() =>
                navigate(`/info-custody?phone=${params.phone}`, {
                  replace: true,
                })
              }
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {isSelectionModalOpen && (
        <div className="res-modal-overlay" onClick={_handleCancelSelection}>
          <div className="res-modal res-box-selection-modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="res-box-selection-modal__title">
              ¿Está seguro que quiere seleccionar el casillero {getBoxLabel(selectedBox)}?
            </h4>
            <p className="res-box-selection-modal__text">
              Si tu paquete no cabe, en la siguiente pantalla toca{" "}
              <strong>“No me sirve el casillero”</strong>.
            </p>
            <div className="res-box-selection-modal__actions">
              <button type="button" className="res-help-back-button" onClick={_handleCancelSelection}>
                Cancelar
              </button>
              <button type="button" className="main-button-yellow" onClick={_handleConfirmSelection}>
                Sí, seleccionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenBoxCustody;
