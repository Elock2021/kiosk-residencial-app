/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeliveryUserService from "../../../../services/delivery_user.service";
import OrderService from "../../../../services/order.service";
import { LuQrCode } from "react-icons/lu";
import { LuMailCheck } from "react-icons/lu";
import { TbUserEdit } from "react-icons/tb";
import { TbBrandWhatsapp } from "react-icons/tb";
import { TbUserSearch } from "react-icons/tb";
import { FiInfo } from "react-icons/fi";
import ApartmentKeyboardWithRedirect from "../ApartamentKeyboardWithRedirect";

type HelpStep = "menu" | "apartment" | "resident";
type HelpFlow = "pickup" | "edit" | null;
type ResultModalState = {
  open: boolean;
  title: string;
  message: string;
  email?: string;
};
type AlertModalState = {
  open: boolean;
  title: string;
  message: string;
};

const NO_PACKAGES_TEXT =
  "Usted no tiene paquetes en el locker. Si cree que esto es un error, por favor contacte al soporte técnico.";
const MAX_RESIDENTS_FOR_TEST = 5;
const TWO_COLUMNS_THRESHOLD = 6;

const ReadDocument = () => {
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const navigate = useNavigate();
  const [step, setStep] = useState<HelpStep>("menu");
  const [activeFlow, setActiveFlow] = useState<HelpFlow>(null);
  const [supportQrOpen, setSupportQrOpen] = useState(false);
  const [resultModal, setResultModal] = useState<ResultModalState>({
    open: false,
    title: "",
    message: "",
    email: "",
  });
  const [alertModal, setAlertModal] = useState<AlertModalState>({
    open: false,
    title: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [apartmentValue, setApartmentValue] = useState("");
  const [residents, setResidents] = useState<any[]>([]);

  const whatsappUrl = useMemo(() => {
    return process.env.REACT_APP_HELP_WHATSAPP_URL || "https://wa.me/56900000000";
  }, []);
  const supportQrSrc = useMemo(() => {
    const encoded = encodeURIComponent(whatsappUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encoded}`;
  }, [whatsappUrl]);

  const resetFlow = () => {
    setActiveFlow(null);
    setApartmentValue("");
    setResidents([]);
    setLoading(false);
    setStep("menu");
  };

  const startFlow = (flow: Exclude<HelpFlow, null>) => {
    setActiveFlow(flow);
    setApartmentValue("");
    setResidents([]);
    setStep("apartment");
  };

  const fetchResidentsByApartment = async (apartment: string) => {
    const response: any = await new DeliveryUserService().filter_users({
      terminal_id: session?.profile?.id,
      params: { apartment: apartment.trim() },
    });
    return response?.data?.delivery_users || [];
  };

  const openAlertModal = (title: string, message: string) => {
    setAlertModal({ open: true, title, message });
  };

  const handleApartmentContinue = async (apartment: string) => {
    if (!apartment.trim()) {
      openAlertModal("Aviso", "Ingrese un número de departamento / casa.");
      return;
    }

    setLoading(true);
    try {
      setApartmentValue(apartment.trim());
      const users = await fetchResidentsByApartment(apartment);
      if (!users.length) {
        openAlertModal("Información", NO_PACKAGES_TEXT);
        return;
      }
      setResidents(users);
      setStep("resident");
    } catch (error) {
      openAlertModal("Error", "No fue posible validar la información en este momento.");
    } finally {
      setLoading(false);
    }
  };

  const handleResidentSelect = async (resident: any) => {
    setLoading(true);
    try {
      if (activeFlow === "pickup") {
        const reservations = await new OrderService().getReservationsByUser({
          delivery_user_id: resident.id,
          terminal_id: session?.profile?.id,
        });

        const totalPackages = reservations?.data?.length || 0;
        if (!totalPackages) {
          openAlertModal("Información", NO_PACKAGES_TEXT);
          return;
        }

        if (!resident?.email) {
          openAlertModal("Aviso", "El residente tiene paquetes, pero no tiene correo registrado.");
          return;
        }

        setResultModal({
          open: true,
          title: "QR reenviado",
          message: `Se reenviará el QR de retiro. Paquetes encontrados: ${totalPackages}.`,
          email: resident.email,
        });
        return;
      }

      if (!resident?.email) {
        openAlertModal("Aviso", "No encontramos un correo registrado para este residente.");
        return;
      }

      setResultModal({
        open: true,
        title: "Mensaje enviado",
        message: "El link para editar tus datos será enviado al correo registrado.",
        email: resident.email,
      });
    } catch (error) {
      openAlertModal("Error", "No fue posible validar la información en este momento.");
    } finally {
      setLoading(false);
    }
  };

  const visibleResidents = residents.slice(0, MAX_RESIDENTS_FOR_TEST);
  const residentListLayoutClass =
    visibleResidents.length >= TWO_COLUMNS_THRESHOLD
      ? "res-help-resident-list--two-cols"
      : "res-help-resident-list--one-col";

  return (
    <div className="container-fluid h-100 res-page">
      <Header hideThemeToggle={false} showThemeToggle={step === "menu"} />
      <div className="res-content d-flex justify-content-center res-content--help">
        <div
          className={`res-help-module ${step === "menu" ? "res-help-module--menu" : "res-help-module--form"} ${
            step === "resident" ? "res-help-module--resident" : ""
          }`}
        >
          {step === "menu" && (
            <>
              <div className="res-help-menu">
                <div className="res-help-module__heading res-help-module__heading--menu">
                  <h1 className="res-help-module__title">¿En qué te ayudamos?</h1>
                  <p className="res-help-module__subtitle">
                    Elige una opción para continuar.
                  </p>
                </div>

                <div className="res-help-module__actions">
                  <button
                    type="button"
                    className="res-help-route res-help-route--pickup"
                    onClick={() => startFlow("pickup")}
                  >
                    <span className="res-help-route__idx">01</span>
                    <span className="res-help-route__copy">
                      <strong>¿Problemas con el retiro?</strong>
                      <small>Valida tus datos para revisar y gestionar tu retiro.</small>
                    </span>
                    <span className="res-help-route__icon">
                      <LuQrCode />
                    </span>
                  </button>

                  <button
                    type="button"
                    className="res-help-route res-help-route--edit"
                    onClick={() => startFlow("edit")}
                  >
                    <span className="res-help-route__idx">02</span>
                    <span className="res-help-route__copy">
                      <strong>¿Quieres editar tus datos?</strong>
                      <small>Verifica tu identidad para actualizar tus datos de forma segura.</small>
                    </span>
                    <span className="res-help-route__icon">
                      <TbUserEdit />
                    </span>
                  </button>

                  <button
                    type="button"
                    className="res-help-route res-help-route--whatsapp"
                    onClick={() => setSupportQrOpen(true)}
                  >
                    <span className="res-help-route__idx">03</span>
                    <span className="res-help-route__copy">
                      <strong>Soporte Técnico</strong>
                      <small>Acceso directo a nuestro chatbot de WhatsApp.</small>
                    </span>
                    <span className="res-help-route__icon">
                      <TbBrandWhatsapp />
                    </span>
                  </button>
                </div>
                <div className="res-help-module__back">
                  <button
                    type="button"
                    className="res-help-back-button"
                    onClick={() => navigate("/", { replace: true })}
                  >
                    Volver 
                  </button>
                </div>
              </div>
            </>
          )}

          {step === "apartment" && (
            <ApartmentKeyboardWithRedirect
              embedded
              title={
                activeFlow === "pickup"
                  ? "Ingrese el número de su domicilio "
                  : "Número de departamento o casa"
              }
              hint=""
              placeholder="Ej: 203, 12A"
              continueLabel="Continuar"
              backLabel="Volver"
              initialValue={apartmentValue}
              loading={loading}
              onContinue={handleApartmentContinue}
              onBack={resetFlow}
            />
          )}

          {step === "resident" && (
            <div className="res-help-form res-help-form--resident">
              <h2 className="res-help-form__title">Selecciona un residente</h2>
              <div
                className={`res-help-resident-list ${residentListLayoutClass}`}
              >
                {visibleResidents.map((resident: any, index: number) => (
                  <button
                    key={`${resident?.id || resident?.name}-${index}`}
                    type="button"
                    className="res-help-route res-help-route--resident"
                    disabled={loading}
                    onClick={() => handleResidentSelect(resident)}
                  >
                    <span className="res-help-route__idx">{String(index + 1).padStart(2, "0")}</span>
                    <span className="res-help-route__copy">
                      <strong>{resident?.name || "Residente"}</strong>
                    </span>
                    <span className="res-help-route__icon">
                      <TbUserSearch />
                    </span>
                  </button>
                ))}
              </div>

              <div className="res-help-form__actions">
                <button
                  type="button"
                  className="main-button res-help-form__back"
                  onClick={resetFlow}
                  disabled={loading}
                >
                  Volver 
                </button>
              </div>
            </div>
          )}

        </div>

        {supportQrOpen && (
          <div
            className="res-help-modal-backdrop"
            onClick={() => setSupportQrOpen(false)}
            role="presentation"
          >
            <div
              className="res-help-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Soporte Técnico por WhatsApp"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="res-help-modal__close"
                onClick={() => setSupportQrOpen(false)}
                aria-label="Cerrar"
              >
                ×
              </button>

              <h3>Soporte Técnico</h3>
              <p>Escanea este QR para abrir el bot de WhatsApp.</p>

              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="res-help-modal__qr-link">
                <img src={supportQrSrc} alt="QR de WhatsApp" />
              </a>

              <div className="res-help-modal__actions">
                <button type="button" className="main-button" onClick={() => setSupportQrOpen(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {alertModal.open && (
          <div
            className="res-help-modal-backdrop"
            onClick={() => setAlertModal({ open: false, title: "", message: "" })}
            role="presentation"
          >
            <div
              className="res-help-modal res-help-modal--alert"
              role="dialog"
              aria-modal="true"
              aria-label={alertModal.title}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="res-help-modal__close"
                onClick={() => setAlertModal({ open: false, title: "", message: "" })}
                aria-label="Cerrar"
              >
                ×
              </button>

              <h3 className="res-help-modal__title">
                <span className="res-help-modal__title-icon" aria-hidden="true">
                  <FiInfo />
                </span>
                <span>{alertModal.title}</span>
              </h3>
              <p>{alertModal.message}</p>

              <div className="res-help-modal__actions">
                <button
                  type="button"
                  className="main-button"
                  onClick={() => setAlertModal({ open: false, title: "", message: "" })}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {resultModal.open && (
          <div
            className="res-help-modal-backdrop"
            onClick={() => {
              setResultModal({ open: false, title: "", message: "", email: "" });
              resetFlow();
            }}
            role="presentation"
          >
            <div
              className="res-help-modal res-help-modal--result"
              role="dialog"
              aria-modal="true"
              aria-label={resultModal.title}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="res-help-modal__close"
                onClick={() => {
                  setResultModal({ open: false, title: "", message: "", email: "" });
                  resetFlow();
                }}
                aria-label="Cerrar"
              >
                ×
              </button>

              <h3 className="res-help-modal__title">
                <span className="res-help-modal__title-icon" aria-hidden="true">
                  <LuMailCheck />
                </span>
                <span>{resultModal.title}</span>
              </h3>
              <p>{resultModal.message}</p>
              {resultModal.email && (
                <p>
                  Correo destino: <strong>{resultModal.email}</strong>
                </p>
              )}

              <div className="res-help-modal__actions">
                <button
                  type="button"
                  className="main-button"
                  onClick={() => {
                    setResultModal({ open: false, title: "", message: "", email: "" });
                    resetFlow();
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadDocument;
