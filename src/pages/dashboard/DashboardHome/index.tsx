/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CardOpenBoxDashboard from "../../../components/CardOpenBoxDashboard";
import MasterKeyAuth from "../../../components/MasterKeyAuth";
import { _handleError } from "../../../helpers/errors";
import { _pushToastMessage } from "../../../helpers/messages";
import { set_loader } from "../../../redux/actions/loader";
import DoorLockerService from "../../../services/door_locker.service";
import DashboardTemplate from "../DashboardTemplate";
import MasterKeyService from "../../../services/masterkey.service";
import BoxService from "../../../services/box.service";
import { set_session } from "../../../redux/actions/session";
import OrderService from "../../../services/order.service";

const DashboardHome = () => {
  const [masterKeyModal, setMasterKeyModal] = useState(false);
  const [box, setBox] = useState<any>(null);
  const [action, setAction] = useState<any>("OPEN_BOX");
  const { session, loader } = useSelector((state: any) => ({ session: state.session, loader: state.loader }));
  const dispatch: any = useDispatch();
  const DoorLocker = new DoorLockerService();
  const MasterKey = new MasterKeyService();

  useEffect(() => {
    _refreshBoxesStatus();
  }, []);

  const _refreshBoxesStatus = async () => {
    try {
      dispatch(set_loader({ ...loader, is_loading: true }));
      const Box = new BoxService();
      const response: any = await Box.getBoxesStatus(session?.profile?.username);
      dispatch(set_session({ ...session, profile: response.data?.profile }));
      dispatch(set_loader({ ...loader, is_loading: false }));
    } catch (e) {
      console.log(e);
      dispatch(set_loader({ ...loader, is_loading: false }));
    }
  };

  const _handleOpenBox = (payload: any) => {
    setAction("OPEN_BOX");
    if (!session?.master_key?.is_connected) {
      setMasterKeyModal(true);
      setBox(payload);
    }

    if (session?.master_key?.is_connected) {
      _handleOpenBoxWithMasterKey(payload);
    }
  };

  const _handleOpenBoxAndCancel = (payload: any) => {
    setAction("OPEN_BOX_AND_CANCEL");
    if (!session?.master_key?.is_connected) {
      setMasterKeyModal(true);
      setBox(payload);
    }

    if (session?.master_key?.is_connected) {
      _handleOpenBoxWithMasterKey(payload, "OPEN_BOX_AND_CANCEL");
    }
  };

  const _handleOpenBoxWithMasterKey = async (
    payload: any,
    openAction = "OPEN_BOX"
  ) => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const masterkey_payload: any = {
        key: session?.master_key?.code,
        terminal_id: session?.profile?.id,
        action: "OPEN_BOX",
        description:
          "El usuario {USER} abrió una caja con un codigo QR en el locker {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}",
        order_id: null,
      };

      await MasterKey.validateAndLogMasterkey(masterkey_payload);

      const data: any = {
        com: session?.profile?.door_com_number,
        driveboard: payload?.desk_number,
        door: payload?.desk_door_number,
        box: payload,
      };

      const response = await DoorLocker.openDoor(data);
      if (response.data.status === "error") {
        throw new Error("No fue posible abrir esta puerta.");
      }

      if (openAction !== "OPEN_BOX" && data?.box?.valid_reservations?.length > 0) {
        for (const reservation of data?.box?.valid_reservations) {
          if (reservation.is_active) {
            await new OrderService().cancelOrder({
              id: reservation?.order_id,
            });
          }
        }
        await _refreshBoxesStatus();
      }

      _pushToastMessage({
        header: "Éxito",
        type: "success",
        text: "Caja abierta con exito",
      });
      dispatch(set_loader({ is_loading: false }));
      setMasterKeyModal(false);
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

  const _handleConfirmMasterKey = async (payload: any) => {
    dispatch(set_loader({ is_loading: true }));
    try {
      if (payload.status === "error") {
        throw new Error("Master key invalida.");
      }

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

      _pushToastMessage({
        header: "Éxito",
        type: "success",
        text: "Caja abierta con exito",
      });

      if (action !== "OPEN_BOX" && data?.box?.valid_reservations?.length > 0) {
        for (const reservation of data?.box?.valid_reservations) {
          if (reservation.is_active) {
            await new OrderService().cancelOrder({
              id: reservation?.order_id,
            });
          }
        }
        await _refreshBoxesStatus();
      }

      dispatch(set_loader({ is_loading: false }));
      setMasterKeyModal(false);
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

  return (
    <DashboardTemplate>
      <MasterKeyAuth
        open={masterKeyModal}
        title="Informe su master key"
        handleClose={() => setMasterKeyModal(false)}
        handleConfirm={(payload: any) => _handleConfirmMasterKey(payload)}
        description={`El usuario {USER} abrió la puerta ${box?.door_number} del locker {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}`}
        action="OPEN_DOOR"
      />

      <div className="w-100 row px-4 py-2 mx-0 mb-4 justify-content-around">
        <div
          className="col-12 my-2 pb-2 size-12"
          style={{ borderBottom: "2px solid #afafaf", fontWeight: "bold" }}
        >
          CAJAS
        </div>
        {session?.profile?.boxes?.map((currentBox: any) => (
          <CardOpenBoxDashboard
            door_number={currentBox.door_number}
            _handleOpenBox={_handleOpenBox}
            _handleOpenBoxAndCancel={_handleOpenBoxAndCancel}
            status={currentBox.valid_reservations?.length > 0 ? "Ocupado" : "Libre"}
            key={currentBox.id}
            data={currentBox}
          />
        ))}
      </div>
    </DashboardTemplate>
  );
};

export default DashboardHome;
