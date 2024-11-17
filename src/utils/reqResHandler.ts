import { Request, Response, NextFunction } from 'express';
import { MobileLog } from '../entities/mobile_logs';
import { AppDataSource } from '../db/config';
import Logger from '../loggers/winstonLogger';

export async function logRequestResponse(req: Request | any, res: Response, responseBody: any) {
  const logEntry = new MobileLog();
    logEntry.Endpoint = req.originalUrl;
    logEntry.RequestBody = JSON.stringify(req.body);
    logEntry.ResponseBody = JSON.stringify(responseBody);
    logEntry.Method = req.method;
    logEntry.UserId = req['user']?.UserId; 
    logEntry.Code = req.statusCode
    try {
    const mobileLogRepo = await AppDataSource.getRepository(MobileLog);
     return await mobileLogRepo.save(logEntry);
  } catch (error) {
      Logger.error('Error logging request/response:', error);
  }
};


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`'${req.originalUrl}' Internal server error ` + err);
  return res.status(500).json({
    code: 500,
    message: 'Something went wrong!',
    FMessage: err.message, // Log the error message to the console
    EName: err.name, // Log the error name to the console
    ApiPath: req.originalUrl,
    EStack: process.env.NODE_ENV === 'development' ? err.stack : {} // Provide stack trace only in development
  });
};

export const apiErrorHandler = (err: any, req: Request, res: Response,) => {
  Logger.error(`'${req.originalUrl}' Internal server error ` + err);
  return res.status(500).json({
    code: 500,
    message: 'Something went wrong!',
    FMessage: err.message, // Log the error message to the console
    EName: err.name, // Log the error name to the console
    ApiPath: req.originalUrl,
    EStack: process.env.NODE_ENV === 'development' ? err.stack : {} // Provide stack trace only in development
  });
};
