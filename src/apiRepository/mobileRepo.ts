import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { Activity, AssignedMasters, DprsCommonLand, DprsPrivateLand, loginData, MasterData, QuestionDropdownTypes, QuestionMapping, Questions, Roles, RolesAccess, Schemes, Sectors, UploadImgAndVideo, Versions, WaterShedData, WatershedImgAndVideo } from '../entities';
import { Brackets, Equal, ILike } from 'typeorm';


const loginDataRepo = AppDataSource.getRepository(loginData);
const mastersRepo = AppDataSource.getRepository(MasterData);
const schemesRepo = AppDataSource.getRepository(Schemes);
const sectorsRepo = AppDataSource.getRepository(Sectors);
const activityRepo = AppDataSource.getRepository(Activity);
const rolesAccessRepo = AppDataSource.getRepository(RolesAccess);
const rolesRepo = AppDataSource.getRepository(Roles);
const uploadImgAndVideoRepo = AppDataSource.getRepository(UploadImgAndVideo);
const dprsPrivateLandRepo = AppDataSource.getRepository(DprsPrivateLand);
const dprsCommonLandRepo = AppDataSource.getRepository(DprsCommonLand);
const questionMappingRepo = AppDataSource.getRepository(QuestionMapping);
const questionDropdownTypesRepo = AppDataSource.getRepository(QuestionDropdownTypes);
const waterShedDataRepo = AppDataSource.getRepository(WaterShedData);
const masterDataRepo = AppDataSource.getRepository(MasterData);
const assignedMastersRepo = AppDataSource.getRepository(AssignedMasters);
const watershedImgAndVideoRepo = AppDataSource.getRepository(WatershedImgAndVideo);
@Service()
export class MobileRepo {

    async saveLogin(data: loginData) {
        return await loginDataRepo.save(data);
    };

    async getVersionOfApp() {
        return await AppDataSource.getRepository(Versions).find();
    };

    // async sendOtp(data: loginData) {
    //     const { Mobile, RoleId } = data;
    //     let loginDb = await AppDataSource.getRepository(loginData);
    //     let findData = await loginDb.findOneBy({ Mobile, RoleId });
    //     if (!findData) return { code: 404 };
    //     let newData = { ...findData, ...data };
    //     return await loginDb.save(newData);
    // };

    async sendOtp(data) {
        const { Mobile, RoleId } = data;
        let findData = await assignedMastersRepo.findOneBy({ Mobile, RoleId });
        if (!findData) return { code: 404 };
        let newData = { ...findData, ...data };
        return await assignedMastersRepo.save(newData);
    };

    async fetchUser(data: loginData) {
        const { Mobile, UserRole } = data;
        let findData = await AppDataSource.getRepository(loginData).findOneBy({ Mobile, UserRole });
        if (!findData) return { code: 404 };
        return findData;
    };

    async fetchUserById(UserId) {
        let findData = await AppDataSource.getRepository(loginData).findOneBy({ UserId });
        if (!findData) return { code: 404 };
        return findData;
    };


