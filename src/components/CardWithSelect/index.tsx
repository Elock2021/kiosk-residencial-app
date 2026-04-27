import Image from "../Image";
import boxImage from "../../assets/svg/box.svg";
import QuantitySelect from "../QuantitySelect";

const CardWithSelect = ({
  id,
  name,
  quantity,
  quantity_selected,
  width,
  height,
  onPlus,
  onSubtract,
  boxStyle = {},
}: any) => {
  return (
    <div
      className="p-2 col mx-2 my-3 res-card-select"
      style={{
        borderRadius: "14px",
        border: "1px solid var(--res-border, #ddd)",
        background: "var(--res-surface-elevated, #fff)",
        minWidth: "260px",
        maxWidth: "290px",
        ...boxStyle,
      }}
    >
      <div className="d-flex justify-content-between px-2 mt-2">
        <div>
          <div className="res-card-select__title" style={{ color: "var(--res-text, #222)", fontWeight: 600 }}>{name}</div>
          <div className="size-13 text-center bold color-main">
            {quantity} <span className="res-card-select__hint" style={{ color: "var(--res-muted, #909090)", fontSize: "0.8rem" }}>max</span>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Image src={boxImage} style={{ width: "36px" }} />
        </div>
      </div>
      <div className="d-flex justify-content-around bold mt-2 res-card-select__spec" style={{ color: "var(--res-muted, #909090)", fontSize: "0.8rem" }}>
        <div className="me-3">Ancho: {width / 100} cm</div>
        <div>Altura: {height / 100} cm</div>
      </div>
      <div className="row justify-content-center mt-3">
        <QuantitySelect
          quantity={quantity_selected}
          onAdd={() => onPlus(id)}
          onRemove={() => onSubtract(id)}
        />
      </div>
    </div>
  );
};

export default CardWithSelect;
