/* eslint-disable react-hooks/exhaustive-deps */
import Delivery from "../../../../assets/svg/entrega.svg?react";
import Pickup from "../../../../assets/svg/retiro.svg?react";
import Custody from "../../../../assets/svg/custodia.svg?react";
import isotipo from "../../../../assets/logos/isotipo.png";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { set_session } from "../../../../redux/actions/session";
import HiddenQrRreader from "../../components/HiddenQrReader";
import Drawer from "../../../../components/Drawer";
import NumberKeyboard from "../../components/NumberKeyboard";
import { useNavigate } from "react-router-dom";
import { _pushToastMessage } from "../../../../helpers/messages";
import { FiArrowRight, FiHelpCircle } from "react-icons/fi";
import { ResidentialHomeVariant } from "../../theme/homeVariant";

type HomeBaseProps = {
  variant: ResidentialHomeVariant;
};

const HomeBase = ({ variant }: HomeBaseProps) => {
  const [deliveryDrawer, setDeliveryDrawer] = useState({
    open: false,
    data: {},
  });

  const navigate = useNavigate();
  const { session } = useSelector((state: any) => ({ session: state.session }));
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

  const _handleOpenSignIn = () => {
    dispatch(set_session({ ...session, sign_in_component: true }));
  };

  return (
    <div
      className={`container-fluid h-100 res-page res-page--home res-home-${variant}`}
      data-home-variant={variant}
    >
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
              <div className="res-home-v2">
                <button
                  type="button"
                  className="res-home-hero"
                  onClick={() => navigate("/info-apartment", { replace: true })}
                >
                  <div className="res-home-hero__left">
                    <div className="res-home-hero__title">Entrega</div>
                    <div className="res-home-hero__description">
                      Deposita un paquete en el locker para un residente. Rápido y
                      seguro.
                    </div>
                    <div className="res-home-hero__cta">
                      <span className="res-home-hero__cta-icon">
                        <FiArrowRight />
                      </span>
                      <span>COMENZAR ENTREGA</span>
                    </div>
                  </div>
                  <div className="res-home-hero__right res-home-delivery-truck">
                    <Delivery />
                  </div>
                </button>

                <div className="res-home-options">
                  <button
                    type="button"
                    className="res-home-option res-home-option--pickup"
                    onClick={() => navigate("/pickup", { replace: true })}
                  >
                    <span className="res-home-option__content">
                      <span className="res-home-option__name">Retiro</span>
                      <span className="res-home-option__desc">
                        Retira un paquete con tu código.
                      </span>
                    </span>
                    <span className="res-home-option__icon">
                      <Pickup />
                    </span>
                    <span className="res-home-option__arrow">
                      <FiArrowRight />
                    </span>
                  </button>

                  <div className="res-home-options__stack">
                    <button
                      type="button"
                      className="res-home-option"
                      onClick={() => navigate("/info-custody", { replace: true })}
                    >
                      <span className="res-home-option__content">
                        <span className="res-home-option__name">Guardar</span>
                        <span className="res-home-option__desc">
                          Deja un paquete en custodia.
                        </span>
                      </span>
                      <span className="res-home-option__icon">
                        <Custody />
                      </span>
                      <span className="res-home-option__arrow">
                        <FiArrowRight />
                      </span>
                    </button>

                    <button
                      type="button"
                      className="res-home-option"
                      onClick={() =>
                        navigate("/pickup-without-code/rut", { replace: true })
                      }
                    >
                      <span className="res-home-option__content">
                        <span className="res-home-option__name">Ayuda</span>
                        <span className="res-home-option__desc">
                          ¿No tienes el código?
                        </span>
                      </span>
                      <span className="res-home-option__icon">
                        <FiHelpCircle />
                      </span>
                      <span className="res-home-option__arrow">
                        <FiArrowRight />
                      </span>
                    </button>
                  </div>
                </div>
                <div className="res-home-footer d-flex flex-column align-items-center justify-content-center">
                  <span className="bold res-context-text res-home-footer__qr-msg">
                    Escanea tu código QR para comenzar
                  </span>
                  <button
                    type="button"
                    className="res-home-footer__isotipo-btn"
                    onClick={_handleOpenSignIn}
                    aria-label="Abrir ingreso a dashboard"
                    title="Abrir ingreso a dashboard"
                  >
                    <img src={isotipo} alt="Isotipo eLock" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBase;
