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
import BoxComponent from "./Box";
import modResPng from "../../assets/mod_res.png";

const OpenBox = () => {
  const [boxes, setBoxes] = useState<any>([]);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
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
      const { user } = order;

      let box_list = data;

      box_list.sort((a: any, b: any) => {
        return a.is_accessible ? 1 : -1;
      });

      if (user.has_disability) {
        box_list = box_list.filter((box: any) => box.is_accessible);
      }

      const grouped: any = box_list.reduce((acc: any, current: any) => {
        if (acc[current.box_type_id]) {
          acc[current.box_type_id].push(current);
        } else {
          acc[current.box_type_id] = [current];
        }
        return acc;
      }, {});

      const groupedBoxes: any = Object.keys(grouped).map((key: any) => {
        const target: any = grouped[key][0];

        return {
          id: key,
          name: target?.box_type?.name,
          quantity: grouped[key]?.length,
          width: target?.box_type?.width,
          height: target?.box_type?.height,
          depht: target?.box_type?.depht,
          box_type_id: target?.box_type?.id,
          quantity_selected: 1,
        };
      });

      setBoxes(groupedBoxes);

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

      const response: any = await Order.init({
        user: order.user,
        boxes: [box],
        terminal: session?.profile,
      });

      const orderBoxes = response.data?.boxes;

      if (orderBoxes && orderBoxes?.length === 0) {
        throw new Error("No hay cajas disponibles");
      }

      const boxData = orderBoxes[0];

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
      navigate(`/confirmation/${params.apartment}`);
    } catch (e: any) {
      dispatch(set_loader({ is_loading: false }));
      _pushToastMessage({
        type: "error",
        text: e.message,
        header: "Error",
      });
    }
  };

  const helpTemplates = [
    {
      title: "Caja Chica",
      color: "#39B364",
      examples: [
        "Llaves, documentos o billetera",
        "Cargador, cables y accesorios pequeños",
        "Caja de lentes o estuche pequeño",
      ],
    },
    {
      title: "Caja Mediana",
      color: "#39B3A1",
      examples: [
        "Caja de zapatos",
        "Bolso o cartera mediana",
        "Uno o dos paquetes de tamaño medio",
      ],
    },
    {
      title: "Caja Grande",
      color: "#3988B3",
      examples: [
        "Mochila completa",
        "Bolsa de supermercado mediana/grande",
        "Paquete voluminoso que no entra en las anteriores",
      ],
    },
  ];

  const _renderHelpButton = () => (
    <button
      type="button"
      onClick={() => setIsHelpModalOpen(true)}
      className="res-openbox-help-icon-button"
      aria-label="Abrir ayuda"
      title="Ayuda"
    >
      ?
    </button>
  );

  return (
    <div className="container-fluid h-100 res-page">
      <Header />

      <div className="res-content d-flex align-items-center justify-content-center mt-2">
        <div className="res-flow res-openbox-flow" style={{ gap: "8px" }}>
          {_renderHelpButton()}
          <div className="res-title">Selecciona tamaño</div>
          <div className="d-flex justify-content-center align-items-center w-100">
            <div className="w-100">
              <div className="bold d-flex flex-column">
                {loader.is_loading ? (
                  <div className="res-state-message">Cargando cajas...</div>
                ) : (
                  <div className="res-openbox-panel">
                    <div className="res-openbox-image">
                      <img
                        src={modResPng}
                        alt="Modulo residencial"
                        style={{ width: "48%", maxWidth: "100%", height: "auto" }}
                      />
                    </div>

                    {boxes.length > 0 ? (
                      <div className="res-openbox-list">
                        {boxes.map((box: any, index: number) => (
                          <BoxComponent
                            key={index}
                            box={box}
                            _handleOnclickBox={_handleOnclickBox}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="res-openbox-list">
                        <div className="res-openbox-empty res-state-message">
                          <span className="d-block">No hay cajas disponibles</span>
                          <span className="d-block">Por favor deje el paquete en conserjería</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-100 text-center mt-1">
            <button
              className="main-button res-secondary"
              onClick={() => navigate(`/delivery-with-apartament/${params.apartment}`)}
            >
              Volver
            </button>
          </div>
        </div>
      </div>

      {isHelpModalOpen && (
        <div className="res-modal-overlay" onClick={() => setIsHelpModalOpen(false)}>
          <div className="res-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div className="d-flex align-items-center">
                <span
                  className="d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "var(--res-accent)",
                    color: "var(--res-on-accent)",
                    fontWeight: 700,
                  }}
                >
                  ?
                </span>
                <h4 className="mb-0">¿Qué cabe en cada casillero?</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="res-modal-close"
                aria-label="Cerrar ayuda"
              >
                ×
              </button>
            </div>
            <div className="mb-3 p-3 res-modal-note">
              Sugerencia: si no estás seguro, elige un locker un poco más grande para asegurar que tu
              paquete entre sin problema.
            </div>

            {helpTemplates.map((item, index) => {
              const examplesInTwoBullets: string[] =
                item.examples.length > 2
                  ? [item.examples[0], item.examples.slice(1).join(" / ")]
                  : item.examples;

              return (
                <div key={index} className="mb-3 p-3 res-modal-item">
                  <div className="d-flex align-items-center mb-2">
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: item.color,
                        border: "1px solid #000",
                        display: "inline-block",
                        marginRight: "8px",
                      }}
                    />
                    <strong>{item.title}</strong>
                  </div>

                  <ul className="mb-0" style={{ paddingLeft: "18px" }}>
                    {examplesInTwoBullets.map((example: string, i: number) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="d-flex justify-content-center mt-2">
              <button
                type="button"
                className="px-4 main-new-button-yellow"
                onClick={() => setIsHelpModalOpen(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenBox;
