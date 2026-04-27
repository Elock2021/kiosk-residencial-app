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
import { FiArrowRight, FiHelpCircle } from "react-icons/fi";

const HomeV1 = () => {
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
    <div className="container-fluid h-100 res-page res-page--home res-home-v1-page">
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
            <div className="res-home-heading">
              <div className="res-home-title">¿Qué quieres hacer hoy?</div>
            </div>

            <div className="res-action-grid">
              <button
                type="button"
                className="res-home-action res-home-action--primary res-home-v1-primary"
                onClick={() => navigate("/info-apartment", { replace: true })}
              >
                <div className="res-home-action__top">
                  <span className="res-home-action__icon res-home-delivery-truck">
                    <Delivery />
                  </span>
                </div>
                <div className="res-home-action__body">
                  <div className="res-home-action__title">Entrega</div>
                  <div className="res-home-action__description">
                    Deposita un paquete en el locker para un residente.
                  </div>
                  <div className="res-home-v1-primary__cta">
                    <FiArrowRight />
                    <span>COMENZAR ENTREGA</span>
                  </div>
                </div>
              </button>

              <div className="res-home-side-grid">
                <button
                  type="button"
                  className="res-home-action res-home-action--secondary res-home-v1-card res-home-v1-card--pickup"
                  onClick={() => navigate("/pickup", { replace: true })}
                >
                  <div className="res-home-action__top">
                    <span className="res-home-v1-card__head">
                      <span className="res-home-action__icon">
                        <Pickup />
                      </span>
                      <span className="res-home-v1-card__text">
                        <span className="res-home-action__title res-home-v1-card__title--pickup">
                          Retiro
                        </span>
                        <span className="res-home-action__description">
                          Retira un paquete con tu código.
                        </span>
                      </span>
                    </span>
                    <span className="res-home-action__arrow">
                      <FiArrowRight />
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="res-home-action res-home-action--secondary res-home-v1-card res-home-v1-card--custody"
                  onClick={() => navigate("/info-custody", { replace: true })}
                >
                  <div className="res-home-action__top">
                    <span className="res-home-v1-card__head">
                      <span className="res-home-action__icon">
                        <Custody />
                      </span>
                      <span className="res-home-v1-card__text">
                        <span className="res-home-action__title">Guardar</span>
                        <span className="res-home-action__description">
                          Deja un paquete en custodia.
                        </span>
                      </span>
                    </span>
                    <span className="res-home-action__arrow">
                      <FiArrowRight />
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="res-home-action res-home-action--secondary res-home-v1-card res-home-v1-card--help"
                  onClick={() =>
                    navigate("/pickup-without-code/rut", { replace: true })
                  }
                >
                  <div className="res-home-action__top">
                    <span className="res-home-v1-card__head">
                      <span className="res-home-action__icon">
                        <FiHelpCircle />
                      </span>
                      <span className="res-home-v1-card__text">
                        <span className="res-home-action__title">Ayuda</span>
                      </span>
                    </span>
                    <span className="res-home-action__arrow">
                      <FiArrowRight />
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="res-home-footer d-flex flex-column align-items-center justify-content-center">
              <span className="res-home-v1-footer-note">
                TOCA UNA OPCIÓN PARA COMENZAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeV1;
