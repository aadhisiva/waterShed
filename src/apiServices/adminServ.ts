import { Service } from "typedi";
import { AdminRepo } from "../apiRepository/AdminRepo";
import { generateEOfTTime, generateOTP, generateRandomString, generateUniqueId, saveMobileOtps } from "../utils/resuableCode";
import { RESPONSEMSG } from "../utils/statusCodes";
import { OtpServices } from "../sms/smsServceResusable";
import { loginData } from "../entities";
import jsonWebToken from "jsonwebtoken";

type ObjectParam = any;

@Service()
export class AdminServices {
    constructor(
        public adminRepo: AdminRepo,
        public otpServices: OtpServices
    ) { };

    async addUser(data) {
        const { Mobile, UserRole } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        // let checkMobile = await this.adminRepo.checkWithMobile(Mobile);
        // if(checkMobile) return {code: 422, message: "Already Registered"}
        data.UserId = 'WS' + generateUniqueId();
        return this.adminRepo.addUser(data);
    };

    async addSuperAdmin(data) {
        const { Mobile, UserRole } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        // let checkMobile = await this.adminRepo.checkWithMobile(Mobile);
        // if(checkMobile) return {code: 422, message: "Already Registered"}
        data.UserId = 'WS' + generateUniqueId();
        return this.adminRepo.addSuperAdmin(data);
    };

    async allUsersData(data) {
        return this.adminRepo.allUsersData(data);
    };

    async assigningData(data) {
        if(!data?.UserId) return {code: 400};
        return this.adminRepo.assigningData(data);
    };

    async sendOtp(data: loginData) {
        const { Mobile, UserRole } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        let version = await this.adminRepo.getVersionOfApp();
        data.WebOtp = generateOTP(4);
        data.WebToken = generateRandomString(40);
        data.WebVersion = version[0]?.WebVersion;
        data.WebTokenExpirationTime = generateEOfTTime();
        let savedRes: ObjectParam = await this.adminRepo.sendOtp(data);
        if (!savedRes?.code) {
            let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.WebOtp);
            await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.WebOtp);
            if (sendSingleSms.code !== 200){
                return { code: 422, message: RESPONSEMSG.OTP_FAILED };
            } 
            return { message: RESPONSEMSG.OTP, data: { Token: savedRes?.WebToken, UserId: savedRes?.UserId, Version: savedRes?.WebVersion, UserRole: savedRes?.UserRole } };
        };
        return savedRes;
    };

    async verifyOtp(data) {
        const { Mobile, UserRole, Otp } = data;
        if (!Mobile || !UserRole) return { code: 400 };
        let loginUser: ObjectParam = await this.adminRepo.fetchUser(data);
        if (loginUser?.WebOtp !== Otp) return { code: 422, message: RESPONSEMSG.VALIDATE_FAILED }
        return { message: RESPONSEMSG.VALIDATE, data: {} };
    };

    async getSchemes(data) {
        return await this.adminRepo.getSchemes(data);
    };

    async allDistricts(data) {
        return await this.adminRepo.allDistricts(data);
    };

    async districtWiseTaluk(data) {
        return await this.adminRepo.districtWiseTaluk(data);
    };

    async talukWiseHobli(data) {
        return await this.adminRepo.talukWiseHobli(data);
    };

    async subWaterSheadInHobli(data) {
        return await this.adminRepo.subWaterSheadInHobli(data);
    };

    async microWaterShedInSubWaterShed(data) {
        return await this.adminRepo.microWaterShedInSubWaterShed(data);
    };

    async schemeSelect(data) {
        return await this.adminRepo.schemeSelect(data);
    };

    async sectorInSchemes(data) {
        return await this.adminRepo.sectorInSchemes(data);
    };

    async activityInSector(data) {
        return await this.adminRepo.activityInSector(data);
    };

    async locations(data) {
        return await this.adminRepo.locations(data);
    };

    /* new modified apis */

    async departments(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addDepartment(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getDepartment(data);
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownDepart();
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    async addOrGetschemes(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addschemes(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getSchemesData();
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownSchemes();
        }else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    async addOrGetSectors(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addSectors(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getSectorsData();
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownSectors();
        }else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    async addOrGetsActivity(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addActivity(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getActivityData();
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownActivty();
        }else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    async addOrGetRoles(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addRoles(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getRolesData();
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    async superLogin(data){
        const { Username, Password, ReqType } = data;
        if(!Username) return {code:400, message: "Provide Username"};
        if(!Password) return {code:400, message: "Provide Password"};
        if(ReqType == "Get"){
            let check = await this.adminRepo.checkUsername(Username);
            if(!check) return {code: 422, message: "User not found."};
            let checkPassword = check.Password == Password;
            if(!checkPassword) return {code: 422, message: "Passord not matched."};
            const token = jsonWebToken.sign({ Username: check.Username, RoleId: check.Name, Mobile: check.Mobile }, 
                process.env.SECRET_KEY, { expiresIn: '1h' });
            return {message: "Successfully Verified.", data: {token, username: check.Username, Name: check.Name}};
        } else if(ReqType == "Add") {
            let check = await this.adminRepo.checkUsername(Username);
            if(check) return {code: 422, message: "Already Registered."};
            let savedValues = await this.adminRepo.addSuperAdminData(data);
            const token = jsonWebToken.sign({ Username: savedValues.Username, Name: savedValues.Name, Mobile: savedValues.Mobile }, 
                process.env.SECRET_KEY, { expiresIn: '1h' });
            return {message: "User Registered.", data: {token, username: savedValues.Username, Name: savedValues.Name, Mobile: savedValues.Mobile}};
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };
}