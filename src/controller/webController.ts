import { Equal } from "typeorm";
import { AppDataSource } from "../db/config";
import { Departments, MasterData, Roles, Schemes, Sectors, WaterShedData, WaterShedDataHistory, WatershedImgAndVideo } from "../entities";
import { apiErrorHandler, response200, response400 } from "../utils/resBack";

const rolesRepo = AppDataSource.getRepository(Roles);
const schemesRepo = AppDataSource.getRepository(Schemes);
const departmentsRepo = AppDataSource.getRepository(Departments);
const sectorsRepo = AppDataSource.getRepository(Sectors);
const masterDataRepo = AppDataSource.getRepository(MasterData);
const watershedImgAndVideoRepo = AppDataSource.getRepository(WatershedImgAndVideo);
const waterShedDataRepo = AppDataSource.getRepository(WaterShedData);
const waterShedDataHistoryRepo = AppDataSource.getRepository(WaterShedDataHistory);

export const getRoleForReports = async (req, res) => {
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

export const getSubWatershed = async (req, res) => {
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

export const getSectorsBySchemeId = async (req, res) => {
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

export const fetchSearchReports = async (req, res) => {
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

export const fetchSearchReportsBySubId = async (req, res) => {
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

export const getRecordById = async (req, res) => {
  const bodyData = req.body;
  const { SubmissionId, id } = bodyData;
  try {
    let sp = `execute WebFetchRecordById @0,@1`;
    let result = await AppDataSource.query(sp, [id, SubmissionId]);
    return response200(res, result);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const fetchImagAndVideo = async (req, res) => {
  const bodyData = req.body;
  const { SubmissionId } = bodyData;
  try {
    let result = await await watershedImgAndVideoRepo.find({where:{SubmissionId: Equal(SubmissionId)}});
    return response200(res, result);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const updateStatusFromWeb = async (req, res) => {
  const bodyData = req.body;
  const { SubmissionId } = bodyData;
  try {
    let resultForOri = await waterShedDataRepo.findOneBy({ SubmissionId : Equal(SubmissionId) });
    let newData = { ...resultForOri, ...bodyData };
    let resultForHistory = await waterShedDataHistoryRepo.createQueryBuilder('ud')
    .where("ud.SubmissionId = :id", {id: SubmissionId})
    .orderBy("ud.CreatedDate", "DESC")
    .getOne();
    delete resultForHistory.id;
    delete resultForHistory.CreatedDate;
    delete resultForHistory.UpdatedDate;
    let newUpdatedDate = {...resultForHistory, ...bodyData};
    await waterShedDataHistoryRepo.save(newUpdatedDate);
    await waterShedDataRepo.save(newData);
    return response200(res, {});
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const fectImagAndVideo = async (req, res) => {
  const bodyData = req.body;
  const { SubmissionId, UserId } = bodyData;
  try {
    let result = await watershedImgAndVideoRepo.find({ where: { SubmissionId : Equal(SubmissionId), UserId: Equal(UserId) }});
    return response200(res, result);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};

export const getDepartments = async (req, res) => {
  try {
    let sp = `execute WebDepartmentsWithCount`;
    let result = await AppDataSource.query(sp);
    return response200(res, result);
  } catch (error) {
    return apiErrorHandler(error, req, res);
  };
};


// getRecordById