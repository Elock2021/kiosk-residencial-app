import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Logo from "../../../../components/Logo";
import { set_session } from "../../../../redux/actions/session";
import ThemeToggle from "../ThemeToggle";
import "./component.header.scss";

type HeaderProps = {
  hideThemeToggle?: boolean;
};

const Header = ({ hideThemeToggle = false }: HeaderProps) => {
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const dispatch: any = useDispatch();

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
            {!hideThemeToggle && <ThemeToggle />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
