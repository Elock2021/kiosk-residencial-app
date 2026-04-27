/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Divider, Table, Tooltip, Whisper } from "rsuite";
import ParagraphIcon from "@rsuite/icons/Paragraph";
import MasterKeyAuth from "../../../components/MasterKeyAuth";
import DashboardTemplate from "../DashboardTemplate";
import { TableHeader } from "./table";
import { MoreMenu } from "../../../components/MoreMenu";
import MoreIcon from "@rsuite/icons/Gear";
import { _actionMenuSpeaker } from "./speakers";
import OrderDetails from "./OrderDetails";
import OrderService from "../../../services/order.service";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { _handleError } from "../../../helpers/errors";
import { set_loader } from "../../../redux/actions/loader";
import { _pushToastMessage } from "../../../helpers/messages";
import { set_session } from "../../../redux/actions/session";
import MasterKeyService from "../../../services/masterkey.service";
const DashboardOrders = () => {
  const [masterKeyModal, setMasterKeyModal] = useState(false);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const { session } = useSelector((state: any) => ({ session: state.session }));
  const dispatch: any = useDispatch();
  const Order = new OrderService();
  const [state, setState] = useState<any>({
    data: [],
    selectedOrder: {},
  });

  useEffect(() => {
    _getOrders();
  }, []);

  const _getOrders = async () => {
    try {
      dispatch(set_loader({ is_loading: true }));
      const response = await Order.validOrders(session?.profile?.id);
      setState({ ...state, data: response.data });
      dispatch(set_loader({ is_loading: false }));
    } catch (e: any) {
      dispatch(set_loader({ is_loading: false }));
      _handleError(e, e.message);
    }
  };

  const handleSelectChange = (payload: any) => {
    let order: any = null;
    switch (payload.option) {
      case 1:
        order = state.data.find((item: any) => item.id === payload.id);

        if (!session?.master_key?.is_connected) {
          setMasterKeyModal(true);
          setState({ ...state, selectedOrder: order || {} });
        }

        if (session?.master_key?.is_connected) {
          _handleCancelOrderWithMasterKey(order || {});
        }
        break;
      case 2:
        order = state.data.find((item: any) => item.id === payload.id);
        setState({ ...state, selectedOrder: order || {} });
        setOrderDetailsModal(true);
        break;
      default:
        console.log(payload);
    }
  };

  const _handleCancelOrder = async (payload: any) => {
    try {
      if (payload.status === "error") {
        throw new Error("Master key invalida.");
      }
      await Order.cancelOrder({ id: state.selectedOrder?.id });
      _pushToastMessage({
        header: "Éxito",
        type: "success",
        text: "Orden cancelada con éxito.",
      });
      setMasterKeyModal(false);

      session.profile?.boxes?.map((item: any) => {
        if (
          state.selectedOrder?.reservations[0]?.boxes.find(
            (box: any) => box.id === item.id
          )
        ) {
          item.valid_reservations = [];
        }
        return item;
      });

      dispatch(set_session({ ...session }));
      _getOrders();
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const _handleCancelOrderWithMasterKey = async (payload: any) => {
    try {
      const masterkey_payload: any = {
        key: session?.master_key?.code,
        terminal_id: session?.profile?.id,
        description:
          "El usuario {USER} canceló una orden con ID: #{ID_ORDER} en el locker {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}",
        action: "CANCEL_ORDER",
        order_id: payload?.id,
      };

      await new MasterKeyService().validateAndLogMasterkey(masterkey_payload);

      await Order.cancelOrder({ id: payload?.id });
      _pushToastMessage({
        header: "Éxito",
        type: "success",
        text: "Orden cancelada con éxito.",
      });
      setMasterKeyModal(false);

      session.profile?.boxes?.map((item: any) => {
        if (
          payload?.reservations[0]?.boxes.find((box: any) => box.id === item.id)
        ) {
          item.valid_reservations = [];
        }
        return item;
      });

      dispatch(set_session({ ...session }));
      _getOrders();
    } catch (e: any) {
      _handleError(e, e.message);
      dispatch(set_loader({ is_loading: false }));
    }
  };

  const Actions = (props: any) => {
    const { payload } = props;
    const _speaker: any = _actionMenuSpeaker(payload, handleSelectChange);
    return (
      <div className="row me-3">
        <div className="col-12">
          <button
            className="btn px-0"
            onClick={() => handleSelectChange({ option: 2, id: payload.id })}
          >
            <ParagraphIcon style={{ fontSize: "1.5rem" }} />
          </button>
          <Divider vertical />
          <span style={{ cursor: "pointer" }}>
            <Whisper
              controlId={payload.id}
              placement="auto"
              trigger="click"
              speaker={(whisper_payload: any, ref: any) =>
                MoreMenu(whisper_payload, ref, _speaker)
              }
            >
              <MoreIcon style={{ fontSize: "1rem" }} />
            </Whisper>
          </span>
        </div>
      </div>
    );
  };

  return (
    <DashboardTemplate>
      <MasterKeyAuth
        open={masterKeyModal}
        title="Informe su master key"
        handleClose={() => setMasterKeyModal(false)}
        handleConfirm={_handleCancelOrder}
        description="El usuario {USER} canceló una orden con ID: #{ID_ORDER} en el locker {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}"
        action="CANCEL_ORDER"
        order={state.selectedOrder}
      />

      <OrderDetails
        open={orderDetailsModal}
        size="md"
        handleClose={() => setOrderDetailsModal(false)}
        title="Orden"
        data={state.selectedOrder}
      />

      <div className="w-100 row px-4 py-2 mx-0 mb-4 justify-content-around">
        <div
          className="col-12 my-2 pb-2 size-12"
          style={{ borderBottom: "2px solid #afafaf", fontWeight: "bold" }}
        >
          Pedidos
        </div>
      </div>

      <div className="row background-color-white shadow-sm px-3 py-5 mx-3 mt-3 rounded">
        <div className="col-12 px-1 ">
          <Table
            data={state.data}
            rowClassName="striped"
            autoHeight
            rowHeight={80}
            locale={{ emptyMessage: "No hay pedidos en el locker" }}
          >
            {TableHeader &&
              TableHeader.map((column: any, index: any) => (
                <Table.Column
                  align={column.align}
                  flexGrow={column.flexGrow}
                  key={`table-column-${index}`}
                >
                  <Table.HeaderCell>
                    <span
                      className="bold"
                      style={{ textTransform: "capitalize" }}
                    >
                      {column.label}
                    </span>
                  </Table.HeaderCell>
                  <Table.Cell
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: column.alignFlex,
                    }}
                  >
                    {(rowData) => {
                      switch (column.key) {
                        case "name":
                          return (
                            <Whisper
                              trigger="hover"
                              placement="auto"
                              controlId={`control-id-auto`}
                              speaker={
                                <Tooltip>
                                  {rowData?.delivery_user?.name}
                                </Tooltip>
                              }
                            >
                              <div
                                style={{
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {rowData?.delivery_user?.name}
                              </div>
                            </Whisper>
                          );
                        case "quantity_box":
                          return (
                            <Whisper
                              trigger="hover"
                              placement="auto"
                              controlId={`control-id-auto`}
                              speaker={
                                <Tooltip>
                                  {rowData?.reservations[0]?.boxes?.length}
                                </Tooltip>
                              }
                            >
                              <div
                                style={{
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {rowData?.reservations[0]?.boxes?.length}
                              </div>
                            </Whisper>
                          );
                        default:
                          return (
                            <Whisper
                              trigger="hover"
                              placement="auto"
                              controlId={`control-id-auto`}
                              speaker={<Tooltip>{rowData[column.key]}</Tooltip>}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {rowData[column.key]}
                              </div>
                            </Whisper>
                          );
                      }
                    }}
                  </Table.Cell>
                </Table.Column>
              ))}

            <Table.Column align="right" flexGrow={1} verticalAlign="middle">
              <Table.HeaderCell>{""}</Table.HeaderCell>
              <Table.Cell>
                {(rowData) => {
                  return <Actions payload={rowData} />;
                }}
              </Table.Cell>
            </Table.Column>
          </Table>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default DashboardOrders;
