import Image from "../Image";
import errorIcon from "../../assets/svg/error-image.svg";

const CompanyCard = (props: any) => {
  const { onClick, name, logo, id, selected } = props;

  return (
    <div
      className={`col mx-2 px-3 pb-2 pt-3 my-2 shadow d-flex flex-column justify-content-between res-company-card ${
        selected ? "res-company-card--selected" : ""
      }`}
      style={{
        borderRadius: "14px",
        minWidth: "130px",
        maxWidth: "146px",
        minHeight: "172px",
        border: selected
          ? "2px solid var(--res-accent, #ffd619)"
          : "1px solid var(--res-border, #d9dce1)",
        background: "var(--res-surface-elevated, #fff)",
        cursor: "pointer",
      }}
      onClick={() => onClick(id)}
    >
      <div className="d-flex justify-content-center align-items-center size-09">
        <div className="res-company-card__name" style={{ color: selected ? "var(--res-text, #000)" : "var(--res-muted, #757575)", fontWeight: 700, textAlign: "center" }}>{name}</div>
      </div>
      <div className="d-flex justify-content-center align-items-center my-2">
        <Image
          src={logo || errorIcon}
          className="res-company-card__logo"
          style={{ maxHeight: "72px", width: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default CompanyCard;
