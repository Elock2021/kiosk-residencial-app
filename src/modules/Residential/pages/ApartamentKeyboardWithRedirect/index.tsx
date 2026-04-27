/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../components/Logo";
import { _pushToastMessage } from "../../../../helpers/messages";

type ApartmentKeyboardWithRedirectProps = {
  embedded?: boolean;
  title?: string;
  hint?: string;
  placeholder?: string;
  continueLabel?: string;
  backLabel?: string;
  initialValue?: string;
  loading?: boolean;
  onContinue?: (apartment: string) => void | Promise<void>;
  onBack?: () => void;
};

const VALID_APARTMENT_REGEX = /^\d{1,4}[A-Z]?$/;
const NUMBER_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const LETTER_KEYS_PAGE_ONE = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "{more}"];
const LETTER_KEYS_PAGE_TWO = ["L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "{back}"];

const ApartmentKeyboardWithRedirect = ({
  embedded = false,
  title = "Ingresa tu departamento/casa",
  hint = "Puedes escribir números y letras",
  placeholder = "Ej: 203B",
  backLabel = "Volver",
  initialValue = "",
  loading = false,
  onContinue,
  onBack,
}: ApartmentKeyboardWithRedirectProps) => {
  const [data, setData] = useState<string>(String(initialValue || "").toUpperCase());
  const [mode, setMode] = useState<"numbers" | "letters">("numbers");
  const [lettersPage, setLettersPage] = useState<1 | 2>(1);

  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const isValid = useMemo(() => VALID_APARTMENT_REGEX.test(data), [data]);

  const _handleContinue = async () => {
    if (!data) {
      _pushToastMessage({
        type: "warning",
        text: "Ingrese un número de departamento / casa.",
        header: "Aviso",
      });
      return;
    }

    if (!isValid) {
      _pushToastMessage({
        type: "warning",
        text: "Formato inválido. Usa por ejemplo: 203 o 12A.",
        header: "Aviso",
      });
      return;
    }

    const apartment = String(data || "").trim().toUpperCase();
    if (onContinue) {
      await onContinue(apartment);
      return;
    }

    navigate(`${redirectUrl || "/"}/${apartment}`, { replace: true });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const nextRedirectUrl = urlParams.get("redirectUrl") || "/";
    setRedirectUrl(nextRedirectUrl);
  }, [embedded]);

  useEffect(() => {
    setData(String(initialValue || "").toUpperCase());
  }, [initialValue]);

  const _deleteLastCharacter = () => {
    setData((prevValue) => prevValue.slice(0, -1));
  };

  const _clearValue = () => {
    setData("");
  };

  const _insertCharacter = (character: string) => {
    const nextCharacter = character.toUpperCase();

    setData((prevValue) => {
      if (nextCharacter === "" || prevValue.length >= 5) return prevValue;

      const hasLetterAlready = /[A-Z]$/.test(prevValue);

      if (/^[A-Z]$/.test(nextCharacter)) {
        if (hasLetterAlready || prevValue.length === 0 || /[A-Z]/.test(prevValue)) return prevValue;
        return `${prevValue}${nextCharacter}`;
      }

      if (!/\d/.test(nextCharacter)) return prevValue;
      if (hasLetterAlready) return prevValue;
      if (prevValue.length >= 4) return prevValue;

      return `${prevValue}${nextCharacter}`;
    });
  };

  const activeKeys =
    mode === "numbers" ? NUMBER_KEYS : lettersPage === 1 ? LETTER_KEYS_PAGE_ONE : LETTER_KEYS_PAGE_TWO;

  const content = (
    <div className="res-kiosk-input-screen res-kiosk-input-screen--apartment">
      <div className="res-home-heading res-home-heading--compact">
        <div className="res-home-title">{title}</div>
        <p className="res-home-hint">{hint}</p>
      </div>
      <div className="res-keypad-input-box" aria-live="polite">
        <span className={data ? "res-keypad-input-value" : "res-keypad-input-placeholder"}>
          {data || placeholder}
        </span>
        <span className="res-keypad-caret" aria-hidden="true">
          |
        </span>
      </div>

      <div className="res-botonera-shell" role="group" aria-label="Teclado de departamento o casa">
        <div className="res-botonera-mode">
          <button
            type="button"
            className={`res-botonera-mode__btn ${mode === "numbers" ? "is-active" : ""}`}
            onClick={() => setMode("numbers")}
          >
            123
          </button>
          <button
            type="button"
            className={`res-botonera-mode__btn ${mode === "letters" ? "is-active" : ""}`}
            onClick={() => {
              setMode("letters");
              setLettersPage(1);
            }}
          >
            ABC
          </button>
        </div>

        <div className={`res-botonera-grid res-botonera-grid--${mode}`}>
          {activeKeys.map((key) => (
            <button
              key={`${mode}-${key}`}
              type="button"
              className={`res-botonera-key ${key === "{more}" || key === "{back}" ? "res-botonera-key--pager" : ""}`}
              onClick={() => {
                if (key === "{more}") {
                  setLettersPage(2);
                  return;
                }
                if (key === "{back}") {
                  setLettersPage(1);
                  return;
                }
                _insertCharacter(key);
              }}
            >
              {key === "{more}" ? "Más +" : key === "{back}" ? "Volver" : key}
            </button>
          ))}
        </div>

        {mode === "numbers" ? (
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
              onClick={() => void _handleContinue()}
              disabled={loading || !isValid}
            >
              {loading ? "..." : "OK"}
            </button>
          </div>
        ) : (
          <div className="res-botonera-actions">
            <button type="button" className="res-botonera-key res-botonera-key--dark" onClick={_deleteLastCharacter}>
              Borrar
            </button>
            <button type="button" className="res-botonera-key res-botonera-key--ghost" onClick={_clearValue}>
              Limpiar
            </button>
            <button
              type="button"
              className="res-botonera-key res-botonera-key--accent"
              onClick={() => void _handleContinue()}
              disabled={loading || !isValid}
            >
              {loading ? "..." : "OK"}
            </button>
          </div>
        )}
      </div>

      <div className="text-center my-2">
        <button
          className="res-keypad-back-button"
          onClick={() => {
            if (onBack) {
              onBack();
              return;
            }
            navigate("/");
          }}
          disabled={loading}
        >
          {backLabel}
        </button>
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="container-fluid h-100 res-page">
      <div className="w-100 text-center my-3">
        <Logo style={{ width: "100px" }} />
      </div>
      <div className="res-content d-flex justify-content-center align-items-center p-0">
        {content}
      </div>
    </div>
  );
};

export default ApartmentKeyboardWithRedirect;
