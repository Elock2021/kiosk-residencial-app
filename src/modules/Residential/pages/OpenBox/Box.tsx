import Image from "../../../../components/Image";
import casilleroChico from "../../assets/casillero_chico_ref_v2.png";
import casilleroMediano from "../../assets/casillero_mediano_ref_v2.png";
import casilleroGrande from "../../assets/casillero_grande_ref_v2.png";
import ejemploSobre from "../../assets/ejemplo_sobre.png";
import ejemploLlaves from "../../assets/ejemplo_llaves.png";
import ejemploDocumentos from "../../assets/ejemplo_documentos.png";
import ejemploBolso from "../../assets/ejemplo_bolso.png";
import ejemploZapatos from "../../assets/ejemplo_zapatos.png";
import ejemploCompras from "../../assets/ejemplo_compras.png";
import ejemploMochila from "../../assets/ejemplo_mochila.png";
import ejemploGrande from "../../assets/ejemplo_grande.png";
import ejemploMediano from "../../assets/ejemplo_mediano.png";

const BOX_TYPE_CONFIG: any = {
  1: {
    label: "Pequeño",
    description: "Ideal para objetos personales",
    image: casilleroChico,
    examples: [
      { label: "Sobres", image: ejemploSobre },
      { label: "Llaves", image: ejemploLlaves },
      { label: "Documentos", image: ejemploDocumentos },
    ],
  },
  2: {
    label: "Mediano",
    description: "Ideal para bolsos y cajas medianas",
    image: casilleroMediano,
    examples: [
      { label: "Bolso pequeño", image: ejemploBolso },
      { label: "Caja mediana", image: ejemploZapatos },
      { label: "Paquete mediano", image: ejemploGrande },
    ],
  },
  3: {
    label: "Grande",
    description: "Ideal para compras y paquetes grandes",
    image: casilleroGrande,
    examples: [
      { label: "Mochila", image: ejemploMochila },
      { label: "Compras", image: ejemploCompras },
      { label: "Caja grande", image: ejemploGrande },
    ],
  },
};

const BoxIcon = ({ boxTypeId }: { boxTypeId: number }) => {
  const bgClass =
    boxTypeId === 1 ? "res-size-card__icon--small" : boxTypeId === 2 ? "res-size-card__icon--medium" : "res-size-card__icon--large";

  return (
    <span className={`res-size-card__icon ${bgClass}`} aria-hidden="true">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path
          d="M8.8 2.6h6.4c.7 0 1.3.4 1.7 1l3.1 5.4c.1.3.2.5.2.8v7.6c0 1.1-.9 2-2 2H5.8c-1.1 0-2-.9-2-2V9.8c0-.3.1-.6.2-.8l3.1-5.4c.3-.6 1-1 1.7-1Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M3.8 9.6h16.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 9.6v9.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
};

const BoxComponent = ({ _handleOnclickBox, box }: any) => {
  const config = BOX_TYPE_CONFIG[box.box_type_id] || {
    label: box.name || "Casillero",
    description: "Selecciona un tamaño disponible",
    image: casilleroChico,
    examples: [],
  };

  const isAvailable = Number(box?.quantity || 0) > 0;
  const imageHeightByType: Record<number, string> = {
    1: "130px",
    2: "150px",
    3: "170px",
  };
  const imageHeight = imageHeightByType[box.box_type_id] || "170px";
  const sizeClassByType: Record<number, string> = {
    1: "res-size-card--small",
    2: "res-size-card--medium",
    3: "res-size-card--large",
  };
  const sizeClass = sizeClassByType[box.box_type_id] || "";

  const onSelect = () => {
    if (!isAvailable) {
      return;
    }
    _handleOnclickBox(box);
  };

  return (
    <div
      className={`res-size-card ${sizeClass} ${!isAvailable ? "res-size-card--disabled" : ""}`}
      role="button"
      tabIndex={isAvailable ? 0 : -1}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Seleccionar casillero ${config.label}`}
    >
      <div className="res-size-card__header">
        <div className="res-size-card__title-wrap">
          <BoxIcon boxTypeId={box.box_type_id} />
          <h3 className="res-size-card__title">{config.label}</h3>
        </div>
        <p className="res-size-card__subtitle">{config.description}</p>
      </div>

      <div className="res-size-card__image-wrap">
        <Image src={config.image} style={{ width: "100%", height: imageHeight, objectFit: "contain" }} />
      </div>

      <div className="res-size-card__examples">
        <div className="res-size-card__examples-title">Ejemplos que entran:</div>
        <div className="res-size-card__examples-grid">
          {config.examples.map((item: any) => (
            <div className="res-size-card__example" key={item.label}>
              <Image src={item.image} style={{ width: "48px", height: "48px", objectFit: "contain" }} />
              <div className="res-size-card__example-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="res-size-card__select-btn"
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        disabled={!isAvailable}
        aria-label={`Seleccionar tamaño ${config.label}`}
      >
        {isAvailable ? "Seleccionar" : "Sin cupo"}
      </button>
    </div>
  );
};

export default BoxComponent;
