/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { set_order } from "../../redux/actions/order";
import { set_pickup } from "../../redux/actions/pickup";
import DoorLockerService from "../../services/door_locker.service";
import { _handleError } from "../../helpers/errors";
import { set_delivery } from "../../redux/actions/delivery";
import { useEffect } from "react";
import { set_timer } from "../../redux/actions/timer";
import Circle from "../../assets/svg/circle.svg?react";
import User from "../../assets/svg/user.svg?react";
import { set_loader } from "../../redux/actions/loader";

const CardOpenBox = (props: any) => {
  const { box_type, door_number, data, action, boxQuantity } = props;
  const { order, pickup, delivery, session } = useSelector(
    (state: any) => state
  );
  const dispatch: any = useDispatch();
  const DoorLocker = new DoorLockerService();

  useEffect(() => {
    if (boxQuantity === 1) {
      _handleOpenBox()
    }
  }, []);

  const styles = {
    card: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "7px",
      maxWidth: "270px",
      minWidth: "250px",
      maxHeight: "240px",
    },
    imageWrapper: {
      backgroundColor: "rgb(255 255 160)",
      borderRadius: "50%",
      width: "45px",
      height: "45px",
    },
  };

  const _handleOpenBox = async () => {
    dispatch(set_timer({ seconds: process.env.REACT_APP_TIMER_SECONDS || 20 }));
    dispatch(set_loader({ is_loading: true }));
    try {
      switch (action) {
        case "pickup":
          await _handleOpenBoxPickup();
          break;
        case "delivery":
          await _handleOpenBoxDelivery();
          break;
        default:
          await _handleOpenBoxDefault();
      }
    } catch (e: any) {
      _handleError(e, e.message);
    } finally {
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleOpenBoxPickup = async () => {
    const { boxes: boxesPickup } = pickup;
    const boxPickup: any = boxesPickup.find((item: any) => item.id === data.id);
    const payloadPickup: any = {
      com: session?.profile?.door_com_number,
      driveboard: boxPickup.desk_number,
      door: boxPickup.desk_door_number,
      box: boxPickup
    };
    const responsePickup = await DoorLocker.openDoor(payloadPickup);
    if (responsePickup.data.status === "error") {
      throw new Error("No fue posible abrir esta puerta.");
    }
    boxPickup.opened = true;
    dispatch(set_pickup({ boxes: boxesPickup }));
  };

  const _handleOpenBoxDelivery = async () => {
    const { boxes: boxesDelivery } = delivery;
    const boxDelivery: any = boxesDelivery.find(
      (item: any) => item.id === data.id
    );
    const payloadDelivery: any = {
      com: session?.profile?.door_com_number,
      driveboard: boxDelivery.desk_number,
      door: boxDelivery.desk_door_number,
      box: boxDelivery
    };
    const responseDelivery = await DoorLocker.openDoor(payloadDelivery);
    if (responseDelivery.data.status === "error") {
      throw new Error("No fue posible abrir esta puerta.");
    }
    boxDelivery.opened = true;
    dispatch(set_delivery({ boxes: boxesDelivery }));
  };

  const _handleOpenBoxDefault = async () => {
    const { boxes } = order;
    const box: any = boxes.find((item: any) => item.id === data.id);
    const payload: any = {
      com: session?.profile?.door_com_number,
      driveboard: box.desk_number,
      door: box.desk_door_number,
      box: box
    };

    const response = await DoorLocker.openDoor(payload);
    if (response.data.status === "error") {
      throw new Error("No fue posible abrir esta puerta.");
    }
    box.opened = true;
    dispatch(set_order({ boxes }));
  };

  return (
    <div
      className={`p-2 d-flex flex-column justify-content-between mx-2 my-3 shadow ${
        data?.opened
          ? "border border-3 border-warning"
          : "border border-3 border-dark"
      }`}
      style={styles.card}
    >
      <div
        className="w-100 d-flex justify-content-center align-items-center position-relative"
        style={{ width: "100%", height: "60px" }}
      >
        <Circle className="position-absolute" style={{width: '50px', height: '50px'}} />
        <User className="position-absolute" style={{width: '30px', height: '30px'}} />
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column text-center px-2 mt-2">
        <div>
          <div className="w-100 size-11 bold">Caja {door_number}</div>
          <div className="w-100 size-07">
            {box_type?.name} {data?.opened ? ` - Abierto` : ""}
          </div>
        </div>
      </div>

      <div className="row mt-3 px-5 mb-3">
        <button
          className="me-4 px-4 py-2 border-0 main-button-yellow bold shadow"
          onClick={_handleOpenBox}
        >
          Abrir
        </button>
      </div>
    </div>
  );
};

export default CardOpenBox;
