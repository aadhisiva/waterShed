import { Equal } from "typeorm";
import jsonwebtoken from 'jsonwebtoken';
import crypto from "crypto";
import XLSX from "xlsx";
import fs from "fs";

import { AppDataSource } from "../db/config";
import { response200, response400, response404 } from "../utils/resBack";
import { activityRepo, assignedMastersRepo, assignMastersHistoryRepo, categoryRepo, childRoleRepo, departmentsRepo, dprsCommonLandRepo, dprsPrivateLandRepo, masterDataRepo, questionDropdownTypesRepo, questionMappingRepo, questionsRepo, roleAccessRepo, rolesRepo, schemesRepo, sectorsRepo, uploadImgAndVideoRepo, userDataRepo, waterShedDataHistoryRepo, waterShedDataRepo, watershedImgAndVideoRepo } from "../db/repos";
import { Service } from "typedi";
import { Roles } from "../entities/roles";
import { checkXlsxKeysExistOrNot, generateOTP } from "../utils/resuableCode";
import { apiErrorHandler } from "../utils/reqResHandler";
import { encryptData } from "../utils/sensitiveData";
import { RESPONSEAPI_MESSAGE } from "../utils/constants";
import { Departments } from "../entities/department";
import { Schemes } from "../entities/schemes";
import { Sectors } from "../entities/sectors";
import { Category } from "../entities/category";
import { Activity } from "../entities/activity";
import { AssignedMasters } from "../entities/assignedMasters";
import { Questions } from "../entities/questions";

interface ExcelData {
  [key: string]: string | number;
}

const options = {
  expiresIn: '12h', // Token expiration time
  algorithm: 'HS256', // Use a secure algorithm (HS256 is symmetric, RS256 is asymmetric)
};
const secretKey = crypto.randomBytes(32).toString('hex'); // Replace with a pre-shared secret key

@Service()
export class WebController {
  constructor() { };

