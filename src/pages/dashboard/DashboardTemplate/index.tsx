/* eslint-disable react-hooks/exhaustive-deps */
import Logo from "../../../components/Logo";
import ItemMenu from "./ItemMenu";
import Locker from "../../../assets/svg/locker.svg?react";
import Box from "../../../assets/svg/locker.svg?react";
import Orders from "../../../assets/svg/package.svg?react";
import LogOut from "../../../assets/svg/logout.svg?react";
import Coms from "../../../assets/svg/coms.svg?react";
import { IoCloudDownload } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { set_session } from "../../../redux/actions/session";
import { useSelector } from "react-redux";

const DashboardTemplate = (props: any) => {
  const { children } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useSelector((state: any) => ({ session: state.session }));

  const [state, setState] = useState({
    menu: [
      {
        label: "Cajas",
        url: "/dashboard",
        Icon: Box,
        selected: false,
      },
      {
        label: "Pedidos",
        url: "/dashboard/orders",
        Icon: Orders,
        selected: false,
      },
      {
        label: "Puertos",
        url: "/dashboard/doors",
        Icon: Coms,
        selected: false,
      },
      {
        label: "Actualización",
        url: "/dashboard/version",
        Icon: IoCloudDownload,
        selected: false,
      },
    ],
  });

  const dispatch: any = useDispatch();

  useEffect(() => {
    state.menu.forEach((menu: any) => {
      menu.selected = menu.url === location.pathname;
    });

    setState({ ...state });
  }, [location]);

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
    <div className="container-fluid h-100 background-color-base">
      <div className="row h-100 color-black">
        <div
          className=" h-100 background-color-white shadow-sm d-flex flex-column align-items-center p-0"
          style={{ width: "11%" }}
        >
          <div className="w-100 px-3 pt-3 pb-2 text-center">
            <Logo company="gux" />
          </div>

          {state.menu.map((menu: any) => (
            <ItemMenu {...menu} key={`${menu.label}-${menu.url}`} />
          ))}

          <ItemMenu
            label="Cerrar"
            url="dashboard/exit"
            Icon={LogOut}
            onClick={_handleLogout}
          />
        </div>
        <div className="h-100 m-0 p-0" style={{ width: "89%" }}>
          <div
            className="w-100 background-color-gris shadow-sm px-3 size-09 d-flex justify-content-end align-items-center"
            style={{
              fontWeight: "bold",
              height: "8vh",
              borderBottom: "1px solid #f3f3f3",
            }}
          >
            {session?.profile?.username}
            <Locker
              style={{ width: "30px", height: "30px" }}
              className="ms-3"
            />
          </div>
          <div
            className="content w-100"
            style={{ height: "92vh", overflow: "auto" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
