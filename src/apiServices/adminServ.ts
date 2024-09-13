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

    async checkMobileLogin(data: loginData) {
        const { Mobile } = data;
        if (!Mobile) return { code: 400 };
        let version = await this.adminRepo.getVersionOfApp();
        // data.Otp = generateOTP(4);
        data.Otp = "1111";
        data.WebVersion = version[0]?.WebVersion;
        let checkRoles: ObjectParam = await this.adminRepo.checkMobileLogin(data);
        if (checkRoles['code'] == 422) return { code: 422, message: checkRoles['message'] };
            // let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.WebOtp);
            // await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.WebOtp);
            // if (sendSingleSms.code !== 200){
            //     return { code: 422, message: RESPONSEMSG.OTP_FAILED };
            // } 
            let resObj = {
                Mobile,
                Otp: data.Otp,
                Token: jsonWebToken.sign({ Mobile }, process.env.SECRET_KEY, { expiresIn: '24h' }),
                UserData: checkRoles
            }
            return resObj;
    };

    async getAccessById(data) {
        const { RoleId } = data;
        if (!RoleId) return { code: 400, message: "Provide Mobile" };
        return await this.adminRepo.checkRoleAccess(data);
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
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownRoles();
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    async addOrGetQuestions(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addQuestion(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getQuestionData();
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownQuestions();
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        };
    };

    async addOrGetQuestionDropDownTypes(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addQuestionDropDownTypes(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getQuestionDataDropDownTypes();
        } else if(ReqType == "Dd"){
            return await this.adminRepo.getDropdownDropDownTypes();
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        };
    };

    async mapQuestionOrUpdate(data){
        const { ReqType, MappedData } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addMapping(MappedData);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getMappedQuestion();
        } else if(ReqType == "Edit"){
            return await this.adminRepo.editMappedQuestion(data);
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        };
    };

    async addOrGetRoleAccess(data){
        const { ReqType } = data;
        if(ReqType == "Add") {
            return await this.adminRepo.addRoleAccess(data);
        } else if(ReqType == "Get"){
            return await this.adminRepo.getRolesDataAccess();
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    
    async assignChildAndGet(data) {
        const { RoleId, ReqType } = data;
        if (ReqType == "Get") {
            return await this.adminRepo.getChildAccess();
        } else if (ReqType == "Add") {
            if (!RoleId) return { code: 400, message: "Provide RoleId" };
            return await this.adminRepo.assignChildAccess(data);
        } else {
            return { code: 400, message: "Your request is not found", data: {} };
        }
    };

    async getChildBasedOnParent(data){
        return await this.adminRepo.getChildBasedOnParent(data);
    }

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

    async assignmentProcess(data){
        const { ReqType } = data;
        if(ReqType == 1){
            return await this.adminRepo.assignmentProcess(data);
        } else if(ReqType == 2) {
            return await this.adminRepo.assignToSurvey(data);
        }
    };
    
    async getMasterDropDown(data) {
        const { ReqType, UDCode, UTCode, UHCode,Mobile, loginType, Type } = data;
        if (!ReqType) return { code: 400, message: "Provide ReqType" };
        if (ReqType == 1) {
            if(loginType == "District"){
                return await this.adminRepo.getAuthDistrictDD(data);
            };
            return await this.adminRepo.getDistrictsDD(data);
        } else if (ReqType == 2) {
            if(loginType == "Taluk"){
                return await this.adminRepo.getAuthTalukDD(data);
            };
            if (!UDCode) return { code: 400, message: "Provide UDCode" };
            return await this.adminRepo.getTalukDD(UDCode);
        } else if (ReqType == 3) {
            if(loginType == "Hobli"){
                return await this.adminRepo.getAuthHobliDD(data);
            };
            if (!UDCode) return { code: 400, message: "Provide UDCode" };
            if (!UTCode) return { code: 400, message: "Provide UTCode" };
            return await this.adminRepo.getHobliDD(UDCode, UTCode);
        } else if (ReqType == 4) {
            if (!UDCode) return { code: 400, message: "Provide UDCode" };
            if (!UTCode) return { code: 400, message: "Provide UTCode" };
            if (!UHCode) return { code: 400, message: "Provide UHCode" };
            return await this.adminRepo.getVillagesDD(UDCode, UTCode, UHCode);
        } else {
            return { code: 400, message: "Your request is not found", data: {} };
        }
    };

    async getAssignedMasters(data) {
        const { ReqType, Mobile } = data;
        if (!ReqType) return { code: 400, message: "Provide ReqType" };
        if (!Mobile) return { code: 400, message: "Provide Mobile" };
        return await this.adminRepo.getAssignedData(data);
    };

    async uploadPrivateLand(data){
        return await this.adminRepo.uploadPrivateLand(data);
    }

    async uploadCommonLand(data){
        return await this.adminRepo.uploadCommonLand(data);
    }

    async getDprsLand(data){
        const {DataType} = data;
        if(DataType == "Private"){
            return await this.adminRepo.getDprsPrivateLand(data);
        } else if(DataType == "Common"){
            return await this.adminRepo.getDprsCommonLand(data);
        } else {
            return {code: 422, message: "Sending wrong request to server."};
        }
    };

    
    async uploadImages(data){
        let savedData = await this.adminRepo.uploadImages(data);
        let insertedId = savedData.id;

        // Construct video URL
        const imageUrl =  `${process.env.PRO_URL}/wapi/admin/getImage/${insertedId}`;
        return { insertedId: insertedId, imageUrl: imageUrl};
    }

    async getImage(id){
        let fetchData = await this.adminRepo.getImage(id);
        if(!fetchData) return {code: 422, message: "Image not found"};
       return fetchData;
    };
   
    async uploadDistrictMasters(data) {
        let chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await this.adminRepo.uploadDistrictMasters(chunk);
        }
        return { code: 200, message: "Uploaded Successfully.", data: {} }
    };
}