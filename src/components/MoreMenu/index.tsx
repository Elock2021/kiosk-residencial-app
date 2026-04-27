import { Fragment } from "react";
import { Dropdown, Popover } from "rsuite";

export const MoreMenu = (
  { className, left, top, onClose }: any,
  ref: any,
  payload: any
) => {
  const { _handleSelect, menu } = payload;

  const _handleOnSelect = (eventKey: any) => {
    onClose();
    _handleSelect(eventKey, payload);
  };

  return (
    <Popover
      ref={ref}
      className={className}
      style={{ left, top, minWidth: "250px" }}
      full
    >
      <Dropdown.Menu onSelect={_handleOnSelect}>
        {menu &&
          menu.map((item: any, index: any) => (
            <Fragment key={`${item.label}-index`}>
              {item.show && (
                <Dropdown.Item
                  eventKey={item.eventKey !== undefined ? item.eventKey : index}
                >
                  <span
                    className="d-flex align-items-center size-12 py-2"
                    style={{ borderBottom: "1px solid #e3e3e3" }}
                  >
                    <item.Icon className="me-3" />
                    {item.label}
                  </span>
                </Dropdown.Item>
              )}
            </Fragment>
          ))}
      </Dropdown.Menu>
    </Popover>
  );
};
