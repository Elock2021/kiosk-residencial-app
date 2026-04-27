/* eslint-disable react-hooks/exhaustive-deps */
import { debounce } from "lodash";
import { useEffect, useRef } from "react";
import { _pushToastMessage } from "../../helpers/messages";
import { useDispatch } from "react-redux";
import { set_loader } from "../../redux/actions/loader";
import MasterKeyService from "../../services/masterkey.service";
import { useSelector } from "react-redux";
import { set_session } from "../../redux/actions/session";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const SignInQr = () => {
  const inputRef: any = useRef<any>();
  const debouncedSave = useRef(
    debounce((nextValue) => _handleDebounceEvent(nextValue), 700)
  ).current;
  const dispatch: any = useDispatch();
  const MasterKey = new MasterKeyService();
  const session = useSelector((state: any) => state.session);
  const loader = useSelector((state: any) => state.loader);
  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  useEffect(() => {
    const interval: any = setInterval(() => {
      inputRef.current.focus();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const _handleChangeInput = (e: any) => {
    debouncedSave(e?.target?.value);
  };

  const _handleDebounceEvent = (data: any) => {
    inputRef.current.value = "";
    const code: any = data.replace(/[\r\n]/gm, "");
    _validateCode(code);
  };

  const _validateCode = async (code: any) => {
    if (loader.is_loading) return;

    try {
      dispatch(set_loader({ is_loading: true }));
      const payload: any = {
        key: code,
        terminal_id: session?.profile?.id,
        action: "SIGNIN_QR" || null,
        description:
          "El usuario {USER} inicio sesion con un codigo QR en el locker {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}",
        order_id: null,
      };
      await MasterKey.validateAndLogMasterkey(payload);
      dispatch(
        set_session({
          ...session,
          master_key: {
            is_connected: true,
            code: code,
            created_at: moment.now(),
          },
        })
      );
      dispatch(set_loader({ is_loading: false }));
      navigate(params.get("redirect_uri") || "/");
    } catch (e: any) {
      _pushToastMessage({
        header: "Error",
        text: "El código ingresado no es válido",
        type: "error",
      });
      dispatch(set_loader({ is_loading: false }));
      dispatch(
        set_session({
          ...session,
          master_key: {
            is_connected: false,
            code: "",
            created_at: moment.now(),
          },
        })
      );
    }
  };

  return (
    <div className="container-fluid">
      <div style={{ position: "absolute", top: "-100px" }}>
        <input
          type="text"
          ref={inputRef}
          id="codetext"
          style={{ opacity: 1, color: "#000" }}
          onChange={_handleChangeInput}
        />
      </div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="text-center">
          <div
            className="bold"
            style={{ fontSize: "40px", textTransform: "uppercase" }}
          >
            Escanea su código QR
          </div>
          <div
            className="bold"
            style={{ fontSize: "32px", textTransform: "uppercase" }}
          >
            para iniciar sesión
          </div>

          <div>
            <button onClick={() => navigate('/')} className="main-button px-4 py-2 bold mt-5">Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInQr;
