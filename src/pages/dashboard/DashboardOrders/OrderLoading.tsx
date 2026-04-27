import PlaceholderParagraph from "rsuite/esm/Placeholder/PlaceholderParagraph";

const OrderLoading = (props: any) => {
  return (
    <div className="container-fluid">
      <div className="row">
        <PlaceholderParagraph rows={1} rowHeight={30} />
        <PlaceholderParagraph rows={4} />
      </div>
    </div>
  );
};
export default OrderLoading;
