import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import Logo from "../../../../components/Logo";
import { set_session } from "../../../../redux/actions/session";
import ThemeToggle from "../ThemeToggle";
import "./component.header.scss";

type HeaderProps = {
  hideThemeToggle?: boolean;
  showThemeToggle?: boolean;
};

const Header = ({ hideThemeToggle = false, showThemeToggle = false }: HeaderProps) => {
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const dispatch: any = useDispatch();
  const navigate = useNavigate();

  const _handleSigIn = () => {
    dispatch(set_session({ ...session, sign_in_component: true }));
  };

  return (
    <div className="container-fluid">
      <div className="row component-header mx-2 mx-lg-4">
        <div className="col-12">
          <div className="component-header__content">
            <div className="component-header__brand">
              <button
                type="button"
                className="btn p-0 m-0 component-header__brand-button"
                onClick={_handleSigIn}
                aria-label="Abrir inicio de sesión"
              >
                <Logo />
              </button>
            </div>
            {!hideThemeToggle && (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="res-theme-toggle"
                  onClick={() => navigate("/", { replace: true })}
                  aria-label="Ir al inicio"
                  title="Inicio"
                >
                  <FiHome aria-hidden="true" />
                </button>
                {showThemeToggle && <ThemeToggle />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
