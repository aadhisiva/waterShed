import { Service } from "typedi";
import { generateUniqueId} from "../utils/resuableCode";
import { RESPONSEMSG } from "../utils/statusCodes";
import { OtpServices } from "../sms/smsServceResusable";
import { MobileRepo } from "../apiRepository/mobileRepo";
import jsonWebToken from "jsonwebtoken";

type ObjectParam = any;

@Service()
export class MobileServices {
    constructor(
        public mobileRepo: MobileRepo,
        public otpServices: OtpServices
    ) { };

    // async saveLogin(data) {
    //     const { Mobile, RoleId } = data;
    //     if (!Mobile || !RoleId) return { code: 400, message: "Provide Mobile and RoleId" };
    //     data.UserId = 'WS' + generateUniqueId();
    //     return this.mobileRepo.saveLogin(data);
    // };

    // async sendOtp(data) {
    //     const { Mobile, RoleId } = data;
    //     if (!Mobile || !RoleId) return { code: 400 };
    //     let version = await this.mobileRepo.getVersionOfApp();
    //     data.Otp = generateOTP(4);
    //     // data.Token = generateRandomString(40);
    //     data.Version = version[0].Version;
    //     // data.TokenExpirationTime = generateEOfTTime();
    //     let savedRes: ObjectParam = await this.mobileRepo.sendOtp(data);
    //     if (!savedRes?.code) {
    //         let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.Otp);
    //         await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.Otp);
    //         if (sendSingleSms?.code !== 200){
    //             return { code: 422, message: RESPONSEMSG.OTP_FAILED };
    //         } 
    //         const token = jsonWebToken.sign({ UserId: savedRes.UserId, Version: savedRes?.Version, RoleId: savedRes.RoleId }, 
    //             process.env.SECRET_KEY, { expiresIn: '1h' });
    //         return { message: RESPONSEMSG.OTP, data: { Token: token, UserId: savedRes.UserId, Version: savedRes?.Version, RoleId: savedRes.RoleId, Otp: data.Otp } };
    //     };
    //     return savedRes;
    // };

    async sendOtp(data) {
        const { Mobile, RoleId } = data;
        if (!Mobile || !RoleId) return { code: 400 };
        let version = await this.mobileRepo.getVersionOfApp();
        // data.Otp = generateOTP(4);
        data.Otp = "1111";
        data.Version = version[0].Version;
        let savedRes: ObjectParam = await this.mobileRepo.sendOtp(data);
        if (savedRes?.code) return savedRes;
        // let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.Otp);
        // await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.Otp);
        // if (sendSingleSms?.code !== 200){
        //     return { code: 422, message: RESPONSEMSG.OTP_FAILED };
        // }
        const options = {
            expiresIn: '12h', // Token expiration time
            algorithm: 'HS256', // Use a secure algorithm (HS256 is symmetric, RS256 is asymmetric)
        };
        let mappedRes = (savedRes || []).map(obj => {
            return {
                ...obj,
                Token: jsonWebToken.sign({ DistrictCode: obj.DistrictCode, TalukCode: obj?.TalukCode, RoleId: obj.RoleId, UserId: obj.UserId },
                    process.env.SECRET_KEY, options)
            }
        })
        return { message: RESPONSEMSG.OTP, data: {Otp: data?.Otp , mappedRes: mappedRes} };
    };

    async assignedHobliDetails(data) {
        const { DistrictCode, TalukCode, HobliCode } = data;
        if (!DistrictCode) return { code: 422, message: "Provide DistrictCode" };
        if (!TalukCode) return { code: 422, message: "Provide TalukCode" };
        if (!HobliCode) return { code: 422, message: "Provide HobliCode" };
        let result = await this.mobileRepo.assignedHobliDetails(data);
        return result;
    };

    async getWatershedOrSub(data) {
        const { DistrictCode, TalukCode, HobliCode, VillageName } = data;
        if (!DistrictCode) return { code: 422, message: "Provide DistrictCode" };
        if (!TalukCode) return { code: 422, message: "Provide TalukCode" };
        if (!HobliCode) return { code: 422, message: "Provide HobliCode" };
        if (!VillageName) return { code: 422, message: "Provide VillageName" };
        let result = await this.mobileRepo.getWatershedOrSub(data);
        let resultLength = result.length;
        for (let i = 0; i < resultLength; i++) {
            let eachIndex = result[i];
            eachIndex['MicroData'] = await this.mobileRepo.getMicroWatershedData({ ...data, ...eachIndex });
        }
        return result;
    };

    async verifyOtp(data) {
        const { Mobile, Otp, RoleId } = data;
        if (!Mobile || !RoleId) return { code: 400 };
        let loginUser = await this.mobileRepo.fetchUser(data);
        if(loginUser['code']) return {code: 404, message: "Access Denied"};
        if (loginUser['Otp'] !== Otp) return { code: 422, message: RESPONSEMSG.VALIDATE_FAILED }
        return { message: RESPONSEMSG.VALIDATE, data: {} };
    };

    // async locations(data) {
    //     return await this.mobileRepo.locations(data);
    // };