    async locations(data) {
        const { UserId, Mobile, UserRole } = data;
        let findAll = await loginDataRepo.findBy({ Mobile, UserRole });
        let newArray = [];
        if (UserRole == 'AO') {
            let totalLength = findAll.length;
            for (let i = 0; i < totalLength; i++) {
                let newObject = {};
                let eachIndex = findAll[i];
                if (!eachIndex.DistrictName) break;
                newObject['District'] = eachIndex.DistrictName;
                newObject['Taluk'] = eachIndex.TalukName;
                if (!eachIndex.HobliName) break;
                newObject['Hobli'] = eachIndex.HobliName;
                newObject['villages'] = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.KGISVillageName as village'])
                    .where("master.HobliName = :dCode", { dCode: eachIndex.HobliName })
                    .getRawMany();
                newObject['subWaterShead'] = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.SubWatershedName as subWaterShead'])
                    .where("master.HobliName = :dCode", { dCode: eachIndex.HobliName })
                    .orderBy('master.SubWatershedName', 'ASC').getRawMany();
                newArray.push(newObject);
            }

            return newArray;
        } else {
            let totalLength = findAll.length;
            for (let i = 0; i < totalLength; i++) {
                let newObject = {};
                let eachIndex = findAll[i];
                newObject['District'] = eachIndex.DistrictName;
                newObject['Taluk'] = eachIndex.TalukName;
                newObject['villages'] = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.KGISVillageName as village'])
                    .where("master.TalukName = :dCode", { dCode: eachIndex.TalukName })
                    .orderBy('master.KGISVillageName', 'ASC').getRawMany();
                newObject['subWaterShead'] = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.SubWatershedName as subWaterShead'])
                    .where("master.TalukName = :dCode", { dCode: eachIndex.TalukName })
                    .orderBy('master.SubWatershedName', 'ASC').getRawMany();
                newArray.push(newObject);
            }
            return newArray;
        }
    };

    async saveActualData(data) {
        let savingData = await "waterShedRepo";
        return savingData;
    }

    async getAllSchemes(data) {
        let savingData = await schemesRepo.createQueryBuilder('scheme')
            .select(["scheme.SchemeName as SchemeName", "scheme.SchemeLogo as SchemeLogo", "scheme.id as SchemeId"])
            .where("scheme.RoleId = :RoleId", { RoleId: data?.RoleId })
            .getRawMany();
        return savingData;
    };

    async getAllRoles() {
        let savingData = await rolesRepo.createQueryBuilder('role')
            .select(["role.RoleName as RoleName", "role.id as RoleId"])
            .getRawMany();
        return savingData;
    };

    async getSectors(data) {
        let savingData = await sectorsRepo.createQueryBuilder('sec')
            .select(["sec.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.id as SectorId"])
            .where("sec.SchemeId = :SchemeId", { SchemeId: data?.SchemeId })
            .getRawMany();
        return savingData;
    };

    async getActivity(data) {
        let newArray = [];
        let activityData = await activityRepo.createQueryBuilder('ac')
            .select(["ac.ActivityName as ActivityName", "ac.id as ActivityId"])
            .where("ac.SectorId = :SectorId and ac.ParentId = :ParentId", { SectorId: data?.SectorId, ParentId: '-1' })
            .getRawMany();
        let activityDataLength = activityData.length;
        for (let i = 0; i < activityDataLength; i++) {
            let eachActitivy = activityData[i];
            eachActitivy['SubActivity'] = await activityRepo.createQueryBuilder('ac')
                .select(["ac.ActivityName as ActivityName", "ac.id as SubActivityId"])
                .where("ac.ParentId = :ParentId", { ParentId: eachActitivy.ParentId })
                .getRawMany();
            newArray.push(eachActitivy);
        }
        return newArray;
    };

    async getQuestionsBasedOnActivity(data) {
        const { ActivityId } = data;
        let questionsJson = await questionMappingRepo.createQueryBuilder('qm')
            .leftJoinAndSelect(Questions, 'qu', "qu.id = qm.QuestionId")
            .select(["qu.QuestionId as QuestionId", "qu.Question as Question", "qu.QuestionType as QuestionType", "qu.DropDownValues as DropDownValues"])
            .where("qm.ActivityId = :ActivityId", { ActivityId: ActivityId })
            .getRawMany();
        let questionsJsonLength = questionsJson.length;
        const newArray = [];
        for (let i = 0; i < questionsJsonLength; i++) {
            let eachCloneQuestion = { ...questionsJson[i] };
            let eachQuestion = questionsJson[i];
            delete eachCloneQuestion.DropDownValues;

            if (eachQuestion.QuestionType == "DropdownFromId") {
                eachCloneQuestion['DropdownValues'] = await questionDropdownTypesRepo.createQueryBuilder('qdv')
                    .select(["qdv.DropdownName as value"])
                    .where("qdv.DropdownType = :DropdownType", { DropdownType: eachQuestion.DropDownValues })
                    .getRawMany();

            } else {
                eachCloneQuestion['DropdownValues'] = [];
            };
            newArray.push(eachCloneQuestion);
        };
        return newArray;
    };

