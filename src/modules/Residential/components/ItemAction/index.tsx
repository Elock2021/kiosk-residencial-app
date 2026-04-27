const ItemAction = (props: any) => {
  const { label, Image, description, handleOnClick, disabled } = props;

  const _handleOnClick = () => {
    if (disabled) return;
    handleOnClick();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`mx-3 py-3 box-button shadow ${disabled ? "disabled" : ""}`}
      onClick={_handleOnClick}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          _handleOnClick();
        }
      }}
    >
      <div className="box-button__image">
        <div className={`box-button__image__content ${disabled ? "disabled" : ""}`}>
          <Image />
        </div>
      </div>
      <div className="box-button__label mt-3">
        {label}
        <hr className="my-2" />
        <div className="size-09 px-2 mt-3">{description}</div>
      </div>
    </div>
  );
};

export default ItemAction;