    async getAllSchemes(data) {
        return await this.mobileRepo.getAllSchemes(data);
    };

    async getAllRoles() {
        return await this.mobileRepo.getAllRoles();
    };

    async getSectors(data) {
        return await this.mobileRepo.getSectors(data);
    };

    async getActivity(data) {
        if(data.Type == "Category"){
            return await this.mobileRepo.getActivityBasedOnCategory(data.Id);
        } else {
            return await this.mobileRepo.getActivityBasedOnSector(data.Id);
        };
    };

    async getCategory(data) {
        return await this.mobileRepo.getCategory(data);
    };

    async getQuestionsBasedOnActivity(data) {
        return await this.mobileRepo.getQuestionsBasedOnActivity(data);
    };

    async getPrivateLand(data) {
        const { Village } = data;
        if (!Village) return { code: 400, message: "Provide Village" }
        return await this.mobileRepo.getPrivateLand(data);
    };

    async getCommonLand(data) {
        const { Village } = data;
        if (!Village) return { code: 400, message: "Provide Village" }
        return await this.mobileRepo.getCommonLand(data);
    };

    async saveSurveyData(data) {
        if(!data) return {code: 422, message: "You are not sending anything form request."}
        data.SubmissionId = "WS"+"-"+generateUniqueId().slice(2)+"-"+Math.floor(Math.random() * 1000);
        let savedData = await this.mobileRepo.saveSurveyData(data);
        let imagesList = data.imagesList;
        if(Array.isArray(imagesList)){
            let error;
            for (let i = 0; i < imagesList.length; i++) {
                let eachList = imagesList[i];
                eachList['SubmissionId'] = savedData.SubmissionId;
                if (!eachList['SubmissionId']) return { code: 400, message: "Provide SubmissionId." };
                eachList['UserId'] = data.UserId;
                eachList['StatusOfWork'] = data.StatusOfWork;
                let saveImage = await this.mobileRepo.saveSurveyImages(eachList);
                if (saveImage?.code == 422) {
                    error = saveImage.message;
                };
            };
            if (error) return { code: 422, message: error };
        }
        return savedData;
    };

    async getSubmissionList(data){
        if(!data?.UserId) return  { code: 400, message: "Provide UserId" };
        return await this.mobileRepo.getSubmissionList(data);
    }

    async getAllSubmissionList(data){
        if(!data?.UserId) return  { code: 400, message: "Provide UserId" };
        return await this.mobileRepo.getAllSubmissionList(data);
    }

    async getRecord(data){
        if(!data?.UserId) return  { code: 400, message: "Provide UserId" };
        if(!data?.SubmissionId) return  { code: 400, message: "Provide SubmissionId" };
        if(!data?.SectorId) return  { code: 400, message: "Provide SectorId" };
        return await this.mobileRepo.getRecord(data);
    }

    async updateSurveyData(data) {
        let updatedData = await this.mobileRepo.updateSurveyData(data);
        return updatedData;
    };


    async retriveMasters(data) {
        const { DistrictCode } = data;
        if (!DistrictCode) {
            let getData = await this.mobileRepo.retriveDistrictWithCodes();
            return getData;
        } else {
            let distict = await this.mobileRepo.retriveOnlyDistrict(DistrictCode);
            distict[0]['TalukArray'] = await this.mobileRepo.retriveOnlyTaluks(distict[0]?.DistrictCode);
            for (let i = 0; i < distict[0]['TalukArray'].length; i++) {
                let each = distict[0]['TalukArray'][i];
                each['HobliArray'] = await this.mobileRepo.retriveOnlyHobli(distict[0]?.DistrictCode, each.TalukCode);
                for (let j = 0; j < each['HobliArray'].length; j++) {
                    let eachHobliObj = each['HobliArray'][j];
                    eachHobliObj['VillageArray'] = await this.mobileRepo.retriveOnlyVillages(distict[0]?.DistrictCode, each.TalukCode, eachHobliObj.HobliCode);
                };
            };
            return distict;
        };
    };

    async uploadImages(body) {
        let savedData = await this.mobileRepo.uploadImages(body);
        let insertedId = savedData.id;

        // Construct video URL
        const imageUrl = `${process.env.PRO_URL}/wapi/mobile/getImage/${insertedId}`;
        return { insertedId: insertedId, imageUrlUrl: imageUrl };
    }

    async getImage(id) {
        let fetchData = await this.mobileRepo.getImage(id);
        if (!fetchData) return { code: 422, message: "Image not found" };
        return fetchData;
    }

    async uploadVideos(body) {
        let savedData = await this.mobileRepo.uploadVideos(body);
        let insertedId = savedData.id;

        // Construct video URL
        const videoUrl = `${process.env.PRO_URL}/wapi/mobile/getVideo/${insertedId}`;
        return { insertedId: insertedId, videoUrl: videoUrl };
    }

    async getVideo(id) {
        let fetchData = await this.mobileRepo.getVideo(id);
        if (!fetchData) return { code: 422, message: "Video not found" };
        return fetchData;
    }
}