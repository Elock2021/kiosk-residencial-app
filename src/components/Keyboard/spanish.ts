export const spanish: any = {
  default: [
    "\u007c 1 2 3 4 5 6 7 8 9 0 ' \u00bf {bksp}",
    "{tab} q w e r t y u i o p \u0301 +",
    "{lock} a s d f g h j k l \u00f1 \u007b \u007d {enter}",
    "{shift} < z x c v b n m , . - {shift}",
    ".com @ {space}",
  ],
  shift: [
    '\u00b0 ! " # $ % & / ( ) = ? \u00a1 {bksp}',
    "{tab} Q W E R T Y U I O P \u0308 *",
    "{lock} A S D F G H J K L \u00d1 \u005b \u005d {enter}",
    "{shift} > Z X C V B N M ; : _ {shift}",
    ".com @ {space}",
  ],
};

export const spanish_basic: any = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L \u00d1",
    "Z X C V B N M",
    ".com {space} @",
  ],
};

export const spanish_basic_without_space: any = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L \u00d1",
    "Z X C V B N M",
  ],
};

export const spanish_basic_without_space_with_ok: any = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L \u00d1",
    "Z X C V B N M {enter}",
  ],
};

export const spanish_basic_with_enter: any = {
  default: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    "Q W E R T Y U I O P",
    "A S D F G H J K L \u00d1",
    "Z X C V B N M {enter}",
  ],
};

export const spanish_only_numbers: any = {
  default: [
    "1 2 3",
    "4 5 6",
    "7 8 9",
    "{bksp} 0 {enter}",
  ],
};

export const spanish_only_numbers_with_toggle: any = {
  default: [
    "1 2 3",
    "4 5 6",
    "7 8 9",
    "{bksp} 0 {toggle}",
  ],
};

export default spanish;
