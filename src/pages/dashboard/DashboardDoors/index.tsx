/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Button, SelectPicker } from "rsuite";
import MasterKeyAuth from "../../../components/MasterKeyAuth";
import DashboardTemplate from "../DashboardTemplate";
import TestComDoors from "../../../components/TestComDoors";
import ComIcon from "../../../assets/svg/coms.svg?react";
import { com_list } from "./com_list";
import { _pushToastMessage } from "../../../helpers/messages";
import { useSelector } from "react-redux";
import { _handleError } from "../../../helpers/errors";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../redux/actions/loader";
import TerminalService from "../../../services/terminal.service";
import { set_session } from "../../../redux/actions/session";

const DashboardDoors = () => {
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const [masterKeyModal, setMasterKeyModal] = useState(false);
  const [testingModal, setTestingModal] = useState(false);
  const [comDoor, setComDoor] = useState("COM1");
  const [comQrcode, setComQrcode] = useState("COM2");
  const dispatch: any = useDispatch();
  const Terminal = new TerminalService();

  useEffect(() => {
    const { profile } = session;
    setComDoor(profile?.door_com_number);
    setComQrcode(profile?.qrcode_com_number);
  }, []);

  const _handleUpdateDoors = async (payload: any) => {
    const { profile } = session;
    try {
      dispatch(set_loader({ is_loading: true }));
      if (payload.status === "error") {
        throw new Error("Master key invalida.");
      }
      await Terminal.setDoors({
        id: profile?.id,
        door_com_number: comDoor,
        qrcode_com_number: comQrcode,
      });
      profile.door_com_number = comDoor;
      profile.qrcode_com_number = comQrcode;
      dispatch(
        set_session({
          ...session,
          profile,
        })
      );
      _pushToastMessage({
        text: "Puertos actualizados con éxito.",
        type: "success",
        header: "Éxito",
      });
      setMasterKeyModal(false);
      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      dispatch(set_loader({ is_loading: false }));
      _handleError(e, e.message);
    }
  };

  const _openMasterKeyAuth = () => {
    setMasterKeyModal(true);
  };

  return (
    <DashboardTemplate>
      <MasterKeyAuth
        open={masterKeyModal}
        title="Informe su master key"
        handleClose={() => setMasterKeyModal(false)}
        handleConfirm={_handleUpdateDoors}
        description="El usuario {USER} cambió los puertos COM'S del terminal {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}"
        action="UPDATE_COMS"
      />

      <TestComDoors
        open={testingModal}
        title="Pruebas de apertura y lectura de los dispositivos"
        handleClose={() => setTestingModal(false)}
      />

      <div className="row px-4 py-2 mx-0 mb-4">
        <div
          className="col-12 my-2 pb-2 size-12"
          style={{ borderBottom: "2px solid #afafaf", fontWeight: "bold" }}
        >
          Modulos
        </div>
      </div>

      <div className="row background-color-white shadow-sm px-3 py-5 mx-3 mt-3 rounded">
        <div className="col-6 px-5 ">
          <label>Com Puertas</label>
          <SelectPicker
            data={com_list}
            value={comDoor}
            className="w-100"
            placeholder="Seleciona un puerto"
            onChange={(value: any) => setComDoor(value)}
            locale={{ searchPlaceholder: "Buscar" }}
          />
        </div>

        <div className="col-6 px-5 ">
          <label>Com Qrcode</label>
          <SelectPicker
            data={com_list}
            value={comQrcode}
            className="w-100"
            placeholder="Seleciona un puerto"
            onChange={(value: any) => setComQrcode(value)}
            locale={{ searchPlaceholder: "Buscar" }}
          />
        </div>

        <div className="col-12 text-end px-5 mt-5">
          <Button
            onClick={() => setTestingModal(true)}
            appearance="primary"
            className="me-3"
          >
            <ComIcon
              className="me-2"
              style={{ width: "20px", height: "20px" }}
            />
            Probar puertos
          </Button>
          <Button onClick={_openMasterKeyAuth} appearance="primary">
            Guardar
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default DashboardDoors;
