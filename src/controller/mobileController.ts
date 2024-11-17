import { Equal } from "typeorm";
import jsonwebtoken from "jsonwebtoken";

import { AppDataSource } from "../db/config";
import { response200, response400 } from "../utils/resBack";
import { generateOTP } from "../utils/resuableCode";
import { assignedMastersRepo, waterShedDataHistoryRepo, waterShedDataRepo, watershedImgAndVideoRepo } from "../db/repos";
import { MasterData } from "../entities/masterData";
import { apiErrorHandler } from "../utils/reqResHandler";

const options = {
  expiresIn: '12h', // Token expiration time
  algorithm: 'HS256', // Use a secure algorithm (HS256 is symmetric, RS256 is asymmetric)
};


export const updateRecordFromTalukLevel = async (req, res) => {
  const bodyData = req.body;
  const { SubmissionId, VerifiedMobile, VerifiedRole } = bodyData;
  if (!SubmissionId) return response400(res, "Missing 'SubmissionId' in req formate");
  if (!VerifiedMobile) return response400(res, "Missing 'VerifiedMobile' in req formate");
  if (!VerifiedRole) return response400(res, "Missing 'VerifiedRole' in req formate");
  try {
    let result = await waterShedDataRepo.findOneBy({ SubmissionId: Equal(SubmissionId) });
    let newData = { ...result, ...bodyData };
    await waterShedDataRepo.save(newData);
    let resultForHistory = await waterShedDataHistoryRepo.createQueryBuilder('ud')
      .where("ud.SubmissionId = :id", { id: SubmissionId })
      .orderBy("ud.CreatedDate", "DESC")
      .getOne();
    delete resultForHistory.id;
    delete resultForHistory.CreatedDate;
    delete resultForHistory.UpdatedDate;
    let newUpdatedDate = { ...resultForHistory, ...bodyData };
    await waterShedDataHistoryRepo.save(newUpdatedDate);
    return response200(res, {}, "Updated existing application");
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const addImagesToSubId = async (req, res) => {
  const bodyData = req.body;
  const { SubmissionId, UserId, imagesList, StatusOfWork } = bodyData;
  if (!SubmissionId) return response400(res, "Missing 'SubmissionId' in req formate");
  if (!UserId) return response400(res, "Missing 'UserId' in req formate");
  if (!StatusOfWork) return response400(res, "Missing 'StatusOfWork' in req formate");
  try {
    for (let i = 0; i < imagesList.length; i++) {
      let eachList = imagesList[i];
      eachList['SubmissionId'] = SubmissionId;
      if (!eachList['SubmissionId']) return { code: 400, message: "Provide SubmissionId." };
      eachList['UserId'] = UserId;
      eachList['StatusOfWork'] = StatusOfWork;
      await watershedImgAndVideoRepo.save(eachList);
    };
    return response200(res, {}, "New Images Added");
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};


export const loginToTaluk = async (req, res) => {
  const bodyData = req.body;
  const { RoleId, Mobile } = bodyData;
  if (!RoleId) return response400(res, "Missing 'RoleId' in req formate");
  if (!Mobile) return response400(res, "Missing 'Mobile' in req formate");
  bodyData.Otp = generateOTP(4);
  try {
    let fetchedUser = await assignedMastersRepo.findOneBy({ RoleId: Equal(RoleId), Mobile: Equal(Mobile) });
    let newData = { ...fetchedUser, ...bodyData };
    await assignedMastersRepo.save(newData);
    let fetchedWithRole = await assignedMastersRepo.createQueryBuilder('vs')
      .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=vs.DistrictCode and md.TalukCode=vs.TalukCode')
      .select([`DISTINCT vs.DistrictCode DistrictCode, vs.TalukCode TalukCode, vs.UserId UserId, 
    CONCAT('D-',md.DistrictName,'-T-',md.TalukName) as AssignedTaluk`
      ])
      .where("vs.Mobile = :Mobile and vs.RoleId = :RoleId", { Mobile: Mobile, RoleId: RoleId })
      .getRawMany();
    let result = (fetchedWithRole || []).map(obj => {
      return {
        ...obj,
        Token: jsonwebtoken.sign({ DistrictCode: obj.DistrictCode, TalukCode: obj?.TalukCode, RoleId: obj.RoleId, UserId: obj.UserId },
          process.env.SECRET_KEY, options)
      }
    })
    return response200(res, result);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const verfiyTalukOtp = async (req, res) => {
  const bodyData = req.body;
  const { RoleId, Mobile, Otp } = bodyData;
  if (!RoleId) return response400(res, "Missing 'RoleId' in req formate");
  if (!Mobile) return response400(res, "Missing 'Mobile' in req formate");
  if (!Otp) return response400(res, "Missing 'Otp' in req formate");
  try {
    let fetchedUser = await assignedMastersRepo.findOneBy({ RoleId: Equal(RoleId), Mobile: Equal(Mobile) });
    let otpCheck = fetchedUser.Otp == Otp;
    if (otpCheck) return response400(res, "Otp verfification failed");
    return response200(res, {}, "Otp verification successfully");
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const getTalukLevelSurvey = async (req, res) => {
  const bodyData = req.body;
  const { CategoryId, SubActivityId, SchemeId, SectorId, ActivityId, StatusOfWork, PageNo = 1, PageSize = 10 } = bodyData;
  if (!SchemeId) return response400(res, "Missing 'SchemeId' in req formate");
  if (!SectorId) return response400(res, "Missing 'SectorId' in req formate");
  try {
    let ActivityType = !SubActivityId || SubActivityId == '' ? "No" : "Yes";
    let sp = `execute MobileTalukLevelSurveyList @0,@1,@2,@3,@4,@5,@6,@7,@8`;
    let spForCounts = `execute MobileTalukLevelSurveyCounts @0,@1,@2,@3,@4,@5,@6`;
    let resultForData = await AppDataSource.query(sp, [SchemeId, SectorId, CategoryId, ActivityId, SubActivityId, StatusOfWork, ActivityType, PageNo, PageSize]);
    let resultForCounts = await AppDataSource.query(spForCounts, [SchemeId, SectorId, CategoryId, ActivityId, SubActivityId, StatusOfWork, ActivityType]);
    let result = {
      TotalCount: resultForCounts[0]?.TotalCount || 0,
      PageNo: PageNo,
      PageSize: PageSize,
      TotalData: resultForData || []
    };
    return response200(res, result, "Retireved successFully");
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};
