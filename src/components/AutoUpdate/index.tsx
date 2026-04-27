/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useEffect, useState } from "react";
import VersionService from "../../services/version.service";
import { useSelector } from "react-redux";

const AutoUpdate = () => {
  const [update, setUpdate] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const session = useSelector((state: any) => state.session);
  const modules = useSelector((state: any) => state.modules);
  useEffect(() => {
    setUpdate(
      setInterval(() => {
        _checkForUpdates();
      }, 1000)
    );

    return () => {
      if (update !== null) {
        setUpdate(null);
      }
    };
  }, []);

  const _checkForUpdates = async () => {
    try {
      const now = moment();
      if (
        now.format("HH:mm:ss") === "00:00:00" ||
        now.format("HH:mm:ss") === "01:00:00"
      ) {
        setShowUpdateModal(true);
        const Version = new VersionService();
        const response = await Version.checkForAutoUpdates({
          terminal_id: session?.profile?.id,
        });

        if (response.data.update) {
          await Version.updateSoftware({
            module: modules?.module_selected,
          });
        }
        setShowUpdateModal(false);
      }
    } catch (e: any) {
      console.log(e?.response?.data);
      setShowUpdateModal(false);
    }
  };

  if (showUpdateModal) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          width: "100%",
          height: "100vh",
          background: "#00000090",
        }}
      >
        <div
          className="d-flex justify-content-center align-items-center px-4 py-5"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            borderRadius: 10,
            color: "#000",
          }}
        >
          <h1>Actualizando software...</h1>
        </div>
      </div>
    );
  }

  return null;
};

export default AutoUpdate;
