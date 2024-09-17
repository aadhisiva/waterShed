import { AppDataSource } from "../db/config";
import { DprsCommonLand, DprsPrivateLand, MobileLogs, OtpLogs, webLogs } from "../entities";
import cryptoJs from "crypto";
import Logger from "../loggers/winstonLogger";

// generate random string
export const generateRandomString = (RequiredLength) => {
  let newString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < RequiredLength; i++) {
    let randomCharacter = characters.charAt(Math.floor(Math.random() * charactersLength));
    newString += randomCharacter;
  }
  return newString;
};

export function generateOTP(length) {
  // Declare a digits variable 
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export function generateEOfTTime() {
  // generate time 
  const end = new Date();
  // end.setHours(23, 59, 59, 999);
  return end.toLocaleDateString();
};

export function generateCurrentTime() {
  // generate time 
  const current = new Date();
  return current.toLocaleDateString();
};

export function generateUniqueId() {
  // generate time 
  const [year, month, day] = new Date().toJSON().split('T')[0].split('-');
  return year + month + day + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds();
};

export const saveWebLogs = async (WebPage, Message, UserId, Request, Response, Role, ResponseType) => {
  // generate time
  let newBody = {
    WebPage,
    Message,
    UserId,
    Role,
    Request: JSON.stringify(Request),
    Response: JSON.stringify(Response),
    ResponseType
  }
  return await AppDataSource.getRepository(webLogs).save(newBody);
};
export const saveMobileLogs = async (logMessage, apiMessage, UserId, Request, Response, Role, ResponseType) => {
  // generate time
  let newBody = {
    logMessage,
    apiMessage,
    UserId,
    Role,
    Request: JSON.stringify(Request),
    Response: JSON.stringify(Response),
    ResponseType
  }
  return await AppDataSource.getRepository(MobileLogs).save(newBody);
};
export const getRoleAndUserId = (req, message) => {
  // create new Object
  let newBody = {
    userId: req.headers["userid"],
    role: req.headers["role"],
    logMessage: message
  }
  return newBody;;
};
export const saveMobileOtps = async (Mobile, text, response, UserId='', otp) => {
  // create new Object
  let newBody = {
    otp,
    Mobile,
    Message: text,
    Response: JSON.stringify(response),
    UserId
  }
  return await AppDataSource.getRepository(OtpLogs).save(newBody);
};


export const checkXlsxKeysExistOrNot= (data) => {
  let entityKeys = Object.keys(
    AppDataSource.getRepository(DprsPrivateLand).metadata.propertiesMap,
  ).filter(item => item !== "id" && item !== "CreatedDate" && item !== "UpdatedDate");
  let error = false;
  let message= "";
  entityKeys.map(key => {
    if(!data.hasOwnProperty(key)) {
      error = true;
      message = `${key} is missing in xlsx.`;
      return {error, message};
    };
  });
  return {error, message};
};
export const checkCommonXlsxKeysExistOrNot= (data) => {
  let entityKeys = Object.keys(
    AppDataSource.getRepository(DprsCommonLand).metadata.propertiesMap,
  ).filter(item => item !== "id" && item !== "CreatedDate" && item !== "UpdatedDate");
  let error = false;
  let message= "";
  entityKeys.map(key => {
    if(!data.hasOwnProperty(key)) {
      error = true;
      message = `${key} is missing in xlsx.`;
      return {error, message};
    };
  });
  return {error, message};
};

export const generateUniqueSubmissionId = async () => {
  let getData = await AppDataSource.query('select top 1 MAX(id) id from WatershedData');
  return !getData[0]?.id ? "WS0" : "WS"+getData[0]?.id;
};

// hashmac means its combination of (aadhar no, client code, sec key, etc...)
export const HashHMACHex = (hMACKey, InputValue) => {
  let hashHMACHex = '';

  const HashHMAC = (message, hmac) => {
      return hmac.update(message).digest();
  };
  const HashEncode = (hash) => {
      return Buffer.from(hash).toString('base64');
  };
  try {
      const keyByte = Buffer.from(hMACKey, 'ascii');
      const hmacsha256 = cryptoJs.createHmac('sha256', keyByte);
      const messageBytes = Buffer.from(InputValue, 'ascii');

      const hash = HashHMAC(messageBytes, hmacsha256);
      hashHMACHex = HashEncode(hash);
  } catch (ex) {
      Logger.error("Error Message: [" + ex.message.toString() + "]");
      return ex.message;
  }
  return hashHMACHex;
};


// convert kutumba decryptData readable formate
export const DecryptStringFromEncrypt = (key, IV, cipherText) => {
  const buffer = Buffer.from(cipherText, 'base64');
  const aes = cryptoJs.createDecipheriv('aes-256-cbc', key, IV);
  let decrypted = aes.update(buffer, null, 'utf8');
  decrypted += aes.final('utf8');
  return decrypted;
};