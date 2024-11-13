import { Equal } from "typeorm";
import { AppDataSource } from "../db/config";
import { MasterData, Roles, Schemes, Sectors, WaterShedData, WaterShedDataHistory, WatershedImgAndVideo } from "../entities";
import { apiErrorHandler, response200, response400 } from "../utils/resBack";

const rolesRepo = AppDataSource.getRepository(Roles);
const schemesRepo = AppDataSource.getRepository(Schemes);
const sectorsRepo = AppDataSource.getRepository(Sectors);
const masterDataRepo = AppDataSource.getRepository(MasterData);
const watershedImgAndVideoRepo = AppDataSource.getRepository(WatershedImgAndVideo);
const waterShedDataRepo = AppDataSource.getRepository(WaterShedData);
const waterShedDataHistoryRepo = AppDataSource.getRepository(WaterShedDataHistory);

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
