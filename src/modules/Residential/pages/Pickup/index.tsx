/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../components/Logo";
import OrderService from "../../../../services/order.service";
import { useSelector } from "react-redux";
import { _handleError } from "../../../../helpers/errors";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { set_pickup } from "../../../../redux/actions/pickup";
import { LuQrCode } from "react-icons/lu";
import { LuKeyboard } from "react-icons/lu";
import { FiHome } from "react-icons/fi";

const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const LETTER_KEYS = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Ñ",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
];
const LETTER_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const Pickup = () => {
  const [qrcode, setQrcode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualMode, setManualMode] = useState<"numbers" | "letters">("numbers");

  const inputRef: any = useRef<any>();
  const navigate = useNavigate();
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const Order = new OrderService();
  const dispatch: any = useDispatch();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = qrcode;
    }

    if (qrcode.length === 6) {
      _handleValidateCode(qrcode);
    }
  }, [qrcode]);

  useEffect(() => {
    const interval: any = setInterval(() => {
      inputRef.current.focus();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    dispatch(set_loader({ is_loading: false }));
  }, []);

  const _handleValidateCode = async (code: any) => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const response: any = await Order.checkCode({
        terminal_id: session?.profile?.id,
        code: code,
      });
      dispatch(set_loader({ is_loading: false }));
      dispatch(
        set_pickup({ reservation: response.data, boxes: response.data?.boxes })
      );
      navigate("/open-box-pickup");
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleChangeInput = (e: any) => {
    const normalized = String(e?.target?.value || "")
      .toUpperCase()
      .replace(/\s+/g, "");
    setQrcode(normalized.slice(-6));
  };

  const _insertCharacter = (character: string) => {
    setQrcode((prev) => (prev + character).toUpperCase().slice(0, 6));
  };

  const _deleteLastCharacter = () => {
    setQrcode((prev) => prev.slice(0, -1));
  };

  const activeKeys =
    manualMode === "numbers" ? NUMBER_KEYS : LETTER_KEYS;

  return (
    <div className="container-fluid h-100 res-page res-page--pickup-qr">
      <input
        type="text"
        ref={inputRef}
        id="codetext"
        style={{ opacity: 0, position: "absolute" }}
        onChange={_handleChangeInput}
        maxLength={6}
      />
      <div
        className="w-100 my-4 px-4 d-flex align-items-center justify-content-between"
        style={{ position: "relative", zIndex: 10 }}
      >
        <Logo style={{ width: "100px" }} />
        <button
          type="button"
          className="res-theme-toggle"
          onClick={() => navigate("/", { replace: true })}
          aria-label="Ir al inicio"
          title="Inicio"
        >
          <FiHome aria-hidden="true" />
        </button>
      </div>
      <div className="res-content d-flex justify-content-center align-items-center p-0">
        <div className="res-pickup-qr-panel d-flex align-items-center justify-content-center flex-column">
          <h1 className="res-pickup-qr-title">Escanea tu QR para retirar</h1>
          <div className="res-pickup-qr-frame" aria-hidden="true">
            <LuQrCode />
          </div>
          <button
            className="main-button-yellow res-pickup-manual-trigger"
            onClick={() => setShowManualInput(true)}
          >
            <LuKeyboard />
            Digitar manualmente
          </button>
          <button className="res-keypad-back-button mt-3" onClick={() => navigate("/")}>
            Volver
          </button>
        </div>
      </div>

      {showManualInput && (
        <div className="res-pickup-manual-modal-backdrop" onClick={() => setShowManualInput(false)} role="presentation">
          <div className="res-pickup-manual-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button type="button" className="res-help-modal__close" onClick={() => setShowManualInput(false)} aria-label="Cerrar">
              ×
            </button>
            <div className="res-pickup-manual-title">Ingrese su código</div>
            <div className="res-keypad-input-box" aria-live="polite">
              <span className={qrcode ? "res-keypad-input-value" : "res-keypad-input-placeholder"}>
                {qrcode || "Ej: A1B2C3"}
              </span>
              <span className="res-keypad-caret" aria-hidden="true">
                |
              </span>
            </div>

            <div className="res-botonera-shell" role="group" aria-label="Teclado manual de código">
              <div className="res-botonera-mode">
                <button
                  type="button"
                  className={`res-botonera-mode__btn ${manualMode === "numbers" ? "is-active" : ""}`}
                  onClick={() => setManualMode("numbers")}
                >
                  123
                </button>
                <button
                  type="button"
                  className={`res-botonera-mode__btn ${manualMode === "letters" ? "is-active" : ""}`}
                  onClick={() => setManualMode("letters")}
                >
                  ABC
                </button>
              </div>

              {manualMode === "letters" ? (
                <div className="res-botonera-letters-rows">
                  {LETTER_ROWS.map((row, rowIndex) => (
                    <div className="res-botonera-letters-row" key={`letters-row-${rowIndex}`}>
                      {rowIndex === 2 && (
                        <button
                          type="button"
                          className="res-botonera-key res-botonera-key--dark res-botonera-key--letters-action res-botonera-key--letters-delete"
                          onClick={_deleteLastCharacter}
                        >
                          Borrar
                        </button>
                      )}
                      {row.map((key) => (
                        <button
                          key={`${manualMode}-${key}`}
                          type="button"
                          className="res-botonera-key"
                          onClick={() => _insertCharacter(key)}
                        >
                          {key}
                        </button>
                      ))}
                      {rowIndex === 2 && (
                        <button
                          type="button"
                          className="res-botonera-key res-botonera-key--accent res-botonera-key--letters-action"
                          onClick={() => qrcode.length === 6 && _handleValidateCode(qrcode)}
                          disabled={qrcode.length !== 6}
                        >
                          OK
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`res-botonera-grid res-botonera-grid--${manualMode}`}>
                  {activeKeys.map((key) => (
                    <button
                      key={`${manualMode}-${key}`}
                      type="button"
                      className="res-botonera-key"
                      onClick={() => _insertCharacter(key)}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              )}

              {manualMode === "numbers" ? (
                <div className="res-botonera-actions">
                  <button type="button" className="res-botonera-key res-botonera-key--dark" onClick={_deleteLastCharacter}>
                    Borrar
                  </button>
                  <button type="button" className="res-botonera-key" onClick={() => _insertCharacter("0")}>
                    0
                  </button>
                  <button
                    type="button"
                    className="res-botonera-key res-botonera-key--accent"
                    onClick={() => qrcode.length === 6 && _handleValidateCode(qrcode)}
                    disabled={qrcode.length !== 6}
                  >
                    OK
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pickup;
