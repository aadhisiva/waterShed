import { Service } from "typedi";
import { generateEOfTTime, generateOTP, generateRandomString, generateUniqueId, generateUniqueSubmissionId, saveMobileLogs, saveMobileOtps } from "../utils/resuableCode";
import { RESPONSEMSG } from "../utils/statusCodes";
import { OtpServices } from "../sms/smsServceResusable";
import { AssignedMasters, loginData } from "../entities";
import { MobileRepo } from "../apiRepository/mobileRepo";
import jsonWebToken from "jsonwebtoken";

type ObjectParam = any;

@Service()
export class MobileServices {
    constructor(
        public mobileRepo: MobileRepo,
        public otpServices: OtpServices
    ) { };

    async saveLogin(data) {
        const { Mobile, RoleId } = data;
        if (!Mobile || !RoleId) return { code: 400, message: "Provide Mobile and RoleId" };
        data.UserId = 'WS' + generateUniqueId();
        return this.mobileRepo.saveLogin(data);
    };

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
        data.Otp = generateOTP(4);
        // data.Token = generateRandomString(40);
        data.Version = version[0].Version;
        // data.TokenExpirationTime = generateEOfTTime();
        let savedRes: ObjectParam = await this.mobileRepo.sendOtp(data);
        if (!savedRes?.code) {
            let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.Otp);
            await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.Otp);
            if (sendSingleSms?.code !== 200){
                return { code: 422, message: RESPONSEMSG.OTP_FAILED };
            } 
            const token = jsonWebToken.sign({ UserId: savedRes.UserId, Version: savedRes?.Version, RoleId: savedRes.RoleId }, 
                process.env.SECRET_KEY, { expiresIn: '1h' });
            return { message: RESPONSEMSG.OTP, data: { Token: token, UserId: savedRes.UserId, Version: savedRes?.Version, RoleId: savedRes.RoleId, Otp: data.Otp } };
        };
        return savedRes;
    };

    async verifyOtp(data) {
        const { Mobile, RoleId, Otp } = data;
        if (!Mobile || !RoleId) return { code: 400 };
        let loginUser: ObjectParam = await this.mobileRepo.fetchUser(data);
        if (loginUser?.Otp !== Otp) return { code: 422, message: RESPONSEMSG.VALIDATE_FAILED }
        return { message: RESPONSEMSG.VALIDATE, data: {} };
    };

    async locations(data) {
        return await this.mobileRepo.locations(data);
    };

    async saveActualData(data) {
        const { UserId } = data;
        if(!UserId) return { code : 400 };
        let getUserData: any = await this.mobileRepo.fetchUserById(UserId);
        data.UserRole = getUserData?.UserRole;
        data.CreatedBy = getUserData?.UserRole +' '+ getUserData?.Name;
        return await this.mobileRepo.saveActualData(data);
    };
    
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
        return await this.mobileRepo.getActivity(data);
    };

    async getQuestionsBasedOnActivity(data) {
        return await this.mobileRepo.getQuestionsBasedOnActivity(data);
    };

    async getPrivateLand(data) {
        const {FruitId, ActivityName, SurveyNo, OwnerName} = data;
        if(!FruitId) return {code: 400, message: "Provide FruitId or ActivityName or SurveyNo or OwnerName"}
        return await this.mobileRepo.getPrivateLand(data);
    };

    async getCommonLand(data) {
        const {ActivityName, SurveyNo, OwnerName} = data;
        if(!SurveyNo) return {code: 400, message: "Provide ActivityName or SurveyNo or OwnerName"}
        return await this.mobileRepo.getCommonLand(data);
    };

    async saveSurveyData(data){
       data.SubmissionId = await generateUniqueSubmissionId();
       let savedData = await this.mobileRepo.saveSurveyData(data);
       let imagesList = data.ImagesList;
       let error;
       for(let i=0; i < imagesList.length; i++){
           let eachList = imagesList[i];
           eachList['SubmissionId'] = savedData.SubmissionId;
           if (!eachList['SubmissionId']) return { code: 400, message: "Provide SubmissionId." };
           eachList['UserId'] = data.UserId;
           let saveImage = await this.mobileRepo.saveSurveyImages(eachList);
           if(saveImage?.code == 422){
               error = saveImage.message;
           };
       };
       if(error) return {code: 422, message: error};
       return savedData;
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

    async uploadImages(body){
        let savedData = await this.mobileRepo.uploadImages(body);
        let insertedId = savedData.id;

        // Construct video URL
        const imageUrl =  `${process.env.PRO_URL}/wapi/mobile/getImage/${insertedId}`;
        return { insertedId: insertedId, imageUrlUrl: imageUrl};
    }

    async getImage(id){
        let fetchData = await this.mobileRepo.getImage(id);
        if(!fetchData) return {code: 422, message: "Image not found"};
       return fetchData;
    }

    async uploadVideos(body){
        let savedData = await this.mobileRepo.uploadVideos(body);
        let insertedId = savedData.id;

        // Construct video URL
        const videoUrl =  `${process.env.PRO_URL}/wapi/mobile/getVideo/${insertedId}`;
        return { insertedId: insertedId, videoUrl: videoUrl};
    }

    async getVideo(id){
        let fetchData = await this.mobileRepo.getVideo(id);
        if(!fetchData) return {code: 422, message: "Video not found"};
       return fetchData;
    }
}