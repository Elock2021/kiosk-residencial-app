/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import Keyboard from "../../../../components/Keyboard";

const NumberKeyboard = ({
  isOpen,
  onConfirm,
}: {
  isOpen: boolean;
  onConfirm: (data: any) => void;
}) => {
  const [state, setState] = useState<any>({
    data: "",
  });
  const keyboardRef: any = useRef(null);

  useEffect(() => {
    import("./styles.scss");
    if (!isOpen) {
      if (!keyboardRef || !keyboardRef.current) return;
      keyboardRef.current.setInput("");
      setState({ data: "" });
    }
  }, [isOpen]);

  const _handleOnKeyPress = (button: any) => {
    console.log("[state]", state.data, "[button]", button);

    if (button === "{bksp}") {
      setState({ data: state.data.slice(0, -1) });
      return;
    }

    if (button === "{enter}") {
      onConfirm(state.data);
      return;
    }

    setState({ data: state.data + button });
  };

  const _handleOnChange = (value: any) => {};

  return (
    <div
      className="w-100 d-flex flex-column justify-content-end align-items-center keyboard-number drawer-comp-exit"
      style={{ color: "var(--res-text)", height: "100%" }}
    >
      <input
        type="text"
        className="w-100 py-4 text-center bold"
        style={{
          letterSpacing: "2px",
          fontSize: "36px",
          color: "var(--res-text)",
          background: "var(--res-surface-elevated)",
          border: "1px solid var(--res-border)",
        }}
        value={state.data}
        readOnly
        placeholder="DIGITA EL NÚMERO DE DEPARTAMENTO/CASA"
      />
      <div className="w-100 res-keypad-shell">
        <Keyboard
          onKeyPress={_handleOnKeyPress}
          onChange={_handleOnChange}
          keyboardRef={keyboardRef}
          layoutType={"spanish_only_numbers"}
        />
      </div>
    </div>
  );
};

export default NumberKeyboard;
