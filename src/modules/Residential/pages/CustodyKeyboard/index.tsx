/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "../../../../components/Keyboard";
import Logo from "../../../../components/Logo";
import { _pushToastMessage } from "../../../../helpers/messages";
import { useDispatch } from "react-redux";
import { set_order } from "../../../../redux/actions/order";
import { useSelector } from "react-redux";
import { FiHome } from "react-icons/fi";

const CustodyKeyboard = () => {
  const [state, setState] = useState<any>({
    data: "",
    keyboardLayout: {
      label: "ABC",
      value: "spanish_only_numbers",
    },
  });

  const keyboardRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const session = useSelector((state: any) => state.session);
  const urlParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    if (urlParams.has("phone")) {
      setState({ ...state, data: urlParams.get("phone") });
    }
  }, []);

  const _handleOnKeyPress = (button: any) => {
    if (button === "{bksp}") {
      setState({ ...state, data: state.data.slice(0, -1) });
      return;
    }

    if (button === "{enter}") {
      if (state.data.length < 9) {
        _pushToastMessage({
          type: "warning",
          text: "Ingrese un número de teléfono válido.",
          header: "Aviso",
        });
        return;
      }

      const custodyUser = {
        id: null,
        name: `custodia_${session?.profile?.username}`,
        phone: `+56${state.data}`,
        email: `custodia_${session?.profile?.username}@${session?.profile?.username}.fake`,
        rut: null,
        address: session?.profile?.address,
        apartment: "Custodia0000",
        company_id: session?.profile?.company_id,
      };

      dispatch(set_order({ user: custodyUser }));
      navigate(`/open-box-custody/${state.data}`, { replace: true });
      return;
    }

    if (state.data.length >= 9) return;

    setState({ ...state, data: state.data + button });
  };

  const _handleOnChange = (value: any) => {
    console.log("ONCHANGE", value);
  };

  return (
    <div className="container-fluid h-100 res-page">
      <div className="w-100 my-4 px-4 d-flex align-items-center justify-content-between">
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
      <div className="d-flex justify-content-center align-items-center p-0 res-custody-stage">
        <div className="d-flex align-items-center justify-content-around flex-column p-5 res-custody-content">
          <div className="w-100 text-center bold size-14 res-custody-title">
            Ingresa el número de teléfono de la persona que va a retirar
          </div>

          <div>
            <div
              className="w-100 d-flex justify-content-center align-items-end my-4 pb-2 res-custody-readout"
            >
              {"(+56)".split("").map((item: any, index: any) => (
                <div
                  className="bold px-0 mx-0 py-0 my-0 res-custody-readout__prefix"
                  key={index}
                >
                  {item}
                </div>
              ))}
              {Array.from({ length: 9 }).map((_, index) => {
                const value = state.data?.[index] || "x";
                return (
                  <div
                    className={`bold px-1 mx-0 py-0 my-0 res-custody-readout__digit ${value === "x" ? "res-custody-readout__digit--placeholder" : ""}`}
                    key={index}
                  >
                    {value}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-100 keyboard-number res-keypad-shell res-custody-keyboard">
            <Keyboard
              onKeyPress={_handleOnKeyPress}
              onChange={_handleOnChange}
              keyboardRef={keyboardRef}
              layoutType={state.keyboardLayout?.value}
            />
          </div>

          <div className="text-center my-3">
            <button className="res-keypad-back-button" onClick={() => navigate("/")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustodyKeyboard;
