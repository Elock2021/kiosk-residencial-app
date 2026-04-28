/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "rsuite";
import MasterKeyAuth from "../../../components/MasterKeyAuth";
import { _handleError } from "../../../helpers/errors";
import { _pushToastMessage } from "../../../helpers/messages";
import { set_loader } from "../../../redux/actions/loader";
import { loader } from "../../../redux/reducers";
import DashboardTemplate from "../DashboardTemplate";
import VersionService from "../../../services/version.service";
import moment from "moment";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { useSelector } from "react-redux";

const DashboardVersion = () => {
  const [masterKeyModal, setMasterKeyModal] = useState(false);
  const [updateVersionModal, setUpdateVersionModal] = useState(false);
  const modules = useSelector((state: any) => state.modules);
  const session = useSelector((state: any) => state.session);
  const [actualVersion, setActualVersion] = useState({
    version: "",
    build: "",
    latest_update: "",
  });

  const dispatch: any = useDispatch();

  useEffect(() => {
    _getActualVersion();
  }, []);

  const _getActualVersion = async () => {
    try {
      dispatch(set_loader({ ...loader, is_loading: true }));
      const Version = new VersionService();
      const response = await Version.actualVersion();
      const version = response.data;
      version.latest_update = moment(version?.latest_update).format(
        "DD-MM-YYYY"
      );
      setActualVersion(response.data);
      dispatch(set_loader({ ...loader, is_loading: false }));
    } catch (error) {
      dispatch(set_loader({ ...loader, is_loading: false }));
      _handleError(error, "Error al obtener la versión actual");
    }
  };

  const _checkForUpdates = async () => {
    try {
      dispatch(set_loader({ ...loader, is_loading: true }));
      const Version = new VersionService();
      const response = await Version.checkForUpdates({terminal_id: session?.profile?.id});
      dispatch(set_loader({ ...loader, is_loading: false }));

      if (response.data.update) {
        setUpdateVersionModal(true);
      } else {
        _pushToastMessage({
          header: "Actualización",
          text: "No hay actualizaciones disponibles",
          type: "info",
        });
      }
    } catch (error) {
      dispatch(set_loader({ ...loader, is_loading: false }));
      _handleError(error, "Error al buscar actualizaciones");
    }
  };

  const _handleMasterKeyValidation = () => {
    setMasterKeyModal(true);
    setUpdateVersionModal(false);
  };

  const _handleUpdate = async (payload: any) => {
    setMasterKeyModal(false);
    if (payload.status === "success") {
      try {
        dispatch(set_loader({ ...loader, is_loading: true }));
        const Version = new VersionService();
        await Version.updateSoftware({
          module: modules?.module_selected,
        });
        dispatch(set_loader({ ...loader, is_loading: false }));
        _pushToastMessage({
          header: "Actualización",
          text: "Actualización completada",
          type: "success",
        });
      } catch (error) {
        dispatch(set_loader({ ...loader, is_loading: false }));
        _handleError(error, "Error al actualizar el software");
      }
    }
  };

  return (
    <DashboardTemplate>
      <MasterKeyAuth
        open={masterKeyModal}
        title="Informe su master key"
        handleClose={() => setMasterKeyModal(false)}
        handleConfirm={(payload: any) => _handleUpdate(payload)}
        description="El usuario {USER} actualizó el terminal {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}"
        action="SYNC_TERMINAL"
      />

      <ConfirmationModal
        open={updateVersionModal}
        variant="kiosk"
        headerText="Actualización"
        contentText="Hay una nueva version disponible. Desea instalar esta actualizacion ahora?"
        cancelText="Más tarde"
        confirmText="Actualizar ahora"
        onConfirm={() => _handleMasterKeyValidation()}
        onCancel={() => setUpdateVersionModal(false)}
      />

      <div className="row px-4 py-2 mx-0 mb-4">
        <div
          className="col-12 my-2 pb-2 size-12"
          style={{ borderBottom: "2px solid #afafaf", fontWeight: "bold" }}
        >
          Actualización automatica
        </div>
      </div>

      <div className="row background-color-white shadow-sm px-3 py-5 mx-3 mt-3 rounded">
        <div className="col-12 px-5 size-09 mb-1" style={{ fontWeight: "500" }}>
          Versión actual
        </div>
        <div className="col-12 mt-3">
          <p className="size-09 px-5">Version: {actualVersion.version}</p>
          <p className="size-09 px-5">Fecha: {actualVersion.latest_update}</p>
        </div>
        <div className="col-12 text-end px-5 mt-1">
          <Button onClick={_checkForUpdates} appearance="primary">
            Buscar por actualizaciones
          </Button>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default DashboardVersion;
