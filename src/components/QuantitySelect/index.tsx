import "./component.quantity.scss";

const QuantitySelect = (props: any) => {
  const { quantity, onAdd, onRemove } = props;
  return (
    <div className="component-quantity d-flex pb-2 px-1">
      <button className="component-quantity__actions size-15" onClick={onRemove}>
        -
      </button>
      <div className="component-quantity__input">{quantity}</div>
      <button className="component-quantity__actions size-13" onClick={onAdd}>
        +
      </button>
    </div>
  );
};

export default QuantitySelect;
