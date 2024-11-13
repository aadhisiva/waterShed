import { Service } from "typedi";
import { AdminRepo } from "../apiRepository/AdminRepo";
import { RESPONSEMSG } from "../utils/statusCodes";
import { OtpServices } from "../sms/smsServceResusable";
import { loginData } from "../entities";
import jsonWebToken from "jsonwebtoken";
import { encryptData } from "../utils/sensitiveData";
import crypto from "crypto";
import { apiErrorHandler, response200, response400 } from "../utils/resBack";

type ObjectParam = any;
const secretKey = crypto.randomBytes(32).toString('hex'); // Replace with a pre-shared secret key
@Service()
export class AdminServices {
    constructor(
        public adminRepo: AdminRepo,
        public otpServices: OtpServices
    ) { };

    async assigningData(data) {
        if (!data?.UserId) return { code: 400 };
        return this.adminRepo.assigningData(data);
    }

    async checkMobileLogin(data: loginData) {
        const { Mobile } = data;
        if (!Mobile) return { code: 400 };
        // let version = await this.adminRepo.getVersionOfApp();
        // data.Otp = generateOTP(4);
        data.Otp = "1111";

        let checkRoles: ObjectParam = await this.adminRepo.checkMobileLogin(data);
        if (checkRoles['code'] == 422) return { code: 422, message: checkRoles['message'] };
        // let sendSingleSms = await this.otpServices.sendOtpAsSingleSms(Mobile, data?.WebOtp);
        // await saveMobileOtps(Mobile, sendSingleSms?.otpMessage, sendSingleSms?.response, data?.UserId ,data?.WebOtp);
        // if (sendSingleSms.code !== 200){
        //     return { code: 422, message: RESPONSEMSG.OTP_FAILED };
        // } 
        // Options for the token
        // const options = {
        //     expiresIn: '12h', // Token expiration time
        //     algorithm: 'HS256', // Use a secure algorithm (HS256 is symmetric, RS256 is asymmetric)
        // };
        let resObj = {
            // Mobile,
            // Token: jsonWebToken.sign({ UserId: generateRandomString(20) }, process.env.SECRET_KEY, options),
            UserData: checkRoles
        };
        return encryptData(resObj, secretKey);
    };

    async getDataAccess(data) {
        const { Id } = data;
        data.Otp = "1111";
        data.Id = Id.slice(10,-10)
        if (!Id) return { code: 400, message: "Provide Id" };
        let userResponse = await this.adminRepo.findUserAndUpdate(data);
        if (userResponse['code']) return { code: 422, message: "You don't have access" };
        let accessResponse = await this.adminRepo.getDataAccess(data);
        if (accessResponse['code']) return { code: 422, message: "You don't have access" };
        let response = {
            UserId: userResponse['UserId'],
            access: accessResponse
        };
        return encryptData(response, secretKey);
    };

    async verifyOtp(data) {
        const { Id } = data;
        if (!Id) return { code: 400 };
        let loginUser = await this.adminRepo.fetchUser(data);
        if (loginUser['code']) return { code: 422, message: RESPONSEMSG.VALIDATE_FAILED };
        const options = {
            expiresIn: '12h', // Token expiration time
            algorithm: 'HS256', // Use a secure algorithm (HS256 is symmetric, RS256 is asymmetric)
        };
        let resObj = {
            Token: jsonWebToken.sign({ UserId: data.UserId }, process.env.SECRET_KEY, options)
        };
        return { message: RESPONSEMSG.VALIDATE, data: encryptData(resObj, secretKey) };
    };

    /* new modified apis */

