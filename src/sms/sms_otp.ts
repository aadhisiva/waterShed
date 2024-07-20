import { Service } from "typedi";
import axios from "axios";
import cryptoJs from "crypto";
import Logger from "../loggers/winstonLogger";

// userName="XXXXXX"; //username of the department
// password="XXXXXX"; //password of the department
// senderId="XXXXXX"; //senderid of the deparment
// message="Your Normal message here "; //message content
// $messageUnicode="मोबाइलसेवामेंआपकास्वागतहै "; //message content in unicode
// mobileno="86XXXXXX72"; //if single sms need to be send use mobileno keyword
// mobileNos= "86XXXXXX72,79XXXXXX00"; //if bulk sms need to send use mobileNos as keyword and mobile number seperated by commas as value
// secureKey= "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"; //departsecure key for encryption of message...
// templateId="XXXXXXX";

// convert password to hash-sha1
function convertPasswordToSha1(userName) {
    let finalString = `${userName.trim()}`;
    try {
        let hash = cryptoJs.createHash('sha1').update(finalString).digest('hex');
        return hash;
    } catch (e) {
        console.error(e.message);
        return e.message;
    }
};
// convert message to hashing
function hashGenerator(userName, senderId, message, secureKey) {
    let finalString = `${userName.trim()}${senderId.trim()}${message.trim()}${secureKey.trim()}`;
    let digestHash = null;
    try {
        let hash = cryptoJs.createHash(process.env.HASHING512, secureKey);
        hash.update(finalString);
        digestHash = hash.digest("hex");
    } catch (e) {
        console.error(e.message);
        return e.message;
    }
    return digestHash;
};

// post data through axios service
async function post_url(url, data) {
    let urlData = await axios.post(url, data, { headers: { "Content-Type": "application/x-www-form-urlencoded" }, });
    return urlData;
};

// convert string to message
export function stringToFinalmessage(message) {
    return Array.from(message)
        .map((c: any) => `&#${c.charCodeAt(0)};`)
        .join('');
};

@Service()
export class SMSServices {

    // send sendSingleSMS to user
    async sendSingleSMS(userName, password, senderId, message, mobileno, secureKey, templateId) {
        try {
            let data = {
                username: userName.trim(),
                password: convertPasswordToSha1(password),
                senderid: senderId.trim(),
                content: message.trim(),
                smsservicetype: "singlemsg",
                mobileno: mobileno,
                key: hashGenerator(userName, senderId, message, secureKey),
                templateid: templateId.trim()
            };
            let response = await post_url(process.env.SMS_API, data); // calling post_to_url_unicode to send single sms
            let result = ((response.data?.includes("402" ) !== true) || (response.status !== 200) || (response?.statusText !== "OK"))? 422 : 200;
            return { code: result, response: response?.data };
        } catch (e) {
            Logger.error("error",e);
            return e.message;
        }
    }

    // send sendSingleUnicode to user
    async sendSingleUnicode(userName, password, senderId, messageUnicode, mobileno, secureKey, templateId) {
        try {
            let finalmessage = stringToFinalmessage(messageUnicode.trim());
            let key = hashGenerator(userName, senderId, finalmessage, secureKey);
            let data = {
                username: userName.trim(),
                password: convertPasswordToSha1(password),
                senderid: senderId.trim(),
                content: finalmessage.trim(),
                smsservicetype: "unicodemsg",
                mobileno: mobileno.trim(),
                key: key.trim(),
                templateid: templateId.trim()
            };
            let resposne = await post_url(process.env.SMS_API, data); // calling post_url to send single unicode sms
            return resposne.status;
        } catch (e) {
            Logger.error("error",e);
            return e;
        }
    };


};