  async checkMobileLogin(req, res) {
    const bodyData = req.body;
    const { Mobile } = bodyData;

    if (!Mobile) return response400(res, "Missing 'Mobile' in req formate");
    try {
      let fetchedUser = await assignedMastersRepo.createQueryBuilder('ud')
        .leftJoinAndSelect(Roles, 'lr', "lr.id = ud.RoleId")
        .select(["DISTINCT lr.RoleName", "lr.id as RoleId"])
        .where("ud.Mobile = :Mobile", { Mobile })
        .getRawMany();
      if (fetchedUser.length == 0) return response404(res, "User not found");
      // let fetchedRecord = await assignedMastersRepo.findOneBy({ Mobile: Equal(Mobile) });
      // let updateObj = { ...fetchedRecord, ...{ Otp: bodyData.Otp } }
      // await assignedMastersRepo.save(updateObj);
      let result = {
        UserData: fetchedUser
      };
      return response200(res, encryptData(result, secretKey));
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getDataAccess(req, res) {
    const bodyData = req.body;
    const { Mobile, Id } = bodyData;

    // bodyData.Otp = generateOTP(4);
    bodyData.Otp = "1111";
    bodyData.Id = Id.slice(10, -10)

    if (!Id) return response400(res, "Missing 'Id' in req formate");
    if (!Mobile) return response400(res, "Missing 'Mobile' in req formate");
    try {
      let fetchedUser = await assignedMastersRepo.findOneBy({ RoleId: Equal(bodyData.Id), Mobile: Equal(Mobile) });
      if (!fetchedUser) return response404(res, "User not found");
      let newData = { ...fetchedUser, ...{ Otp: bodyData?.Otp } }
      await assignedMastersRepo.save(newData);

      let fecthedRole = await roleAccessRepo.findOneBy({ RoleId: Equal(bodyData.Id) });
      if (!fecthedRole) return response404(res, "Role access not found");

      let result = {
        UserId: fetchedUser['UserId'],
        access: fecthedRole
      };
      return response200(res, encryptData(result, secretKey));
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async verifyOtp(req, res) {
    const bodyData = req.body;
    const { Id, Otp } = bodyData;

    if (!Id) return response400(res, "Missing 'Id' in req formate");
    if (!Otp) return response400(res, "Missing 'Otp' in req formate");
    try {
      let fetchedUser = await assignedMastersRepo.findOneBy({ UserId: Equal(Id) });
      if (!fetchedUser) return response404(res, "User not found");
      let checkOtp = fetchedUser.Otp === Otp;
      if (!checkOtp) return response400(res, "Otp verification failed");

      let result = {
        Token: jsonwebtoken.sign({ UserId: Id }, process.env.SECRET_KEY, options)
      };
      return response200(res, encryptData(result, secretKey));
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async departments(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await departmentsRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await departmentsRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await departmentsRepo.find();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await departmentsRepo.createQueryBuilder('dd')
          .select(["dd.id as value", "dd.DepartmentName as name"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetschemes(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await schemesRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await schemesRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await schemesRepo.createQueryBuilder('scheme')
          .leftJoinAndSelect(Departments, 'dp', "dp.id = scheme.DepartmentId")
          .leftJoinAndSelect(Schemes, 'sc', 'sc.id = scheme.ParentId')
          .leftJoinAndSelect(Roles, 'rl', 'rl.id = scheme.RoleId')
          .select(["scheme.id as id", "scheme.Description as Description", "rl.RoleName as RoleName", "scheme.RoleId as RoleId",
            "scheme.SchemeName as SchemeName", "scheme.SchemeLogo as SchemeLogo", "scheme.ParentId as ParentId", 'sc.SchemeName as ParentName',
            "dp.DepartmentName as DepartmentName", "scheme.DepartmentId as DepartmentId"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await schemesRepo.createQueryBuilder('sc')
          .leftJoinAndSelect(Departments, 'dp', 'dp.id = sc.DepartmentId')
          .select(["sc.id as value", "CONCAT(sc.SchemeName,'-D-',dp.DepartmentName ) as name"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetSectors(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await sectorsRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await sectorsRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await sectorsRepo.createQueryBuilder('sec')
          .leftJoinAndSelect(Departments, 'dp', "dp.id = sec.DepartmentId")
          .leftJoinAndSelect(Sectors, 'sc', 'sc.id = sec.ParentId')
          .leftJoinAndSelect(Sectors, 'sse', 'sse.id = sec.SectorId')
          .leftJoinAndSelect(Schemes, 'se', 'se.id = sec.SchemeId')
          .select(["sec.id as id", "sec.Description as Description", "se.SchemeName as SchemeName", "sec.SchemeId as SchemeId",
            "sec.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.ParentId as ParentId", 'sc.SectorName as ParentName',
            "dp.DepartmentName as DepartmentName", "sec.DepartmentId as DepartmentId", "sec.IsCategory as IsCategory",
            "sec.RecordType as RecordType", "sse.SectorName as SSectorName", "sec.SectorId as SectorId"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await sectorsRepo.createQueryBuilder('sc')
          .leftJoinAndSelect(Schemes, 'se', 'se.id = sc.SchemeId')
          .select(["sc.id as value", "CONCAT(sc.SectorName,'-SE-',se.SchemeName) as name"])
          .where("sc.RecordType = :RecordType", { RecordType: "New Sector" })
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetsActivity(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await activityRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await activityRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await activityRepo.createQueryBuilder('ac')
          .leftJoinAndSelect(Departments, 'dp', "dp.id = ac.DepartmentId")
          .leftJoinAndSelect(Activity, 'ac1', 'ac1.id = ac.ParentId')
          .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ac.SectorId')
          .leftJoinAndSelect(Category, 'ct', 'ct.id = ac.CategoryId')
          .select(["ac.id as id", "ac.ActivityName as ActivityName", "ac.ParentId as ParentId", "ac.SectorId as SectorId", "sec.SectorName as SectorName",
            'ac1.ActivityName as ParentName', "dp.DepartmentName as DepartmentName", "ac.DepartmentId as DepartmentId", "ac.TypeOfWork as TypeOfWork",
            "ac.TypeOfLand as TypeOfLand", "ac.TypeOfStatus as TypeOfStatus", "ct.id as CategoryId", "ct.CategoryName as CategoryName"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await activityRepo.createQueryBuilder('sc')
          .leftJoinAndSelect(Sectors, 'sec', 'sec.id = sc.SectorId')
          .select(["sc.id as value", "CONCAT(sc.ActivityName,'-SEC-',sec.SectorName) as name"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetsCategory(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await categoryRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await categoryRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await categoryRepo.createQueryBuilder('ca')
          .leftJoinAndSelect(Departments, 'dp', "dp.id = ca.DepartmentId")
          .leftJoinAndSelect(Category, 'ca1', 'ca1.id = ca.ParentId')
          .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ca.SectorId')
          .select(["ca.id as id", "ca.CategoryName as CategoryName", "ca.ParentId as ParentId", "sec.id as SectorId", "sec.SectorName as SectorName",
            'ca1.CategoryName as ParentName', "dp.DepartmentName as DepartmentName", "ca.DepartmentId as DepartmentId"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await categoryRepo.createQueryBuilder('ca')
          .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ca.SectorId')
          .select(["ca.id as value", "CONCAT(ca.CategoryName,'-SEC-',sec.SectorName) as name"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetRoles(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await rolesRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await rolesRepo.save(newData);
        return response200(res, encryptData({}, secretKey), RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await rolesRepo.createQueryBuilder('role')
          .leftJoinAndSelect(Departments, 'dp', "dp.id = role.DepartmentId")
          .select(["role.id as id", "role.RoleName as RoleName",
            "dp.DepartmentName as DepartmentName", "role.DepartmentId as DepartmentId", "role.IsMobile as IsMobile"])
          .getRawMany();
        return response200(res, encryptData(result, secretKey), RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await rolesRepo.createQueryBuilder('sc')
          .select(["sc.id as value", "sc.RoleName as name"])
          .getRawMany();
        return response200(res, encryptData(result, secretKey), RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetQuestions(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await rolesRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await rolesRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await questionsRepo.createQueryBuilder('qu')
          .select(["qu.id as id", "qu.Question as Question", "qu.QuestionId as QuestionId", "qu.QuestionType as QuestionType", "qu.IsMandatory as IsMandatory",
            "qu.DropDownValues as DropDownValues"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await questionsRepo.createQueryBuilder('sc')
          .select(["sc.id as value", "sc.Question as name"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async mapQuestionOrUpdate(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        await questionMappingRepo.save(bodyData)
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await questionMappingRepo.createQueryBuilder('qm')
        .leftJoinAndSelect(Activity, 'ac', "ac.id = qm.ActivityId")
        .leftJoinAndSelect(Questions, 'qu', "qu.id = qm.QuestionId")
        .select(["qm.id as id", "ac.ActivityName as ActivityName", "qu.Question as Question", "ac.id as ActivityId", "qu.id as QuestionId",
            "qu.QuestionType as QuestionType", "qm.TypeOfLand as TypeOfLand"])
        .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Edit") {
        let fetchedRecord = await questionMappingRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await questionMappingRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async addOrGetQuestionDropDownTypes(req, res) {
    const bodyData = req.body;
    const { ReqType, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        let fetchedRecord = await questionDropdownTypesRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await questionDropdownTypesRepo.save(newData);
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await questionDropdownTypesRepo.createQueryBuilder('qu')
          .select(["qu.id as id", "qu.DropdownName as DropdownName", "qu.DropdownType as DropdownType"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (ReqType == "Dd") {
        let result = await questionDropdownTypesRepo.createQueryBuilder('sc')
          .select(["DISTINCT sc.DropdownType as value", "sc.DropdownType as name"])
          .getRawMany();
        return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);

      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async assignChildAndGet(req, res) {
    const bodyData = req.body;
    const { ReqType, id, RoleId } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == "Add") {
        if (!RoleId) return response400(res, "Missing 'RoleId' in req formate");
        let fetchedRecord = await childRoleRepo.findOneBy({ id: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        await childRoleRepo.save(newData);
        return response200(res, encryptData({}, secretKey), RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == "Get") {
        let result = await childRoleRepo.createQueryBuilder('la')
          .leftJoinAndSelect(Roles, 'lr', 'lr.id=la.RoleId')
          .leftJoinAndSelect(Roles, 'lr1', 'lr1.id=la.ChildId')
          .select(["la.id id", "lr.RoleName RoleName", 'lr.id RoleId', "lr1.RoleName ChildName", "la.ChildId ChildId"])
          .getRawMany();
        return response200(res, encryptData(result, secretKey), RESPONSEAPI_MESSAGE.FETCHED);
      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getActivityDetails(req, res) {
    const bodyData = req.body;
    const { ActivityId } = bodyData;

    if (!ActivityId) return response400(res, "Missing 'ActivityId' in req formate");
    try {
      let fetchedRecord = await activityRepo.findOneBy({ id: Equal(ActivityId) });
      let result = fetchedRecord.TypeOfLand == "Both" ? [{ value: "Common Land", name: "Common Land" }, { value: "Private Land", name: "Private Land" }]
        : fetchedRecord.TypeOfLand == "Private Land" ? [{ value: "Private Land", name: "Private Land" }]
          : fetchedRecord.TypeOfLand == "Common Land" ? [{ value: "Common Land", name: "Common Land" }]
            : [];
      return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED)
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getChildBasedOnParent(req, res) {
    const bodyData = req.body;
    const { RoleId } = bodyData;

    if (!RoleId) return response400(res, "Missing 'RoleId' in req formate");
    try {
      let result = await childRoleRepo.createQueryBuilder('rl')
        .leftJoinAndSelect(Roles, 'lr', "lr.id = rl.ChildId")
        .select(["lr.id as value", "lr.RoleName as name"])
        .where("rl.RoleId = :RoleId", { RoleId: RoleId })
        .getRawMany();
      return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED)
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async assignmentProcess(req, res) {
    const bodyData = req.body;
    const { ReqType, UserId, id } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == 1) {
        let fetchedRecord = await assignedMastersRepo.findOneBy({ UserId: Equal(id) });
        let newData = { ...fetchedRecord, ...bodyData };
        let fecthedUser = await assignedMastersRepo.save(newData);
        delete fecthedUser.id;
        await assignMastersHistoryRepo.save({ ...fecthedUser, ...{ History: "New user Added" } });
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else if (ReqType == 2) {
        let fetchedRecord = await userDataRepo.findOneBy({ UserId: Equal(UserId) });
        let newData = { ...fetchedRecord, ...bodyData };
        let fecthedUser = await userDataRepo.save(newData);
        await assignMastersHistoryRepo.save({ ...fecthedUser, ...{ History: "Surveyer Added" } });
        return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getMasterDropDown(req, res) {
    const bodyData = req.body;
    const { ReqType, UDCode, UTCode, UHCode, Mobile, loginType, Type, ListType } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    try {
      if (ReqType == 1) {
        if (loginType == "District") {
          let result = await masterDataRepo.createQueryBuilder('dd')
            .innerJoinAndSelect(AssignedMasters, 'am', 'am.DistrictCode=dd.DistrictCode')
            .select(["DISTINCT dd.DistrictCode as value", "dd.DistrictName as name"])
            .where("am.Mobile = :Mobile and am.ListType = :ListType", { Mobile, ListType })
            .orderBy("DistrictName", "ASC")
            .getRawMany();
          return response200(res, result);
        };
        let fetchedData = await masterDataRepo.createQueryBuilder('dd')
          .select(["DISTINCT dd.DistrictCode as value", "dd.DistrictName as name"])
          .orderBy("DistrictName", "ASC")
          .getRawMany();
        return response200(res, fetchedData);
      } else if (ReqType == 2) {
        if (loginType == "Taluk") {
          let result = await masterDataRepo.createQueryBuilder('tt')
            .leftJoinAndSelect(AssignedMasters, 'am', 'am.TalukCode=tt.TalukCode and am.DistrictCode=tt.DistrictCode')
            .select(["DISTINCT tt.TalukCode as value", "tt.TalukName as name"])
            .where("am.Mobile = :Mobile and am.ListType = :ListType", { Mobile, ListType })
            .orderBy("TalukName", "ASC")
            .getRawMany();
          return response200(res, result);
        };
        if (!UDCode) return response400(res, "Missing 'UDCode' in req formate");
        let fetchedData = await masterDataRepo.createQueryBuilder('tt')
          .select(["DISTINCT tt.TalukCode as value", "tt.TalukName as name"])
          .where("tt.DistrictCode = :dc", { dc: UDCode })
          .orderBy("TalukName", "ASC")
          .getRawMany();
        return response200(res, fetchedData);
      } else if (ReqType == 3) {
        if (loginType == "Hobli") {
          let result = await masterDataRepo.createQueryBuilder('gd')
            .innerJoinAndSelect(AssignedMasters, 'am', 'am.TalukCode=gd.TalukCode and am.DistrictCode=gd.DistrictCode and am.HobliCode=gd.HobliCode')
            .select(["DISTINCT gd.HobliCode as value", "gd.HobliName as name"])
            .where("am.Mobile = :Mobile and am.ListType = :ListType", { Mobile, ListType })
            .orderBy("HobliName", "ASC")
            .getRawMany();
          return response200(res, result);
        };
        if (!UDCode) return { code: 400, message: "Provide UDCode" };
        if (!UTCode) return { code: 400, message: "Provide UTCode" };
        let result = await masterDataRepo.createQueryBuilder('gd')
          .select(["DISTINCT gd.HobliCode as value", "gd.HobliName as name"])
          .where("gd.TalukCode = :tc and gd.DistrictCode = :dc", { tc: UTCode, dc: UDCode })
          .orderBy("HobliName", "ASC")
          .getRawMany();
        return response200(res, result);
      } else if (ReqType == 4) {
        if (!UTCode) return response400(res, "Missing 'UTCode' in req formate");
        if (!UDCode) return response400(res, "Missing 'UDCode' in req formate");
        if (!UHCode) return response400(res, "Missing 'UHCode' in req formate");

        let result = await masterDataRepo.createQueryBuilder('vd')
          .select(["DISTINCT vd.VillageCode as value", "vd.VillageName as name"])
          .where("vd.HobliCode = :hc and vd.DistrictCode = :dc and vd.TalukCOde = :tc", { hc: UHCode, dc: UDCode, tc: UTCode })
          .getRawMany();
        return response200(res, result);
      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getAssignedMasters(req, res) {
    const bodyData = req.body;
    const { ReqType, Mobile, DataType } = bodyData;

    if (!ReqType) return response400(res, "Missing 'ReqType' in req formate");
    if (!Mobile) return response400(res, "Missing 'Mobile' in req formate");
    try {
      let sp = `execute assignedOfficersOrSurveyers @0,@1,@2`;
      let result = await AppDataSource.query(sp, [ReqType, Mobile, DataType]);
      return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getDprsLand(req, res) {
    const bodyData = req.body;
    const { RowsPerPage, Page, DataType } = bodyData;

    if (!RowsPerPage) return response400(res, "Missing 'RowsPerPage' in req formate");
    if (!Page) return response400(res, "Missing 'Page' in req formate");
    if (!DataType) return response400(res, "Missing 'DataType' in req formate");
    try {
      const offset = (Page - 1) * RowsPerPage;
      if (DataType == "Private") {
        const [totalData, total] = await dprsPrivateLandRepo.findAndCount({
          take: RowsPerPage,
          skip: offset,
          order: { id: "ASC" }
        });
        return response200(res, { total, totalData }, RESPONSEAPI_MESSAGE.FETCHED);
      } else if (DataType == "Common") {
        const [totalData, total] = await dprsCommonLandRepo.findAndCount({
          take: RowsPerPage,
          skip: offset,
          order: { id: "ASC" }
        });
        return response200(res, { total, totalData }, RESPONSEAPI_MESSAGE.FETCHED);
      } else {
        return response400(res, RESPONSEAPI_MESSAGE.CORRECT);
      }
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async uploadPrivateLand(req, res) {
    const file = req.file;

    // Read the file
    if (!file) return response400(res, "No file uploaded");
    // Use streams for handling large files
    const workbook = XLSX.readFile(file.path, { cellText: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    try {
      let findError = checkXlsxKeysExistOrNot(jsonData[0]);
      if (findError.error) {
        return res.send({ code: 422, message: findError.message, data: {} });
      };
      // Convert data to strings if needed
      const convertedData: Partial<ExcelData>[] = jsonData.map((row: any) => {
        const convertedRow: Partial<ExcelData> = {};
        Object.keys(row).forEach((key) => {
          convertedRow[key] = String(row[key]);
        });
        return convertedRow;
      });
      let chunkSize = 50;
      for (let i = 0; i < convertedData.length; i += chunkSize) {
        const chunk = convertedData.slice(i, i + chunkSize);
        await dprsPrivateLandRepo.save(chunk);
      }
      // Clean up the uploaded file
      fs.unlinkSync(file.path);
      return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async uploadCommonLand(req, res) {
    const file = req.file;

    // Read the file
    if (!file) return response400(res, "No file uploaded");
    // Use streams for handling large files
    const workbook = XLSX.readFile(file.path, { cellText: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
    try {
      let findError = checkXlsxKeysExistOrNot(jsonData[0]);
      if (findError.error) return response400(res, findError.message);
      // Convert data to strings if needed
      const convertedData: Partial<ExcelData>[] = jsonData.map((row: any) => {
        const convertedRow: Partial<ExcelData> = {};
        Object.keys(row).forEach((key) => {
          convertedRow[key] = String(row[key]);
        });
        return convertedRow;
      });
      let chunkSize = 50;
      for (let i = 0; i < convertedData.length; i += chunkSize) {
        const chunk = convertedData.slice(i, i + chunkSize);
        await dprsCommonLandRepo.save(chunk);
      }
      // Clean up the uploaded file
      fs.unlinkSync(file.path);
      return response200(res, {}, RESPONSEAPI_MESSAGE.INSERTED);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async uploadImages(req, res) {
    const bodyData = req.body;
    const { ImageName, ImageData, UserId } = bodyData;
    try {
      let savedData = await uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Image', UserId });
      let insertedId = savedData.id;
      // Construct video URL
      const imageUrl = `${process.env.PRO_URL}/wapi/admin/getImage/${insertedId}`;
      let result = { insertedId: insertedId, imageUrl: imageUrl };
      return response200(res, result, RESPONSEAPI_MESSAGE.FETCHED);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getImage(req, res) {
    const bodyData = req.body;
    const { id } = bodyData;
    if (!id) return response400(res, "Missing 'id' in req formate");

    try {
      let result = await uploadImgAndVideoRepo.findOneBy({ id: Equal(id) });
      if (!result) return response404(res, "Image not found");
        res.setHeader('Content-Disposition', `inline; filename="${result.ImageName}"`);
        res.setHeader('Content-Type', 'image/png');
        res.send(result.ImageData);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async uploadDistrictMasters(req, res) {
    const file = req.file;

    // Read the file
    if (!file) return response400(res, "No file uploaded");
    const workbook = XLSX.readFile(file.path, { cellText: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });

    try {
      const convertedData = jsonData.map((row) => {
        const convertedRow = {};
        Object.keys(row).forEach((key) => {
          convertedRow[key] = String(row[key]);
        });
        return convertedRow;
      });
      let chunkSize = 50;
      for (let i = 0; i < convertedData.length; i += chunkSize) {
        const chunk = convertedData.slice(i, i + chunkSize);
        await await masterDataRepo.save(chunk);
      }
      return response200(res, {}, RESPONSEAPI_MESSAGE.FETCHED);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };
  /* **************** search reports ****************** */
  async getRoleForReports(req, res) {
    const bodyData = req.body;
    const { DepartmentId } = bodyData;
    if (!DepartmentId) return response400(res, "Missing 'DepartmentId' in req formate");
    try {
      let sp = `execute WebSchemeWithCount @0`;
      let result = await AppDataSource.query(sp, [DepartmentId]);
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getSubWatershed(req, res) {
    const bodyData = req.body;
    const { DistrictCode, TalukCode, HobliCode } = bodyData;
    if (!DistrictCode) return response400(res, "Missing 'District' in req formate");
    if (!TalukCode) return response400(res, "Missing 'Taluk' in req formate");
    if (!HobliCode) return response400(res, "Missing 'Hobli' in req formate");
    try {
      let result = await masterDataRepo.createQueryBuilder('md')
        .select(['DISTINCT md.SubWatershedCode as value, md.SubWatershedName name'])
        .where("md.DistrictCode = :dcode and md.TalukCode = :tcode and md.HobliCode = :hcode",
          { dcode: DistrictCode, tcode: TalukCode, hcode: HobliCode })
        .getRawMany();
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getSectorsBySchemeId(req, res) {
    const bodyData = req.body;
    const { SchemeId } = bodyData;
    if (!SchemeId) return response400(res, "Missing 'Scheme' in req formate");
    try {
      let result = await sectorsRepo.createQueryBuilder('se')
        .select(['DISTINCT se.id as value, se.SectorName as name'])
        .where("se.SchemeId = :SchemeId",
          { SchemeId: SchemeId })
        .getRawMany();
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async fetchSearchReports(req, res) {
    const bodyData = req.body;
    const { DistrictCode = 'NULL', TalukCode = 'NULL', HobliCode = 'NULL', SubWatershed = 'NULL', Sector = 'NULL', Scheme = "NULL", PageNumber = 1, RowsPerPage = 10, SurveyStatus = 'NULL' } = bodyData;
    try {
      let spQueryForCounts = `execute WebFetchSearchCountsBasedOnInputs @0,@1,@2,@3,@4,@5`;
      let spQuery = `execute WebFetchSearchDataBasedOnInputs @0,@1,@2,@3,@4,@5,@6,@7`;
      let responseForCounts = await AppDataSource.query(spQueryForCounts, [DistrictCode, TalukCode, HobliCode, SubWatershed, Sector, Scheme, SurveyStatus]);
      let response = await AppDataSource.query(spQuery, [DistrictCode, TalukCode, HobliCode, SubWatershed, Sector, Scheme, SurveyStatus, PageNumber, RowsPerPage]);
      let result = {
        TotalCount: responseForCounts[0].TotalCount,
        Page: PageNumber,
        RowsPerPage: RowsPerPage,
        TotalData: response
      };
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async fetchSearchReportsBySubId(req, res) {
    const bodyData = req.body;
    const { SubmissionId, PageNumber = 1, RowsPerPage = 10 } = bodyData;
    try {
      let spQuery = `execute WebFetchSubIdWise @0,@1,@2`;
      let spQueryForCounts = `execute WebFetchSubIdWiseCounts @0`;
      let responseForCounts = await AppDataSource.query(spQueryForCounts, [SubmissionId]);
      let response = await AppDataSource.query(spQuery, [SubmissionId, PageNumber, RowsPerPage]);
      let result = {
        TotalCount: responseForCounts[0].TotalCount,
        Page: PageNumber,
        RowsPerPage: RowsPerPage,
        TotalData: response
      };
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getRecordById(req, res) {
    const bodyData = req.body;
    const { SubmissionId, id, ActivityId, ActivityType } = bodyData;
    if (!SubmissionId) return response400(res, "Missing 'SubmissionId' in req formate");
    if (!id) return response400(res, "Missing 'id' in req formate");
    if (!ActivityId) return response400(res, "Missing 'ActivityId' in req formate");
    try {
      let sp = `execute WebFetchRecordById @0,@1,@2,@3`;
      let result = await AppDataSource.query(sp, [id, SubmissionId, ActivityId, ActivityType]);
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async fetchImagAndVideo(req, res) {
    const bodyData = req.body;
    const { SubmissionId } = bodyData;
    try {
      let result = await await watershedImgAndVideoRepo.find({ where: { SubmissionId: Equal(SubmissionId) } });
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async updateStatusFromWeb(req, res) {
    const bodyData = req.body;
    const { SubmissionId } = bodyData;
    try {
      let resultForOri = await waterShedDataRepo.findOneBy({ SubmissionId: Equal(SubmissionId) });
      let newData = { ...resultForOri, ...bodyData };
      let resultForHistory = await waterShedDataHistoryRepo.createQueryBuilder('ud')
        .where("ud.SubmissionId = :id", { id: SubmissionId })
        .orderBy("ud.CreatedDate", "DESC")
        .getOne();
      delete resultForHistory.id;
      delete resultForHistory.CreatedDate;
      delete resultForHistory.UpdatedDate;
      let newUpdatedDate = { ...resultForHistory, ...bodyData };
      await waterShedDataHistoryRepo.save(newUpdatedDate);
      await waterShedDataRepo.save(newData);
      return response200(res, {});
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async fectImagAndVideo(req, res) {
    const bodyData = req.body;
    const { SubmissionId, UserId } = bodyData;
    try {
      let result = await watershedImgAndVideoRepo.find({ where: { SubmissionId: Equal(SubmissionId), UserId: Equal(UserId) } });
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

  async getDepartments(req, res) {
    try {
      let sp = `execute WebDepartmentsWithCount`;
      let result = await AppDataSource.query(sp);
      return response200(res, result);
    } catch (error) {
      return apiErrorHandler(error, req, res);
    };
  };

};