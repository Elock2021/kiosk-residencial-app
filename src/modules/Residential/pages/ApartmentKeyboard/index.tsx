/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../components/Logo";
import { _pushToastMessage } from "../../../../helpers/messages";

const VALID_APARTMENT_REGEX = /^\d{1,4}[ABC]?$/;
const LETTER_KEYS = new Set(["A", "B", "C"]);
const keyRows: string[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["A", "0", "B"],
  ["C", "Borrar", "Continuar"],
];

const ApartmentKeyboard = () => {
  const [value, setValue] = useState<string>("");
  const navigate = useNavigate();
  const isValid = useMemo(() => VALID_APARTMENT_REGEX.test(value), [value]);

  const handleContinue = () => {
    if (!isValid) {
      _pushToastMessage({
        type: "warning",
        text: "Ingresa un número válido. Ej: 203, 12A.",
        header: "Aviso",
      });
      return;
    }
    navigate(`/delivery-with-apartament/${value}`, { replace: true });
  };

  const deleteCharacter = () => {
    setValue((prevValue) => prevValue.slice(0, -1));
  };

  const insertCharacter = (character: string) => {
    setValue((prevValue) => {
      if (prevValue.length >= 5) return prevValue;

      const nextCharacter = character.toUpperCase();
      const hasLetterAlready = /[ABC]$/.test(prevValue);

      if (LETTER_KEYS.has(nextCharacter)) {
        if (hasLetterAlready || prevValue.length === 0 || /[A-Z]/.test(prevValue)) return prevValue;
        return `${prevValue}${nextCharacter}`;
      }

      if (!/\d/.test(nextCharacter)) return prevValue;
      if (hasLetterAlready) return prevValue;
      if (prevValue.length >= 4) return prevValue;

      return `${prevValue}${nextCharacter}`;
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleKeyPress = (key: string) => {
    if (key === "Borrar") {
      deleteCharacter();
      return;
    }
    if (key === "Continuar") {
      handleContinue();
      return;
    }
    insertCharacter(key);
  };

  return (
    <div className="container-fluid h-100 res-page">
      <div className="w-100 text-center my-3">
        <Logo style={{ width: "100px" }} />
      </div>
      <div className="res-content d-flex align-items-center justify-content-center p-0">
        <div className="res-apartment-kiosk">
          <div className="res-apartment-kiosk__header">
            <h1 className="res-home-title res-apartment-kiosk__title">Ingrese el número de su domicilio</h1>
          </div>

          <div className="res-apartment-kiosk__input" aria-live="polite">
            <span className={value ? "res-apartment-kiosk__value" : "res-apartment-kiosk__placeholder"}>
              {value || "Ej: 203, 12A"}
            </span>
          </div>

          <div className="res-apartment-kiosk__keypad" role="group" aria-label="Teclado de departamento o casa">
            {keyRows.map((row, rowIndex) => (
              <div className="res-apartment-kiosk__row" key={`row-${rowIndex}`}>
                {row.map((key) => {
                  const isDelete = key === "Borrar";
                  const isContinue = key === "Continuar";
                  return (
                    <button
                      key={key}
                      type="button"
                      className={[
                        "res-apartment-kiosk__key",
                        isDelete ? "res-apartment-kiosk__key--delete" : "",
                        isContinue ? "res-apartment-kiosk__key--continue" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => handleKeyPress(key)}
                      disabled={isContinue && !isValid}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-center mt-1">
            <button type="button" className="main-button res-secondary" onClick={handleBack}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentKeyboard;
