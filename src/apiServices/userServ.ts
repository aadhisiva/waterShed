import { Service } from "typedi";
import { UserRepo } from "../apiRepository/userRepo";
import { generateEOfTTime, generateOTP, generateRandomString, generateUniqueId, saveMobileLogs, saveMobileOtps } from "../utils/resuableCode";
import { RESPONSEMSG } from "../utils/statusCodes";
import { OtpServices } from "../sms/smsServceResusable";
import { loginData } from "../entities";

type ObjectParam = any;

@Service()
export class UserServices {
    constructor(
        public userRepo: UserRepo,
        public otpServices: OtpServices
    ) { };

    async saveLogin(data) {
        const { Mobile, UserRole } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        data.UserId = 'WS' + generateUniqueId();
        return this.userRepo.saveLogin(data);
    };

    async sendOtp(data: loginData) {
        const { Mobile, UserRole } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        let version = await this.userRepo.getVersionOfApp();
        data.Otp = generateOTP(4);
        data.Token = generateRandomString(40);
        data.Version = version[0].Version;
        data.TokenExpirationTime = generateEOfTTime();
        let savedRes: ObjectParam = await this.userRepo.sendOtp(data);
        if (!savedRes?.code) {
            let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.Otp);
            await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.Otp);
            if (sendSingleSms?.code !== 200){
                return { code: 422, message: RESPONSEMSG.OTP_FAILED };
            } 
            return { message: RESPONSEMSG.OTP, data: { Token: savedRes?.Token, UserId: savedRes?.UserId,  Version: savedRes?.Version, UserRole: savedRes?.UserRole } };
        };
        return savedRes;
    };

    async verifyOtp(data) {
        const { Mobile, UserRole, Otp } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        let loginUser: ObjectParam = await this.userRepo.fetchUser(data);
        if (loginUser?.Otp !== Otp) return { code: 422, message: RESPONSEMSG.VALIDATE_FAILED }
        return { message: RESPONSEMSG.VALIDATE, data: {} };
    };

    async locations(data) {
        return await this.userRepo.locations(data);
    };

    async saveActualData(data) {
        const { UserId } = data;
        if(!UserId) return { code : 400 };
        let getUserData: any = await this.userRepo.fetchUserById(UserId);
        data.UserRole = getUserData?.UserRole;
        data.CreatedBy = getUserData?.UserRole +' '+ getUserData?.Name;
        return await this.userRepo.saveActualData(data);
    };
}