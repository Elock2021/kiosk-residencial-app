import { useState, FunctionComponent } from "react";
import KeyboardReact from "react-simple-keyboard";
import {
  spanish_basic,
  spanish_basic_without_space,
  spanish,
  spanish_basic_with_enter,
  spanish_only_numbers,
  spanish_basic_without_space_with_ok,
  spanish_only_numbers_with_toggle,
} from "./spanish";

const Keyboard: FunctionComponent<any> = (props: any) => {
  const { onKeyPress, onChange, keyboardRef, layoutType } = props;
  const [state, setState] = useState<any>({
    layoutName: "default",
    input: "",
    layouts: {
      spanish: spanish,
      spanish_basic: spanish_basic,
      spanish_basic_without_space: spanish_basic_without_space,
      spanish_basic_without_space_with_ok: spanish_basic_without_space_with_ok,
      spanish_basic_with_enter: spanish_basic_with_enter,
      spanish_only_numbers: spanish_only_numbers,
      spanish_only_numbers_with_toggle: spanish_only_numbers_with_toggle,
      button: "",
    },
  });

  const _handleOnKeyPress = (button: any) => {
    // console.log("Button pressed", button);

    if (button === "{shift}" || button === "{lock}") {
      handleShift(button === "{shift}" ? button : null);
      return;
    }

    onKeyPress(button);

    if (state.button === "{shift}") {
      setState({
        ...state,
        button: "",
        layoutName: "default",
      });
    }
  };

  const handleShift = (button: any = null) => {
    const { layoutName } = state;

    setState({
      ...state,
      layoutName: layoutName === "default" ? "shift" : "default",
      button: button,
    });
  };

  return (
    <KeyboardReact
      onChange={onChange}
      onKeyPress={_handleOnKeyPress}
      layoutName={state.layoutName}
      keyboardRef={(ref: any) => (keyboardRef.current = ref)}
      layout={layoutType ? state.layouts[layoutType] : spanish_basic}
      display={{
        "{bksp}": "⌫",
        "{space}": " ",
        "{tab}": "tab",
        "{lock}": "lock",
        "{shift}": "shift",
        "{enter}": "OK",
        "{toggle}": "⌨",
      }}
    />
  );
};

export default Keyboard;
