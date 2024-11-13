import { Response } from "express";
import Logger from "../loggers/winstonLogger";

export const response400 = (res: Response, msg: string) => {
  return res.status(400).send({
    code: 400,
    status: "Bad Request",
    message: msg,
  });
};


export const response404 = (res: Response, msg: string) => {
  return res.status(404).send({
    code: 404,
    status: "Not Found",
    message: msg,
  });
};


export const response200 = (res: Response, data?: any, message?: string) => {
  return res.status(200).send({
    code: 200,
    status: "OK",
    message: "SUCCESS",
    data: data || {}
  });
};


export const response401 = (res: Response, msg?: any) => {
  return res.status(401).send({
    code: 401,
    status: "Unauthorized",
    message: msg
  });
};

export const response403 = (res: Response, msg?: any) => {
  return res.status(403).send({
    code: 403,
    status: "Forbidden",
    message: msg
  });
};



export const apiErrorHandler = (err, req, res) => {
  // Logger.error(`'${req.originalUrl}' Internal server error ` + err);
  return res.status(500).json({
    code: 500,
    message: 'Something went wrong!',
    FMessage: err.message, // Log the error message to the console
    EName: err.name, // Log the error name to the console
    ApiPath: req.originalUrl,
    EStack: process.env.NODE_ENV === 'development' ? err.stack : {} // Provide stack trace only in development
  });
};