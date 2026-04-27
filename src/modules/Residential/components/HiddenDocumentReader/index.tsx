/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { _pushToastMessage } from "../../../../helpers/messages";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { set_loader } from "../../../../redux/actions/loader";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { validateDocumentData } from "../../../../helpers/validate_qrcode_data";
import { set_order } from "../../../../redux/actions/order";

interface IHiddenDocumentReaderProps {
  redirectUrl?: string;
}

const HiddenDocumentReader = ({ redirectUrl }: IHiddenDocumentReaderProps) => {
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const dispatch: any = useDispatch();
  const navigate = useNavigate();
  const inputRef: any = useRef<any>();
  const debouncedSave = useRef(
    debounce((nextValue) => _formatAndCheckData(nextValue), 700)
  ).current;

  /**
   * Focus input
   * clear interval
   * @returns void
   */
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

  /* Proccess data from input */
  const _formatAndCheckData = async (qrcode: any) => {
    inputRef.current.value = qrcode?.toLowerCase();

    dispatch(set_loader({ is_loading: true }));

    const validateCodeResponse: any = await validateDocumentData(qrcode);

    console.log("validateCodeResponse", validateCodeResponse);

    dispatch(set_loader({ is_loading: false }));

    if (!validateCodeResponse.isValid) {
      inputRef.current.value = "";
      _pushToastMessage({
        header: "Error",
        text: validateCodeResponse.message,
        type: "error",
      });
      return;
    }

    if (validateCodeResponse.method === "rut_by_document") {
      inputRef.current.value = "";
      dispatch(set_order({ document: validateCodeResponse.data.rut }));
      navigate(`/pickup-without-code/info-apartament?redirectUrl=${redirectUrl}`, { replace: true });
    }
  };

  const _handleChangeInput = (e: any) => {
    debouncedSave(e?.target?.value);
  };

  return (
    <div style={{ position: "absolute", top: "-100px" }}>
      <input
        type="text"
        ref={inputRef}
        id="codetext"
        style={{ opacity: 1, color: "#000" }}
        onChange={_handleChangeInput}
      />
    </div>
  );
};

export default HiddenDocumentReader;
