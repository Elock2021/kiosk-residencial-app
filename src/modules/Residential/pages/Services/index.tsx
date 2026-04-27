/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "../../../../components/Keyboard";
import Logo from "../../../../components/Logo";
import SquareInput from "../../../../components/SquareInput";
import OrderService from "../../../../services/order.service";
import { useSelector } from "react-redux";
import { _handleError } from "../../../../helpers/errors";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { set_pickup } from "../../../../redux/actions/pickup";

const Services = () => {
  const [state, setState] = useState<any>({
    fields: {
      field1: {
        value: "",
        selected: true,
      },
      field2: {
        value: "",
        selected: false,
      },
      field3: {
        value: "",
        selected: false,
      },
      field4: {
        value: "",
        selected: false,
      },
      field5: {
        value: "",
        selected: false,
      },
      field6: {
        value: "",
        selected: false,
      },
    },
    qrcode: "",
  });

  const keyboardRef = useRef<any>();
  const inputRef: any = useRef<any>();
  const navigate = useNavigate();
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const Order = new OrderService();
  const dispatch: any = useDispatch();

  useEffect(() => {
    const qrcodelength: any = state.qrcode.length;

    Array.from({ length: 6 }).forEach((_: any, index: any) => {
      state.fields[`field${index + 1}`] = {
        value: state.qrcode[index],
        selected: index === qrcodelength ? true : false,
      };
    });

    inputRef.current.value = state.qrcode;

    setState({
      ...state,
    });

    if (qrcodelength === 6) {
      _handleValidateCode(state.qrcode);
    }
  }, [state.qrcode]);

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

  const _handleOnKeyPress = (button: any) => {
    if (button !== "{bksp}") {
      if (state.qrcode.length <= 5) {
        setState({ ...state, qrcode: state.qrcode + button });
      } else {
        setState({ ...state, qrcode: button });
        keyboardRef.current.setInput(button);
      }
    } else {
      state.qrcode = state.qrcode.substring(0, state.qrcode.length - 1);
      setState({ ...state });
      keyboardRef.current.setInput(state.qrcode);
    }
  };

  const _handleOnChange = (value: any) => {
    console.log(value);
  };

  const _handleValidateCode = async (code: any) => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const response: any = await Order.checkReservationServiceCode({
        terminal_id: session?.profile?.id,
        code: code,
      });
      dispatch(set_loader({ is_loading: false }));
      dispatch(
        set_pickup({ reservation: response.data, boxes: response.data?.boxes })
      );
      navigate("/services/open-box-delivery-services");
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleChangeInput = (e: any) => {
    if (e.target.value.length > 6) {
      const firstLetter: any = e.target.value.substring(
        e.target.value.length - 1
      );
      setState({ ...state, qrcode: firstLetter?.toUpperCase() });
    } else {
      setState({ ...state, qrcode: e?.target?.value?.toUpperCase() });
    }
  };

  const _clearField = () => {
    inputRef.current.value = "";
    setState({ ...state, qrcode: "" });
  };
  return (
    <div className="container-fluid h-100 res-page">
      <div className="res-content d-flex justify-content-center align-items-center">
        <div className="res-kiosk-panel">
          <div className="row box rounded-0 p-3 mb-3" style={{ minHeight: "32vh" }}>
            <div className="col-12 mt-3">
              <Logo style={{ width: "140px" }} />
              <input
                type="text"
                ref={inputRef}
                id="codetext"
                style={{ opacity: 0 }}
                onChange={_handleChangeInput}
                maxLength={7}
              />
            </div>
            <div className="col-12 text-center bold size-14 color-white">
              Introduce o escanea el código QR
            </div>
            <div className="col-12 d-flex justify-content-center mt-2">
              <div className="res-code-grid d-flex justify-content-center">
                {Object.keys(state.fields).map((key: any) => (
                  <SquareInput {...state.fields[key]} key={key} />
                ))}
              </div>
            </div>
          </div>

          <div className="row align-items-center px-2 keyboard" style={{ height: "52vh" }}>
            <Keyboard
              onKeyPress={_handleOnKeyPress}
              onChange={_handleOnChange}
              keyboardRef={keyboardRef}
              layoutType={"spanish_basic_without_space"}
            />

            <div className="res-footer-actions mt-3">
              <button className="main-button" onClick={_clearField}>
                Limpiar
              </button>
              <button className="main-button" onClick={() => navigate("/")}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
