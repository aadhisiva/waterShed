export const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  LOOP_DETECTED: 508,
  UNPROCESSABLE_ENTITY: 422,
};

export const ResponseCode = {
  SUCCESS: "SUCCESS",
  UNPROCESS: "UNPROCESS",
  NOTFOUND: "NOTFOUND",
  EXCEPTION: "EXCEPTION",
  FAILED: "FAILED",
  VALIDATE: "VALIDATE"
};

export const HttpStatusMessages = {
  OK: "OK",
  CREATED: "Created",
  ACCEPTED: "Accepted",
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  SERVER_ERROR: "Internal Server Error",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  UNPROCESSABLE_ENTITY: "Unprocessable Content",
  LOOP_DETECTED: "Loop Detected",
  FAILED: "Failed",
  SUCCESS: "Success",
};

export const RESPONSE_EMPTY_DATA = {};
export enum RESPONSEMSG {
  INSERT_SUCCESS = "Data Saved.",
  UPDATE_SUCCESS = "Data Updated.",
  DELETE_SUCCESS = "Delete successful.",
  RETRIVE_SUCCESS = "Operation Successful",
  UNPROCESS = "Unprocessable Content",
  OTP = "Otp sent Successfully.",
  OTP_FAILED = "Otp sent Failed.",
  EXCEPTION = "Exception while processing",
  VALIDATE = "validation successfull",
  VALIDATE_FAILED = "validation Failed",
  MAIL_SENT = "Mail sent Successfully",
  MAIL_FAILED = "Mail sent Failed",
  VALIDATE_FIELDS = "Fields Not Provided.",
  ACCESS_DENIED = "Access Denied.."
}
export const ResponseMessages = (code, message = "", data = {}) => {
  const httpStatusCode = {
    SUCCESS: {
      code: HttpStatusCodes.OK,
      status: HttpStatusMessages.SUCCESS,
      message: message,
      data,
    },
    SERVER_ERROR: { code: HttpStatusCodes.INTERNAL_SERVER_ERROR, status: HttpStatusMessages.SERVICE_UNAVAILABLE, message, data },
    EXCEPTION: { code: HttpStatusCodes.BAD_REQUEST, status: HttpStatusMessages.BAD_REQUEST, message, data },
    INVALID: { status: "INVALID EMAIL ADDRESS", message, data },
    VALIDATE: {code: HttpStatusCodes.BAD_REQUEST, status: HttpStatusMessages.BAD_REQUEST, message, data },
    NOTFOUND: {code: HttpStatusCodes.NOT_FOUND, status: HttpStatusMessages.NOT_FOUND, message , data },
    UNPROCESS: {
      code: HttpStatusCodes.UNPROCESSABLE_ENTITY,
      status: HttpStatusMessages.FAILED,
      message,
      data,
    },
    AUTHENTICATION_FAIL: {
      code: 401,
      status: "Authetication Error",
      message,
      data,
    },
  };
  return httpStatusCode[code];
};
