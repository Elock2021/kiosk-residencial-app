/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyCard from "../../../../components/CompanyCard";
import CourierService from "../../../../services/courier.service";
import { _handleError } from "../../../../helpers/errors";
import { useDispatch } from "react-redux";
import { set_order } from "../../../../redux/actions/order";
import { useSelector } from "react-redux";
import OrderService from "../../../../services/order.service";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { set_loader } from "../../../../redux/actions/loader";

const Companies = () => {
  const [state, setState] = useState({
    companies: [],
    modal: { headerText: "", contentText: "", open: false, type: "warning" },
  });
  const navigate = useNavigate();
  const { order } = useSelector((state: any) => ({ order: state.order }));
  const dispatch: any = useDispatch();
  const Courier = new CourierService();
  const Order = new OrderService();

  useEffect(() => {
    _handleLoadData();
  }, []);

  const _handleLoadData = async () => {
    try {
      const response: any = await Courier.list();

      const companies: any = response.data?.map((item: any) => {
        const courier: any = {
          id: item.value,
          name: item.label,
          logo: item.logo,
          selected: false,
        };

        if (courier.name?.toLowerCase() === "otro") {
          courier.selected = true;
        }

        return courier;
      });

      setState({ ...state, companies });
    } catch (e: any) {
      _handleError(e, e.message);
    }
  };

  const _handleSelectCompany = (id: any) => {
    const companies: any = state.companies.map((item: any) => {
      if (item.id === id) {
        item.selected = true;
      } else {
        item.selected = false;
      }

      return item;
    });
    setState({ ...state, companies });
  };

  const _handleNextStep = () => {
    const courier: any = state.companies?.find((item: any) => item.selected);
    dispatch(set_order({ courier }));
    navigate("/open-box-delivery");
  };

  const _handleCancelOrder = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));
      await Order.cancelOrder({ id: order.order?.id });
      dispatch(set_loader({ is_loading: false }));
      navigate("/");
    } catch (e: any) {
      _handleError(e, "No fue posible cancelar. ");
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleConfirmation = () => {
    setState({
      ...state,
      modal: {
        ...state.modal,
        contentText: `¿Estas seguro que quieres cancelar esta entrega?`,
        open: true,
      },
    });
  };
  return (
    <div className="container-fluid h-100 res-page">
      <Header />
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleCancelOrder}
        onCancel={() =>
          setState({ ...state, modal: { ...state.modal, open: false } })
        }
      />
      <div className="res-content px-4 d-flex flex-column justify-content-around">
        <div className="row box px-3 py-3" style={{ maxHeight: "75vh", overflow: "auto" }}>
          <div className="col-12 mb-3 size-14 bold text-center color-white">
            Seleccione una empresa
          </div>
          {state.companies &&
            state.companies.map((company: any) => (
              <CompanyCard
                {...company}
                onClick={_handleSelectCompany}
                key={company.id}
              />
            ))}
        </div>

        <div className="res-footer-actions mt-3">
          <button className="main-button" onClick={_handleConfirmation}>
            Cancelar
          </button>
          <button className="main-button-yellow" onClick={_handleNextStep}>
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Companies;
