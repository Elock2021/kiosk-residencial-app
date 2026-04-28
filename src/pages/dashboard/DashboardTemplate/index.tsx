import Logo from "../../../components/Logo";
import Locker from "../../../assets/svg/locker.svg?react";
import LogOut from "../../../assets/svg/logout.svg?react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { set_session } from "../../../redux/actions/session";
import { useSelector } from "react-redux";

const DashboardTemplate = (props: any) => {
  const { children } = props;
  const HEADER_HEIGHT = 72;
  const navigate = useNavigate();
  const { session } = useSelector((state: any) => ({ session: state.session }));

  const dispatch: any = useDispatch();

  const _handleLogout = () => {
    dispatch(
      set_session({
        ...session,
        is_logged: false,
        master_key: { is_connected: false, code: "", created_at: null },
      })
    );
    navigate("/");
  };

  return (
    <div
      className="container-fluid background-color-base"
      style={{ height: "100vh", minHeight: "100vh", overflow: "hidden" }}
    >
      <div className="row h-100 color-black">
        <div className="h-100 m-0 p-0 col-12">
          <div
            className="w-100 shadow-sm ps-4 pe-2 d-flex align-items-center"
            style={{
              height: `${HEADER_HEIGHT}px`,
              borderBottom: "1px solid #dcdfe3",
              backgroundColor: "#ffffff",
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
          >
            <div className="d-flex align-items-center" style={{ minWidth: "210px" }}>
              <Logo company="gux" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
            </div>

            <div
              className="d-flex align-items-center px-3 py-2 rounded"
              style={{ backgroundColor: "#f4f6f8", border: "1px solid #e1e5ea" }}
            >
              <span style={{ fontWeight: 700, fontSize: "15px" }}>{session?.profile?.username}</span>
              <Locker style={{ width: "26px", height: "26px" }} className="ms-2" />
            </div>

            <button
              className="btn d-flex align-items-center ms-auto"
              onClick={_handleLogout}
              style={{
                fontWeight: 700,
                border: "1px solid #d2d7dd",
                backgroundColor: "#ffffff",
                color: "#20242b",
                borderRadius: "10px",
                padding: "6px 12px",
                marginRight: 0,
              }}
            >
              <LogOut style={{ width: "22px", height: "22px" }} className="me-1" />
              Cerrar
            </button>
          </div>
          <div
            className="content w-100"
            style={{
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
              overflowY: "auto",
              overflowX: "hidden",
              backgroundColor: "#f0f6f6",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
