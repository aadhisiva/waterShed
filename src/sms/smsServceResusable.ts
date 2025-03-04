import { sendSingleSMS } from "./sms_otp";


    export const sendOtpAsSingleSms = async (mobile_no, otp) => {
        let text = `Your OTP is ${otp}.Directorate of EDCS.`;
        let sendSingleSms = await sendSingleSMS(
            process.env.SMS_USERNAME,
            process.env.SMS_PASSWORD,
            process.env.SMS_SENDER_ID,
            text,
            mobile_no,
            process.env.SMS_API_SERVICE_KEY,
            process.env.TEMPLATE_ID
        );
        return {...sendSingleSms, ...{otpMessage: text}};
    };

    // async sendSmsInKannadaUnicode(mobile_no, otp) {
    //     let text = `ಅಪ್ಲಿಕೇಶನ್ ಲಾಗಿನ್ ಒಟಿಪಿ ${otp}.
    //     -NHM, Gok`;
    //     let sendSingleSms = await this.smsServices.sendSingleUnicode(
    //         process.env.SMS_USERNAME,
    //         process.env.SMS_PASSWORD,
    //         process.env.SMS_SENDER_ID,  
    //         text,
    //         mobile_no,
    //         process.env.SMS_API_SERVICE_KEY,
    //         process.env.TEMPLATE_ID_KANNADA
    //     );
    //     return sendSingleSms;
    // }