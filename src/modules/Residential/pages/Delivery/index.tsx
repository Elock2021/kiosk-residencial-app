/* eslint-disable react-hooks/exhaustive-deps */
import Header from "../../components/Header";
import AvailableBoxes from "../../../../components/AvailableBoxes";
import Input from "../../components/Input";
import Keyboard from "../../../../components/Keyboard";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import { useDispatch } from "react-redux";
import { set_order } from "../../../../redux/actions/order";
import DeliveryUserService from "../../../../services/delivery_user.service";
import { _pushToastMessage } from "../../../../helpers/messages";
import { useSelector } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";

const Delivery = () => {
  const [state, setState] = useState<any>({
    data: "",
    modal: { headerText: "", contentText: "", open: false, type: "warning" },
    users: [],
    search: [],
    selectedUser: null,
  });
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const keyboardRef: any = useRef(null);
  const navigate = useNavigate();
  const dispatch: any = useDispatch();
  const DeliveryUsers = new DeliveryUserService();

  useEffect(() => {
    _getUsers();
  }, []);

  const _getUsers = async () => {
    dispatch(set_loader({ is_loading: true }));
    try {
      const response: any = await DeliveryUsers.list_users(session?.profile.id);
      const { delivery_users } = response.data;
      setState({ ...state, users: delivery_users || [] });
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

  const _handleOnKeyPress = (button: any) => {
    console.log("[state]", state.data, "[button]", button);
  };

  const _handleOnChange = (value: any) => {
    const { users } = state;
    value = value?.trim();
    let search: any = users.filter(
      (item: any) =>
        item.name?.toLowerCase().indexOf(value?.toLowerCase()) !== -1 ||
        item.apartment?.indexOf(value) !== -1
    );

    if (!value || value === "") {
      search = [];
    }

    setState({ ...state, data: value, search, selectedUser: null });
  };

  const _handleOnChangeInput = ({ target }: any) => {
    setState({
      ...state,
      data: target.value,
    });
    keyboardRef.current.setInput(target.value);
  };

  const _handleNext = () => {
    setState({
      ...state,
      modal: {
        ...state.modal,
        contentText: `¿Estas seguro que la entrega es para sr(a) ${state.selectedUser?.name}, departamento/oficina: ${state.selectedUser?.apartment}?`,
        open: true,
      },
    });
  };

  const _handleConfirmModal = () => {
    dispatch(set_order({ user: state.selectedUser }));
    navigate("/available-boxes");
  };

  const _handleCancelModal = () => {
    setState({
      ...state,
      modal: {
        ...state.modal,
        open: false,
      },
    });
  };

  const _handleSelectUser = (id: any) => {
    const { users } = state;
    const user: any = users.find((item: any) => item.id === id);
    if (user) {
      setState({
        ...state,
        selectedUser: { ...user },
        data: user.name,
        search: [],
      });
      keyboardRef.current.setInput(user.name);
    }
  };

  return (
    <div className="container-fluid h-100 res-page">
      <ConfirmationModal
        {...state.modal}
        onConfirm={_handleConfirmModal}
        onCancel={_handleCancelModal}
      />
      <Header />
      <div className="res-content px-4">
        <AvailableBoxes />

        <div className="row box position-relative mt-4 py-3">
          <div className="col-12 position-relative">
            {state.search?.length > 0 && (
              <div className="px-0 col-12 shadow position-absolute d-flex flex-column justify-content-between res-search-dropdown">
                {state.search?.map((item: any, index: number) => (
                  <Fragment key={item.id}>
                    {index <= 2 && (
                      <div
                        className="px-3 d-flex align-items-center res-search-dropdown__item"
                        onClick={() => _handleSelectUser(item.id)}
                      >
                        {item.name} - depto {item.apartment}
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
            )}
            <Input
              label="Nombre"
              onChange={_handleOnChangeInput}
              value={state.data}
            />
          </div>

          <div className="col-12">
            <Keyboard
              onKeyPress={_handleOnKeyPress}
              onChange={_handleOnChange}
              keyboardRef={keyboardRef}
              layoutType={"spanish_basic"}
            />
          </div>
        </div>

        <div className="res-footer-actions mt-3">
          <button
            className="main-button"
            onClick={() => navigate("/", { replace: true })}
          >
            Cancelar
          </button>
          <button
            className="main-button-yellow"
            onClick={_handleNext}
            disabled={!state.selectedUser}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
