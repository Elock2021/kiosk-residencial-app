/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { _pushToastMessage } from "../../../../helpers/messages";
import OrderService from "../../../../services/order.service";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { set_pickup } from "../../../../redux/actions/pickup";
import { useNavigate } from "react-router-dom";

const HiddenQrRreader = () => {

  const { session } = useSelector((state: any) => ({ session: state.session }));const Order = new OrderService();
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const inputRef: any = useRef<any>();
  const [state, setState] = useState<any>({ qrcode: "" });

  useEffect(() => {
    const qrcodelength: any = state.qrcode.length;

    inputRef.current.value = state.qrcode;

    setState({
      ...state,
    });

    if (qrcodelength === 6) {
      _validateCode(state.qrcode);
    }
  }, [state.qrcode]);

  useEffect(() => {
    const interval: any = setInterval(() => {
      inputRef.current.focus();
    }, 100);

    if (session.sign_in_component) {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [session]);

  const _validateCode = async (code: string) => {
    if (!session.is_connected) return
    try {
      dispatch(set_loader({ is_loading: true }));
      const response = await Order.checkReservationServiceCodeHome({
        terminal_id: session?.profile?.id,
        code: code,
      })

      dispatch(set_loader({ is_loading: false }));

      if (response.data?.reservation_type === 'ecommerce_created') {
        dispatch(
          set_pickup({ reservation: response.data, boxes: response.data?.boxes })
        );
        navigate("/services/open-box-delivery-services");
      }

      if (response.data?.reservation_type === 'sameday_created') {
        dispatch(
          set_pickup({ reservation: response.data, boxes: response.data?.boxes })
        );
        navigate("/services/open-box-delivery-services");
      }

      if (response.data?.reservation_type === 'residential_delivered' || response.data?.reservation_type === 'residential_custody_delivered') {
        dispatch(
          set_pickup({ reservation: response.data, boxes: response.data?.boxes })
        );
        navigate("/open-box-pickup");
      }

      setState({ ...state, qrcode: "" });

    } catch (e: any) {
      setState({ ...state, qrcode: "" });
      dispatch(set_loader({ is_loading: false }));
      _pushToastMessage({ header: 'Error', text: 'Este código no es válido', type: 'error' })
    }
  }

  const _handleChangeInput = (e: any) => {
    if (e.target.value.length > 6) {
      const firstLetter: any = e.target.value.substring(
        e.target.value.length - 1
      );
      setState({ ...state, qrcode: firstLetter?.toUpperCase() });
    } else {
      setState({ ...state, qrcode: e?.target?.value?.toUpperCase() });
    }
  };

  return (
    <div style={{ position: "absolute", top: "-100px" }}>
      <input
        type="text"
        ref={inputRef}
        id="codetext"
        style={{ opacity: 1, color: "#000" }}
        onChange={_handleChangeInput}
        maxLength={6}
      />
    </div>
  )
}

export default HiddenQrRreader;