    async getPrivateLand(data) {
        const { Village, Page = 1, PageSize = 20 } = data;
        const page = Page; // Example: current page number
        const pageSize = PageSize; // Example: number of records per page
        // const [results, total] = await dprsPrivateLandRepo.createQueryBuilder('dprs')
        //     .where('dprs."Fruit ID" = :fruitId', { fruitId: FruitId })
        //     .where(new Brackets(qb => {
        //         qb.where('dprs."Survey hissa" LIKE :surveyNo', { surveyNo: `%${SurveyNo}%` })
        //             .orWhere('dprs."Owner Name" LIKE :owner', { owner: `%${OwnerName}%` })
        //             .orWhere('dprs."SWC Farmer Requirement" = :activityName', { activityName: ActivityName });
        //     }))
        //     .orderBy('dprs."id"', 'ASC') // Make sure to use an appropriate column for ordering
        //     .skip((page - 1) * pageSize)
        //     .take(pageSize)
        //     .getManyAndCount();
        const [results, total] = await dprsPrivateLandRepo.createQueryBuilder('dprs')
            .where('dprs.Village = :Village', { Village: Village })
            .orderBy('dprs."id"', 'ASC') // Make sure to use an appropriate column for ordering
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        const totalPages = Math.ceil(total / pageSize);
        return {
            total,
            page,
            pageSize,
            totalPages,
            totalData: results
        };
    };

    async getCommonLand(data) {
        const { Village, Page = 1, PageSize = 20 } = data;
        const page = Page; // Example: current page number
        const pageSize = PageSize; // Example: number of records per page
        let [results, total]: any = await dprsCommonLandRepo.createQueryBuilder('dprs')
            .where('dprs.Village = :Village', { Village: Village })
            .skip((page - 1) * pageSize) // Skip the results for the previous pages
            .take(pageSize) // Limit the number of results per page
            .getManyAndCount();
        const totalPages = Math.ceil(total / pageSize);
        return {
            total,
            page,
            pageSize,
            totalPages,
            totalData: results
        };
    };


    async saveSurveyData(data) {
        return await waterShedDataRepo.save(data);
    };

    async saveSurveyImages(data) {
        return await watershedImgAndVideoRepo.save(data);
    };

    async retriveDistrictWithCodes() {
        return await masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT DistrictCode, DistrictName")
            .getRawMany();
    };

    async retriveOnlyDistrict(code) {
        return await masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT DistrictCode, DistrictName")
            .where("md.DistrictCode= :id", { id: code })
            .getRawMany();
    };
    async retriveOnlyTaluks(code) {
        return await masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT TalukCode, TalukName")
            .where("md.DistrictCode= :id", { id: code })
            .getRawMany();
    };
    async retriveOnlyHobli(dcode, tcode) {
        return await masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT HobliCode, HobliName")
            .where("md.TalukCode= :id and md.DistrictCode = :dcode", { id: tcode, dcode })
            .getRawMany();
    };
    async retriveOnlyVillages(dcode, tcode, hcode) {
        return await masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT VillageCode, VillageName")
            .where("md.TalukCode= :id and md.DistrictCode = :dcode and md.HobliCode= :hcode", { id: tcode, dcode, hcode })
            .getRawMany();
    };

    async uploadImages(data) {
        const { ImageName, ImageData, UserId } = data;
        return await uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Image', UserId });
    }

    async getImage(id) {
        return await uploadImgAndVideoRepo.findOneBy({ id: Equal(id) })
    }

    async uploadVideos(data) {
        const { ImageName, ImageData, UserId } = data;
        return await uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Video', UserId });
    }

    async getVideo(id) {
        return await uploadImgAndVideoRepo.findOneBy({ id: Equal(id) })
    }

};