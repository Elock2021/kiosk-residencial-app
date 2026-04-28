/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { set_loader } from "../../../../redux/actions/loader";
import DeliveryUserService from "../../../../services/delivery_user.service";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { _pushToastMessage } from "../../../../helpers/messages";
import Header from "../../components/Header";
import User from "../../../../assets/svg/user.svg?react";
import Circle from "../../../../assets/svg/circle.svg?react";

import "./component.apartment.scss";
import { set_order } from "../../../../redux/actions/order";

const getResidentDisplayName = (name: string) => {
  const cleanName = String(name || "")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleanName || name;
};

const Apartaments = () => {
  const [state, setState] = useState<any>({
    users: [],
    selectedUser: null,
  });

  const { session, loader } = useSelector((state: any) => ({ session: state.session, loader: state.loader }));
  const params: any = useParams();
  const apartmentLabel = String(params.apartment || "").toUpperCase();
  const dispatch: any = useDispatch();
  const DeliveryUsers = new DeliveryUserService();
  const navigate = useNavigate();

  useEffect(() => {
    _getUsers();
  }, []);

  const isNumber = (value: string) => {
    const regex = /^[0-9]+$/;
    return regex.test(value);
  };

  const _getUsers = async () => {
    dispatch(set_loader({ is_loading: true }));
    try {
      const response: any = await DeliveryUsers.filter_users({
        terminal_id: session.profile?.id,
        params: { apartment: params.apartment },
      });
      const { delivery_users } = response.data;
      let users = delivery_users.filter((user: any) => {
        let apartment = user.apartment;

        if (!apartment) return false;

        /* REMOVE SPACES */
        apartment = apartment.replace(/ /g, "");

        /* GET QUERY POSITION INTO STRING */
        const position = apartment
          ?.toLowerCase()
          .indexOf(params.apartment?.toLowerCase());

        /* IF QUERY NOT FOUND */
        if (position === -1) return false;

        /* GET NEXT AND BEFORE CHAR */
        const nextChar = apartment[position + params.apartment.length];

        const beforeChar = apartment[position - 1];

        /* IF NEXT AND BEFORE CHAR ARE EMPTY */
        if (!beforeChar && !nextChar) return true;

        /* IF NOT EXISTS A CHAR BEFORE, CHECK IF NEXT CHAR EXISTS AND IF IS A NUMBER */
        if (!beforeChar) {
          if (isNumber(nextChar)) return false;
        }

        /* IF NOT EXISTS A CHAR NEXT, CHECK IF BEFORE CHAR EXISTS AND IF IS A NUMBER */
        if (!nextChar) {
          if (isNumber(beforeChar)) return false;
        }

        /* IF EXISTS A CHAR BEFORE AND NEXT, CHECK IF ONE OF THEM ARE NUMBERS */
        if (beforeChar && nextChar) {
          if (isNumber(beforeChar) || isNumber(nextChar)) return false;
        }

        return true;
      });

      if (users.length === 0) {
        _pushToastMessage({
          type: "warning",
          text: "No hay residentes en este departamento",
          header: "Aviso",
        });
        navigate("/");
      }

      users.sort((a: any, b: any) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      setState({ ...state, users: users || [] });
      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      _pushToastMessage({
        type: "warning",
        text: "No fue posible cargar los usuarios",
        header: "Aviso",
      });
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleSelectUser = (user: any) => {
    console.log(user);
    dispatch(set_order({ user: user }));
    navigate(`/open-box-delivery/${params.apartment}`);
  };

  const visibleUsers = state.users.slice(-5);
  const residentListLayoutClass =
    visibleUsers.length >= 6 ? "res-resident-list--two-cols" : "res-resident-list--one-col";

  const UserInfoCard = ({ user }: any) => {
    return (
      <button className="res-resident-item uppercase bold" onClick={() => _handleSelectUser(user)}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ width: "88px", position: "relative" }}
        >
          <Circle
            style={{ position: "absolute", width: "52px", height: "52px" }}
          />
          <User
            style={{ position: "absolute", width: "34px", height: "34px" }}
          />
        </div>
        <div className="d-flex flex-column justify-content-center">
          <div className="text-start res-resident-name">{getResidentDisplayName(user.name)}</div>
        </div>
      </button>
    );
  };

  return (
    <div className="container-fluid h-100 res-page">
      <Header />
      <div className="res-content d-flex align-items-center justify-content-center">
        <div className="res-flow" style={{ gap: "10px" }}>
          {loader.is_loading && (
            <div className="w-100 text-center bold size-14 mt-3">
              Buscando residentes...
            </div>
          )} 

          {!loader.is_loading && (
            <div className="w-100 text-center mt-2">
              <div className="res-resident-context">Depto {apartmentLabel}</div>
              <div className="res-home-title res-apartment-kiosk__title">Selecciona residente</div>
            </div>
          )}

          {state.users?.length > 0 && (
            <div className={`res-resident-list res-resident-list--spaced apartment ${residentListLayoutClass}`}>
              {visibleUsers.map((user: any, index: number) => (
                <UserInfoCard user={user} key={index} />
              ))}
            </div>
          )}

          <div className="text-center res-resident-actions">
            <button className="main-button res-secondary" onClick={() => navigate("/info-apartment")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apartaments;
