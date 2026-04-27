const Input = (props: any) => {
  const { label, onChange, value } = props;

  return (
    <div
      className="w-100 d-flex my-2 res-kiosk-input-shell"
      style={{
        borderRadius: "14px",
        border: "1px solid var(--res-border, #ddd)",
        background: "var(--res-surface, #fff)",
        overflow: "hidden",
      }}
    >
      <div
        className="col-3 d-flex align-items-center ps-3 res-kiosk-input-label"
        style={{
          minHeight: "58px",
          color: "var(--res-muted, #666)",
          background: "var(--res-surface-elevated, #f2f2f2)",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div className="col-9 p-0 m-0">
        <input
          className="px-3 res-kiosk-input"
          style={{
            width: "100%",
            minHeight: "58px",
            border: "none",
            background: "var(--res-surface-contrast, #000)",
            color: "var(--res-text, #fff)",
            textTransform: "uppercase",
          }}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
};

export default Input;
