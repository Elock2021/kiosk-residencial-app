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
import Circle from "../../../../assets/svg/circle.svg?react";
import BoxImg from "../../../../assets/svg/yellow_box.svg?react";

const OpenBoxCustody = () => {
  const [boxes, setBoxes] = useState<any>([]);
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

      const boxes: any = Object.keys(grouped).map((key: any) => {
        const target: any = grouped[key][0];

        const box: any = {
          id: key,
          name: target?.box_type?.name,
          quantity: grouped[key]?.length,
          width: target?.box_type?.width,
          height: target?.box_type?.height,
          depht: target?.box_type?.depht,
          box_type_id: target?.box_type?.id,
          quantity_selected: 1,
        };

        return box;
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

  return (
    <div className="container-fluid h-100 ">
      <Header />

      <div
        className="d-flex align-items-center justify-content-center mt-5"
        style={{ height: "600px" }}
      >
        <div
          className="h-100 d-flex align-items-center justify-content-around flex-column p-3"
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            width: "80%",
            borderRadius: "30px",
          }}
        >
          <div className="texte-center bold size-15">
            Selecciona el tamaño de caja que necesitas
          </div>
          <div className="w-100 d-flex flex-column align-items-center">
            {boxes.length === 0 && (
              <div
                className="my-2 d-flex align-items-center justify-content-start px-4 text-black"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  width: "50%",
                  height: "126px",
                  borderRadius: "10px",
                }}
              >
                <div
                  className="d-flex justify-content-center align-items-center position-relative"
                  style={{ width: "100px" }}
                >
                  <Circle
                    style={{
                      position: "absolute",
                      width: "100px",
                      height: "100px",
                    }}
                  />
                  <BoxImg
                    style={{
                      position: "absolute",
                      width: "70px",
                      height: "70px",
                    }}
                  />
                </div>
                <div className="ms-4 text-white">
                  <div className="bold d-flex flex-column">
                    {loader.is_loading ? (
                      <span>Cargando cajas...</span>
                    ) : (
                      <>
                        <span>No hay cajas disponibles</span>
                        <span>Por favor deje el paquete en consejeria</span>
                      </>
                    )}
                  </div>
                  <div className="d-flex flex-column size-08"></div>
                </div>
              </div>
            )}

            {boxes.map((box: any, index: number) => (
              <BoxComponent
                key={index}
                box={box}
                _handleOnclickBox={_handleOnclickBox}
              />
            ))}
          </div>
          <div className="w-100 text-center">
            <button
              className="px-4 py-2 main-button bold"
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
    </div>
  );
};

export default OpenBoxCustody;
