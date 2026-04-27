/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import Delivery from "../../../../assets/svg/entrega.svg?react";
import Pickup from "../../../../assets/svg/retiro.svg?react";
import Custody from "../../../../assets/svg/custodia.svg?react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import HiddenQrRreader from "../../components/HiddenQrReader";
import Drawer from "../../../../components/Drawer";
import NumberKeyboard from "../../components/NumberKeyboard";
import { useNavigate } from "react-router-dom";
import { _pushToastMessage } from "../../../../helpers/messages";
import HomeActionButton from "../../components/HomeActionButton";

const HomeV0 = () => {
  const [deliveryDrawer, setDeliveryDrawer] = useState({
    open: false,
    data: {},
  });

  const navigate = useNavigate();

  const dispatch: any = useDispatch();
  useEffect(() => {
    const timeout: any = setTimeout(() => {
      dispatch(set_loader({ is_loading: false }));
      console.log("CLOSE LOADER");
    }, 5000);

    return () => {
      clearInterval(timeout);
      console.log("CLEAR INTERVAL");
    };
  }, []);

  const _handleOnConfirmKeyboard = (apartament: number) => {
    if (!apartament) {
      _pushToastMessage({
        type: "warning",
        text: "Ingrese un número de departamento / casa.",
        header: "Aviso",
      });
      return;
    }
    navigate(`/delivery-with-apartament/${apartament}`, { replace: true });
  };

  return (
    <div className="container-fluid h-100 res-page res-page--home res-home-v0-page">
      <Header />
      <HiddenQrRreader />
      <Drawer
        isOpen={deliveryDrawer.open}
        onClose={() => setDeliveryDrawer({ open: false, data: {} })}
      >
        <NumberKeyboard
          isOpen={deliveryDrawer.open}
          onConfirm={_handleOnConfirmKeyboard}
        />
      </Drawer>

      <div className="res-home-stage">
        <div className="res-content res-home-content d-flex justify-content-center">
          <div className="res-flow res-home-flow">
            <div className="res-home-main">
              <div className="res-home-heading">
                <div className="res-home-title">¿Qué deseas hacer?</div>
                <p className="res-home-hint">Selecciona una opción para continuar</p>
              </div>
              <div className="res-action-grid">
                <HomeActionButton
                  Image={Pickup}
                  title="Retiro"
                  description="Retirar paquete"
                  featured
                  onClick={() => navigate("/pickup", { replace: true })}
                />

                <HomeActionButton
                  Image={Delivery}
                  title="Entrega"
                  description="Entregar paquete"
                  onClick={() => navigate("/info-apartment", { replace: true })}
                />

                <HomeActionButton
                  Image={Custody}
                  title="Guardar"
                  description="Dejar paquete"
                  onClick={() => navigate("/info-custody", { replace: true })}
                />
              </div>
            </div>
            <div className="res-home-footer d-flex flex-column align-items-center justify-content-center">
              <span className="bold res-context-text mb-1">¿No recibiste tu código?</span>
              <button
                className="res-home-help-button"
                onClick={() => navigate("/pickup-without-code/rut", { replace: true })}
              >
                <span>Ayuda</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeV0;
