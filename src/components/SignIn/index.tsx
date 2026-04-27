import { useRef, useState } from "react";
import { Input } from "rsuite";
import Keyboard from "../Keyboard";
import Logo from "../Logo";
import CloseOutlineIcon from "@rsuite/icons/CloseOutline";
import "./component.signin.scss";
import { useDispatch } from "react-redux";
import { set_session } from "../../redux/actions/session";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { _pushToastMessage } from "../../helpers/messages";
import AuthService from "../../services/auth.service";
import { set_loader } from "../../redux/actions/loader";

const SignIn = (props: any) => {
  const { open } = props;
  const [state, setState] = useState<any>({
    username: "",
    password: "",
    target: "username",
  });
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const keyboardRef: any = useRef();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const Auth = new AuthService();

  const _handleOnKeyPress = (button: any) => {
    console.log("[state]", state[state.target], "[button]", button);
  };

  const _handleOnChange = (value: any) => {
    setState({ ...state, [state.target]: value });
  };

  const _handleOnChangeInput = (e: any) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    keyboardRef.current.setInput(e.target.value);
  };

  const _setTargetField = (e: any) => {
    e.target.removeAttribute("readonly");
    setState({ ...state, target: e.target.name });
    keyboardRef.current.setInput(state[e.target.name]);
  };

  const _closeSignIn = () => {
    if (!session.is_connected) {
      _pushToastMessage({
        type: "warning",
        text: "Inicia sesion antes de continuar...",
        header: "Aviso",
      });
      return;
    }
    dispatch(set_session({ ...session, sign_in_component: false }));
  };

  const _handleSignIn = async () => {
    dispatch(set_loader({ is_loading: true }));
    try {
      const response: any = await Auth.signin({ ...state });
      setState({ ...state, username: "", password: "" });

      dispatch(
        set_session({
          ...session,
          ...response.data,
          is_connected: true,
          is_logged: true,
          sign_in_component: false,
        })
      );

      dispatch(set_loader({ is_loading: false }));
      navigate("/dashboard");
    } catch (e: any) {
      _pushToastMessage({
        type: "error",
        text: "Usuario o contraseña invalidos",
        header: "Error",
      });
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleSingInQr = () => {
    if (session?.is_connected && session?.profile?.id) {
      dispatch(set_session({ ...session, sign_in_component: false }));
      navigate("/dashboard/signin/qr?redirect_uri=/dashboard");
      return;
    }

    _pushToastMessage({
      type: "warning",
      text: "Inicia sesion en un terminal antes de continuar...",
      header: "Aviso",
    });
  };

  return (
    <div
      className="sign-in-component"
      style={{ transform: open ? "translateX(0%)" : "translateX(100%)" }}
    >
      <div className="sign-in-component__form h-100 shadow res-signin-panel" style={{ width: "90%" }}>
        <div className="row">
          <div className="col text-end mt-3">
            <button className="btn" onClick={_closeSignIn}>
              <CloseOutlineIcon style={{ fontSize: "1.3rem", color: "var(--res-text, #000)" }} />
            </button>
          </div>
        </div>
        <div className="row h-100 px-4 mt-4">
          <div className="col-12">
            <div className="px-5 text-center">
              <Logo style={{ width: "200px" }} />
            </div>
            <form autoComplete="off">
              <div className="mt-5 px-5" style={{ color: "var(--res-text, #000)" }}>
                Usuario
                <Input
                  value={state.username}
                  name="username"
                  type="text"
                  onFocus={_setTargetField}
                  onChange={(e: any) =>
                    _handleOnChangeInput({
                      target: { value: e, name: "username" },
                    })
                  }
                />
              </div>
              <div className="mt-3 px-5" style={{ color: "var(--res-text, #000)" }}>
                Contraseña
                <Input
                  value={state.password}
                  name="password"
                  type="password"
                  onFocus={_setTargetField}
                  onChange={(e: any) =>
                    _handleOnChangeInput({
                      target: { value: e, name: "password" },
                    })
                  }
                />
              </div>
            </form>
            <div className="mt-4 keyboard-master-key">
              <Keyboard
                keyboardRef={keyboardRef}
                onKeyPress={_handleOnKeyPress}
                onChange={_handleOnChange}
                layoutType="spanish"
              />
            </div>

            <div className="text-center mt-4">
              <button className="res-signin-button btn btn-outline-secondary px-4" onClick={_handleSignIn}>
                Entrar
              </button>
              <button className="res-signin-button btn btn-outline-secondary px-4 ms-3" onClick={_handleSingInQr}>
                Entrar con QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