    async departments(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addDepartment(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getDepartment(data);
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownDepart();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async addOrGetschemes(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addschemes(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getSchemesData();
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownSchemes();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async addOrGetSectors(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addSectors(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getSectorsData();
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownSectors();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async addOrGetsActivity(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addActivity(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getActivityData();
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownActivty();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async getActivityDetails(data){
        let result = await this.adminRepo.getActivityDetails(data);
        let checkType = result.TypeOfLand == "Both" ? [{value: "Common Land", name: "Common Land"}, {value: "Private Land", name: "Private Land"}]
        : result.TypeOfLand == "Private Land" ?  [{value: "Private Land", name: "Private Land"}]
        : result.TypeOfLand == "Common Land" ?  [{value: "Common Land", name: "Common Land"}]
        : [];
        return checkType;
    }

    async addOrGetsCategory(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addCategory(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getCategoryData();
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownCategory();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async addOrGetRoles(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            let encrypt = await this.adminRepo.addRoles(data);
            return encryptData(encrypt, secretKey);
        } else if (ReqType == "Get") {
            let encrypt = await this.adminRepo.getRolesData();
            return encryptData(encrypt, secretKey);
        } else if (ReqType == "Dd") {
            let encrypt = await this.adminRepo.getDropdownRoles();
            return encryptData(encrypt, secretKey);
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async addOrGetQuestions(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addQuestion(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getQuestionData();
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownQuestions();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        };
    };

    async addOrGetQuestionDropDownTypes(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addQuestionDropDownTypes(data);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getQuestionDataDropDownTypes();
        } else if (ReqType == "Dd") {
            return await this.adminRepo.getDropdownDropDownTypes();
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        };
    };

    async mapQuestionOrUpdate(data) {
        const { ReqType, MappedData } = data;
        if (ReqType == "Add") {
            return await this.adminRepo.addMapping(MappedData);
        } else if (ReqType == "Get") {
            return await this.adminRepo.getMappedQuestion();
        } else if (ReqType == "Edit") {
            return await this.adminRepo.editMappedQuestion(data);
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        };
    };

    async addOrGetRoleAccess(data) {
        const { ReqType } = data;
        if (ReqType == "Add") {
            let encrypt = await this.adminRepo.addRoleAccess(data);
            return encryptData(encrypt, secretKey);
        } else if (ReqType == "Get") {
            let encrypt = await this.adminRepo.getRolesDataAccess();
            return encryptData(encrypt, secretKey);
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };


    async assignChildAndGet(data) {
        const { RoleId, ReqType } = data;
        if (ReqType == "Get") {
            let encrypt = await this.adminRepo.getChildAccess();
            return encryptData(encrypt, secretKey);
        } else if (ReqType == "Add") {
            if (!RoleId) return { code: 400, message: "Provide RoleId" };
            let encrypt = await this.adminRepo.assignChildAccess(data);
            return encryptData(encrypt, secretKey);
        } else {
            return { code: 400, message: "Your request is not found", data: {} };
        }
    };

    async getChildBasedOnParent(data) {
        return await this.adminRepo.getChildBasedOnParent(data);
    }

    async superLogin(data) {
        const { Username, Password, ReqType } = data;
        if (!Username) return { code: 400, message: "Provide Username" };
        if (!Password) return { code: 400, message: "Provide Password" };
        if (ReqType == "Get") {
            let check = await this.adminRepo.checkUsername(Username);
            if (!check) return { code: 422, message: "User not found." };
            let checkPassword = check.Password == Password;
            if (!checkPassword) return { code: 422, message: "Passord not matched." };
            const token = jsonWebToken.sign({ Username: check.Username, RoleId: check.Name, Mobile: check.Mobile },
                process.env.SECRET_KEY, { expiresIn: '1h' });
            return { message: "Successfully Verified.", data: { token, username: check.Username, Name: check.Name } };
        } else if (ReqType == "Add") {
            let check = await this.adminRepo.checkUsername(Username);
            if (check) return { code: 422, message: "Already Registered." };
            let savedValues = await this.adminRepo.addSuperAdminData(data);
            const token = jsonWebToken.sign({ Username: savedValues.Username, Name: savedValues.Name, Mobile: savedValues.Mobile },
                process.env.SECRET_KEY, { expiresIn: '1h' });
            return { message: "User Registered.", data: { token, username: savedValues.Username, Name: savedValues.Name, Mobile: savedValues.Mobile } };
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };

    async assignmentProcess(data) {
        const { ReqType } = data;
        if (ReqType == 1) {
            return await this.adminRepo.assignmentProcess(data);
        } else if (ReqType == 2) {
            return await this.adminRepo.assignToSurvey(data);
        }
    };

    async getMasterDropDown(data) {
        const { ReqType, UDCode, UTCode, UHCode, Mobile, loginType, Type } = data;
        if (!ReqType) return { code: 400, message: "Provide ReqType" };
        if (ReqType == 1) {
            if (loginType == "District") {
                return await this.adminRepo.getAuthDistrictDD(data);
            };
            return await this.adminRepo.getDistrictsDD(data);
        } else if (ReqType == 2) {
            if (loginType == "Taluk") {
                return await this.adminRepo.getAuthTalukDD(data);
            };
            if (!UDCode) return { code: 400, message: "Provide UDCode" };
            return await this.adminRepo.getTalukDD(UDCode);
        } else if (ReqType == 3) {
            if (loginType == "Hobli") {
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

    async uploadPrivateLand(data) {
        return await this.adminRepo.uploadPrivateLand(data);
    }

    async uploadCommonLand(data) {
        return await this.adminRepo.uploadCommonLand(data);
    }

    async getDprsLand(data) {
        const { RowsPerPage, Page, DataType } = data;
        if (!RowsPerPage) return { code: 422, message: "Provide RowsPerPage" };
        if (!Page || Page <= 0) return { code: 422, message: "Provide Page" };
        if (DataType == "Private") {
            return await this.adminRepo.getDprsPrivateLand(data);
        } else if (DataType == "Common") {
            return await this.adminRepo.getDprsCommonLand(data);
        } else {
            return { code: 422, message: "Sending wrong request to server." };
        }
    };


    async uploadImages(data) {
        let savedData = await this.adminRepo.uploadImages(data);
        let insertedId = savedData.id;

        // Construct video URL
        const imageUrl = `${process.env.PRO_URL}/wapi/admin/getImage/${insertedId}`;
        return { insertedId: insertedId, imageUrl: imageUrl };
    }

    async getImage(id) {
        let fetchData = await this.adminRepo.getImage(id);
        if (!fetchData) return { code: 422, message: "Image not found" };
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
  