import HiddenQrRreader from "../../components/HiddenQrReader";
import DeliveryFast from "../../../../assets/svg/delivery-fast-v5.svg?react";
import LockerIcon from "../../../../assets/svg/locker.svg?react";
import Isotipo from "../../../../assets/logos/isotipo.png";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiHelpCircle,
} from "react-icons/fi";
import { TbPackageExport } from "react-icons/tb";

const HomeV5 = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid h-100 res-page res-page--home res-home-v5-page">
      <HiddenQrRreader />

      <div className="res-home-v5-stage">
        <div className="res-home-v5-grid">
          <button
            type="button"
            className="res-home-v5-delivery"
            onClick={() => navigate("/info-apartment", { replace: true })}
          >
            <img className="res-home-v5-delivery__isotipo" src={Isotipo} alt="" aria-hidden="true" />
            <span className="res-home-v5-delivery__icon">
              <DeliveryFast />
            </span>
            <div className="res-home-v5-delivery__copy">
              <h1>Entregar</h1>
              <p>
                Deposita un paquete en el locker para un residente de forma
                segura y en pocos pasos.
              </p>
            </div>
            <span className="res-home-v5-delivery__cta">
              Comenzar entrega
              <FiArrowRight />
            </span>
          </button>

          <div className="res-home-v5-side">
             
             <button
              type="button"
              className="res-home-v5-action res-home-v5-action--pickup"
              onClick={() => navigate("/pickup", { replace: true })}
            >
              <span className="res-home-v5-action__icon">
                <TbPackageExport />
              </span>
              <span className="res-home-v5-action__text">
                <strong>Retiro</strong>
                <small>Retira usando tu código o QR.</small>
              </span>
            </button>
            
            <button
              type="button"
              className="res-home-v5-action res-home-v5-action--custody"
              onClick={() => navigate("/info-custody", { replace: true })}
            >
              <span className="res-home-v5-action__icon">
                <LockerIcon />
              </span>
              <span className="res-home-v5-action__text">
                <strong>Guardar</strong>
                <small>Deja tus pertenencias en custodia.</small>
              </span>
            </button>

            <button
              type="button"
              className="res-home-v5-help"
              onClick={() =>
                navigate("/pickup-without-code/rut", { replace: true })
              }
            >
              <FiHelpCircle />
              <span>Ayuda</span>
            </button>
          </div>
        </div>

        <div className="res-home-v5-footer">
          <span>Escanea un código QR para retirar
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeV5;
