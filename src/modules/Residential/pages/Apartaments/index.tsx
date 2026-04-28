/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { set_loader } from "../../../../redux/actions/loader";
import DeliveryUserService from "../../../../services/delivery_user.service";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { _pushToastMessage } from "../../../../helpers/messages";
import Header from "../../components/Header";
import { TbUserSearch } from "react-icons/tb";
import { set_order } from "../../../../redux/actions/order";

const getResidentDisplayName = (name: string) => {
  const cleanName = String(name || "")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleanName || name;
};

const MAX_RESIDENTS_FOR_TEST = 5;

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

  const visibleUsers = state.users.slice(0, MAX_RESIDENTS_FOR_TEST);
  const residentListLayoutClass =
    visibleUsers.length >= 6 ? "res-resident-list--two-cols" : "res-resident-list--one-col";

  const UserInfoCard = ({ user }: any) => {
    return (
      <button type="button" className="res-help-route res-delivery-apartment__resident" onClick={() => _handleSelectUser(user)}>
        <span className="res-help-route__copy">
          <strong>{getResidentDisplayName(user.name)}</strong>
          <small>Residente del depto {apartmentLabel}</small>
        </span>
        <span className="res-help-route__icon res-delivery-apartment__icon">
          <TbUserSearch />
        </span>
      </button>
    );
  };

  return (
    <div className="container-fluid h-100 res-page">
      <Header hideThemeToggle={false} showThemeToggle={false} />
      <div className="res-content d-flex justify-content-center res-content--help">
        <div className="res-help-module res-help-module--menu res-delivery-apartment">
          {loader.is_loading && (
            <div className="w-100 text-center bold size-14 mt-3">
              Buscando residentes...
            </div>
          )}

          {!loader.is_loading && (
            <div className="res-help-module__heading res-help-module__heading--menu">
              <p className="res-help-module__eyebrow">Depto {apartmentLabel}</p>
              <h1 className="res-help-module__title">Selecciona residente</h1>
              <p className="res-help-module__subtitle">Elige una opción para continuar.</p>
            </div>
          )}

          {state.users?.length > 0 && (
            <div className={`res-help-module__actions res-delivery-apartment__actions ${residentListLayoutClass}`}>
              {visibleUsers.map((user: any, index: number) => (
                <UserInfoCard user={user} key={index} />
              ))}
            </div>
          )}

          <div className="res-help-module__back">
            <button type="button" className="res-help-back-button" onClick={() => navigate("/info-apartment")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apartaments;
