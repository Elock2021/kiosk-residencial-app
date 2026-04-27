import "./styles.scss";

interface IDrawer {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
const Drawer = ({ children, isOpen, onClose }: IDrawer) => {
  const _handleClose = ({ target }: any) => {
    const items = target.classList;
    items.forEach((item: any) => {
        console.log(item)
      if (item === "drawer-comp-exit") onClose();
    });
  };

  return (
    <div
      className={`drawer-comp drawer-comp-exit ${isOpen ? "drawer-comp-open" : "drawer-comp-close"}`}
      onClick={_handleClose}
    >
      {children}
    </div>
  );
};

export default Drawer;
