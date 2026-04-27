import TrashIcon from "@rsuite/icons/Trash";
import ParagraphIcon from "@rsuite/icons/Paragraph";

export const _actionMenuSpeaker = (data: any, _handleOnSelect: any) => {
  return {
    menu: [
      {
        label: "Cancelar",
        Icon: TrashIcon,
        show: true,
        eventKey: 1,
      },
      {
        label: "Detalles",
        Icon: ParagraphIcon,
        show: true,
        eventKey: 2,
      },
    ],
    _handleSelect: (eventKey: any, payload: any) =>
      _handleOnSelect({ option: eventKey, id: payload.order.id }),
    order: data,
  };
};
