const BOX_TYPE_CONFIG: any = {
  1: {
    label: "Casillero Chico",
    color: "#39b364",
    layout: [{ top: 15, left: 0, size: 54, zIndex: 2, opacity: 1 }],
  },
  2: {
    label: "Casillero Mediano",
    color: "#39b3a1",
    layout: [
      { top: 14, left: 0, size: 54, zIndex: 1, opacity: 1 },
      { top: 25, left: 20, size: 54, zIndex: 2, opacity: 1 },
    ],
  },
  3: {
    label: "Casillero Grande",
    color: "#3988b3",
    layout: [
      { top: 19, left: 0, size: 54, zIndex: 1, opacity: 1 },
      { top: 30, left: 20, size: 54, zIndex: 2, opacity: 1 },
      { top: 0, left: 8, size: 54, zIndex: 3, opacity: 1 },
    ],
  },
};

const BoxIcon = ({
  size = 40,
  color = "#0067a6",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 4.75L31.6667 11.875V26.125L19 33.25L6.33334 26.125V11.875L19 4.75Z"
        fill={color}
        stroke="#00000070"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 19L31.6667 11.875"
        stroke="#00000070"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 19V33.25"
        stroke="#00000070"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 19L6.33334 11.875"
        stroke="#00000070"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const BoxComponent = ({ _handleOnclickBox, box }: any) => {
  const config = BOX_TYPE_CONFIG[box.box_type_id] || {
    label: box.name || "Caja",
    color: "#01a781",
    layout: [{ top: 28, left: 58, size: 40, zIndex: 2, opacity: 1 }],
  };

  return (
    <button
      type="button"
      className="my-2 d-flex align-items-center justify-content-start px-4 res-box-card"
      onClick={() => _handleOnclickBox(box)}
    >
      <div className="position-relative" style={{ minWidth: "100px", height: "94px" }}>
        {config.layout.map((icon: any, index: number) => (
          <div
            key={`${box.box_type_id}-${index}`}
            style={{
              position: "absolute",
              top: `${icon.top}px`,
              left: `${icon.left}px`,
              zIndex: icon.zIndex,
              opacity: icon.opacity,
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35))",
            }}
          >
            <BoxIcon color={config.color} size={icon.size} />
          </div>
        ))}
      </div>
      <div>
        <div className="res-box-card__title">{config.label}</div>
      </div>
    </button>
  );
};

export default BoxComponent;
