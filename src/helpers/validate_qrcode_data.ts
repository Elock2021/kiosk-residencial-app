import moment from "moment";
import MasterKeyService from "../services/masterkey.service";
import { validate } from "rut.js";

export const ValidateQRCodeDataEventsModule = async (
  data: string,
  terminal_id: number
) => {
  /**
   * TODO:
   * 1. CHECK MASTER KEY
   * 2. GET RUT BY DOCUMENT
   * 3. GET RUT BY TICKET
   */

  const dataReadFromDocument: any = data?.toLowerCase();
  const dataReadFromTicket: any = data?.toLowerCase();
  const dataReadFromMasterKeyQrCode: any = data?.toLowerCase();
  const dataReadFromElockQrCode: any = data?.toLowerCase();

  /**
   * 1. CHECK IF CONTAINS SOME DATA
   */

  if (!dataReadFromDocument) {
    return {
      isValid: false,
      message: "El código informado no es valido. ref:.ERR001",
      method: null,
    };
  }

  /**
   *  VALIDATE MASTER KEY
   */

  const masterKeyResponse = await validateMasterKey(
    dataReadFromMasterKeyQrCode,
    terminal_id
  );

  if (masterKeyResponse.isValid) {
    return masterKeyResponse;
  }

  console.log("masterKeyResponse", masterKeyResponse);

  /**
   *  VALIDATE RUT BY DOCUMENT
   */

  const rutByDocumentResponse = await validateRutByDocument(
    dataReadFromDocument
  );

  if (rutByDocumentResponse.isValid) {
    return rutByDocumentResponse;
  }

  console.log("rutByDocumentResponse", rutByDocumentResponse);

  /**
   *  VALIDATE RUT BY TICKET
   */

  const rutByTicketResponse = await validateRutByTicket(dataReadFromTicket);

  if (rutByTicketResponse.isValid) {
    return rutByTicketResponse;
  }

  console.log("rutByTicketResponse", rutByTicketResponse);

  /**
   *  VALIDATE QR ELOCK
   */

  const qrFromElock = await validateQRElock(
    dataReadFromElockQrCode,
    terminal_id
  );

  if (qrFromElock.isValid) {
    return qrFromElock;
  }

  console.log("qrFromElock", qrFromElock);

  return {
    isValid: false,
    message: "El código informado no es valido. ref:.ERR006",
    method: null,
  };
};

const validateMasterKey = async (data: string, terminal_id: number) => {
  const MasterKey = new MasterKeyService();
  try {
    const payload: any = {
      key: data,
      terminal_id: terminal_id,
      action: "SIGNIN_QR",
      description:
        "El usuario {USER} inicio sesion con un codigo QR en el locker {TERMINAL} al dia {DATETIME} con la key {MASTERKEY}",
      order_id: null,
    };
    await MasterKey.validateAndLogMasterkey(payload);

    return {
      isValid: true,
      message: "",
      method: "master_key",
      data: {
        master_key: {
          is_connected: true,
          code: data,
          created_at: moment.now(),
        },
      },
    };
  } catch (e: any) {
    return {
      isValid: false,
      message: "El código informado no es valido. ref:.ERR002",
      method: "master_key",
    };
  }
};

const validateRutByDocument = async (data: string) => {
  const urlSearchParamsMethod = data?.toLowerCase();
  const urlToDoubleSplitMethod = data?.toLowerCase();

  const search = urlSearchParamsMethod.split("?")[1];
  const urlSearchParams = new URLSearchParams(search);

  /* search params method */
  if (urlSearchParams.has("run")) {
    const run = urlSearchParams.get("run");
    if (!run) {
      return {
        isValid: false,
        message: "El código informado no es valido. ref:.ERR003a",
        method: "rut_by_document",
      };
    }

    const finalCode = run?.replace(/[^a-zA-Z0-9]/g, "");

    return {
      isValid: true,
      message: "",
      method: "rut_by_document",
      data: {
        rut: finalCode,
      },
    };
  }

  /* double split method */
  if (urlToDoubleSplitMethod.indexOf("docstatus_run¿") !== -1) {
    try {
      const first_split = urlToDoubleSplitMethod.split("docstatus_run¿");
      const last_split = first_split[1].split("/type");
      const rut = last_split[0]?.replace(/[^a-zA-Z0-9]/g, "");

      return {
        isValid: true,
        message: "El código informado no es valido. ref:.ERR003",
        method: "rut_by_document",
        data: {
          rut: rut,
        },
      };
    } catch (e) {
      return {
        isValid: false,
        message: "El código informado no es valido. ref:.ERR003b",
        method: "rut_by_document",
      };
    }
  }

  return {
    isValid: false,
    message: "El código informado no es valido. ref:.ERR003",
    method: "rut_by_document",
  };
};

const validateRutByTicket = async (data: string) => {
  return {
    isValid: false,
    message: "El código informado no es valido. ref:.ERR004",
    method: "rut_by_ticket",
  };
};

const validateQRElock = async (data: string, terminal_id: any) => {
  return {
    isValid: true,
    message: "El código informado no es valido. ref:.ERR005",
    method: "code_qr_elock",
    data: { code: data },
  };
};

export const validateDocumentData = async (data: string) => {
  const urlSearchParamsMethod = data?.toLowerCase();
  const urlToDoubleSplitMethod = data?.toLowerCase();

  const search = urlSearchParamsMethod.split("?")[1];
  const urlSearchParams = new URLSearchParams(search);

  /* search params method */
  if (urlSearchParams.has("run")) {
    const run = urlSearchParams.get("run");
    if (!run) {
      return {
        isValid: false,
        message: "El RUT informado no es valido. Intenta nuevamente.",
        method: "rut_by_document",
      };
    }

    const finalCode = run?.replace(/[^a-zA-Z0-9]/g, "");

    const is_valid = validate(finalCode);

    if (!is_valid) {
      return {
        isValid: false,
        message: "El RUT informado no es valido. Intenta nuevamente.",
        method: "rut_by_document",
      };
    }

    return {
      isValid: true,
      message: "",
      method: "rut_by_document",
      data: {
        rut: finalCode,
      },
    };
  }

  /* double split method */
  if (urlToDoubleSplitMethod.indexOf("docstatus_run¿") !== -1) {
    try {
      const first_split = urlToDoubleSplitMethod.split("docstatus_run¿");
      const last_split = first_split[1].split("/type");
      const rut = last_split[0]?.replace(/[^a-zA-Z0-9]/g, "");

      const is_valid = validate(rut);

      if (!is_valid) {
        return {
          isValid: false,
          message: "El RUT informado no es valido. Intenta nuevamente.",
          method: "rut_by_document",
        };
      }

      return {
        isValid: true,
        message: "El RUT informado no es valido. Intenta nuevamente.",
        method: "rut_by_document",
        data: {
          rut: rut,
        },
      };
    } catch (e) {
      return {
        isValid: false,
        message: "El RUT informado no es valido. Intenta nuevamente.",
        method: "rut_by_document",
      };
    }
  }

  return {
    isValid: false,
    message: "El RUT informado no es valido. Intenta nuevamente.",
    method: "rut_by_document",
  };
};
