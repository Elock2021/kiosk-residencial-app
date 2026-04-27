import Image from "../Image";
import boxImage from "../../assets/svg/box.svg";

const Card = (props: any) => {
  const { name, quantity, width, height } = props;

  return (
    <div
      className="mx-2 p-3 res-info-card"
      style={{
        borderRadius: "14px",
        border: "1px solid var(--res-border, #ddd)",
        background: "var(--res-surface-elevated, #fff)",
        minWidth: "210px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <div className="size-08" style={{ color: "var(--res-text, #222)" }}>{name}</div>
          <div className="size-09 text-center bold color-main">{quantity}</div>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Image src={boxImage} style={{ width: "32px" }} />
        </div>
      </div>
      <div className="d-flex size-06 mt-2 res-info-card__meta" style={{ color: "var(--res-muted, #3e3e3e)" }}>
        <div className="me-3">Ancho: {width / 100} cm</div>
        <div>Altura: {height / 100} cm</div>
      </div>
    </div>
  );
};

export default Card;
