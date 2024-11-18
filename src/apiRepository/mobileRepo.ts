import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { Equal} from 'typeorm';
import { Versions } from '../entities/versions';
import { MasterData } from '../entities/masterData';
import { Sectors } from '../entities/sectors';
import { Questions } from '../entities/questions';
import { Roles } from '../entities/roles';
import { repository } from '../db/repos';
@Service()
export class MobileRepo {

    async getVersionOfApp() {
        return await AppDataSource.getRepository(Versions).find();
    };

    async sendOtp(data) {
        const { Mobile, RoleId } = data;
        let findData = await repository.userDataRepo.findOneBy({ Mobile: Equal(Mobile), RoleId: Equal(RoleId) });
        if (!findData) return { code: 404 };
        let newData = { ...findData, ...data };
        await repository.userDataRepo.save(newData);
        return await repository.userDataRepo.createQueryBuilder('vs')
            .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=vs.DistrictCode and md.TalukCode=vs.TalukCode and md.HobliCode=vs.HobliCode')
            .select([`DISTINCT vs.DistrictCode DistrictCode, vs.TalukCode TalukCode, vs.HobliCode HobliCode, vs.UserId UserId, 
            CONCAT('D-',md.DistrictName,'-T-',md.TalukName,'-H-',md.HobliName) as assignedHobli`
            ])
            .where("vs.Mobile = :Mobile and vs.RoleId = :RoleId", { Mobile: Mobile, RoleId: RoleId })
            .getRawMany();
    };

    async fetchUser(data) {
        const { Mobile, RoleId } = data;
        let findData = await repository.userDataRepo.findOneBy({ Mobile: Equal(Mobile), RoleId: Equal(RoleId) });
        if (!findData) return { code: 404 };
        return findData;
    };

    async assignedHobliDetails(data) {
        const { DistrictCode, TalukCode, HobliCode } = data;
        return repository.masterDataRepo.createQueryBuilder('md')
            .select(["DISTINCT CONCAT(md.VillageName,' -k- ', md.VillageNameKa) as VillageName"])
            .where("md.DistrictCode = :dcode and md.TalukCode = :tcode and md.HobliCode = :hcode",
                { dcode: DistrictCode, tcode: TalukCode, hcode: HobliCode })
            .getRawMany();

    }

    async getWatershedOrSub(data) {
        const { DistrictCode, TalukCode, HobliCode, VillageName } = data;
        return repository.masterDataRepo.createQueryBuilder('md')
            .select(['DISTINCT md.SubWatershedCode, md.SubWatershedName SubWatershedName'])
            .where("md.DistrictCode = :dcode and md.TalukCode = :tcode and md.HobliCode = :hcode and md.VillageName = :vName",
                { dcode: DistrictCode, tcode: TalukCode, hcode: HobliCode, vName: VillageName })
            .getRawMany();
    };

    async getMicroWatershedData(data) {
        const { DistrictCode, TalukCode, HobliCode, VillageName, SubWatershedCode } = data;
        return repository.masterDataRepo.createQueryBuilder('md')
            .select(['DISTINCT md.MicroWatershedCode, md.MicroWatershedName MicroWatershedName'])
            .where("md.DistrictCode = :dcode and md.TalukCode = :tcode and md.HobliCode = :hcode and md.VillageName = :vName and md.SubWatershedCode = :swc",
                { dcode: DistrictCode, tcode: TalukCode, hcode: HobliCode, vName: VillageName, swc: SubWatershedCode })
            .getRawMany();
    };

    // async fetchUserById(UserId) {
    //     let findData = await AppDataSource.getRepository(loginData).findOneBy({ UserId });
    //     if (!findData) return { code: 404 };
    //     return findData;
    // };


    // async locations(data) {
    //     const { UserId, Mobile, UserRole } = data;
    //     let findAll = await loginDataRepo.findBy({ Mobile, UserRole });
    //     let newArray = [];
    //     if (UserRole == 'AO') {
    //         let totalLength = findAll.length;
    //         for (let i = 0; i < totalLength; i++) {
    //             let newObject = {};
    //             let eachIndex = findAll[i];
    //             if (!eachIndex.DistrictName) break;
    //             newObject['District'] = eachIndex.DistrictName;
    //             newObject['Taluk'] = eachIndex.TalukName;
    //             if (!eachIndex.HobliName) break;
    //             newObject['Hobli'] = eachIndex.HobliName;
    //             newObject['villages'] = await repository.masterDataRepo.createQueryBuilder('master').select(['DISTINCT master.KGISVillageName as village'])
    //                 .where("master.HobliName = :dCode", { dCode: eachIndex.HobliName })
    //                 .getRawMany();
    //             newObject['subWaterShead'] = await repository.masterDataRepo.createQueryBuilder('master').select(['DISTINCT master.SubWatershedName as subWaterShead'])
    //                 .where("master.HobliName = :dCode", { dCode: eachIndex.HobliName })
    //                 .orderBy('master.SubWatershedName', 'ASC').getRawMany();
    //             newArray.push(newObject);
    //         }

    //         return newArray;
    //     } else {
    //         let totalLength = findAll.length;
    //         for (let i = 0; i < totalLength; i++) {
    //             let newObject = {};
    //             let eachIndex = findAll[i];
    //             newObject['District'] = eachIndex.DistrictName;
    //             newObject['Taluk'] = eachIndex.TalukName;
    //             newObject['villages'] = await repository.masterDataRepo.createQueryBuilder('master').select(['DISTINCT master.KGISVillageName as village'])
    //                 .where("master.TalukName = :dCode", { dCode: eachIndex.TalukName })
    //                 .orderBy('master.KGISVillageName', 'ASC').getRawMany();
    //             newObject['subWaterShead'] = await repository.masterDataRepo.createQueryBuilder('master').select(['DISTINCT master.SubWatershedName as subWaterShead'])
    //                 .where("master.TalukName = :dCode", { dCode: eachIndex.TalukName })
    //                 .orderBy('master.SubWatershedName', 'ASC').getRawMany();
    //             newArray.push(newObject);
    //         }
    //         return newArray;
    //     }
    // };

    async saveActualData(data) {
        let savingData = await "waterShedRepo";
        return savingData;
    }

    async getAllSchemes(data) {
        let savingData = await repository.schemesRepo.createQueryBuilder('scheme')
            .select(["scheme.SchemeName as SchemeName", "scheme.SchemeLogo as SchemeLogo", "scheme.id as SchemeId"])
            .where("scheme.RoleId = :RoleId", { RoleId: data?.RoleId })
            .getRawMany();
        return savingData;
    };

    async getAllRoles() {
        let savingData = await repository.rolesRepo.createQueryBuilder('role')
            .select(["role.RoleName as RoleName", "role.id as RoleId"])
            .where("role.IsMobile = :IsMobile", { IsMobile: 'Yes' })
            .getRawMany();
        return savingData;
    };

    async getSectors(data) {
        let getNewSecData = await repository.sectorsRepo.createQueryBuilder('sec')
            .select(["sec.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.id as SectorId", "sec.IsCategory as IsCategory"])
            .where("sec.SchemeId = :SchemeId and sec.RecordType = :Record", { SchemeId: data?.SchemeId, Record: "New Sector" })
            .getRawMany();
        let getExistingSecData = await repository.sectorsRepo.createQueryBuilder('sec')
            .innerJoinAndSelect(Sectors, 'sec1', 'sec1.id=sec.SectorId')
            .select(["sec1.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.SectorId as SectorId", "sec.IsCategory as IsCategory"])
            .where("sec.SchemeId = :SchemeId and sec.RecordType = :Record", { SchemeId: data?.SchemeId, Record: "Existing Sector" })
            .getRawMany();
        return getNewSecData.concat(getExistingSecData);
    };

    async getActivityBasedOnCategory(Id) {
        let newArray = [];
        let activityData = await repository.activityRepo.createQueryBuilder('ac')
            .select(["ac.ActivityName as ActivityName", "ac.id as ActivityId", "ac.TypeOfWork as TypeOfWork", "ac.TypeOfLand as TypeOfLand", "ac.TypeOfStatus as TypeOfStatus"])
            .where("ac.CategoryId = :CategoryId and ac.ParentId = :ParentId", { CategoryId: Id, ParentId: '-1' })
            .getRawMany();
        let activityDataLength = activityData.length;
        for (let i = 0; i < activityDataLength; i++) {
            let eachActitivy = { ...activityData[i] };
            delete activityData[i];
            eachActitivy['SubActivity'] = await repository.activityRepo.createQueryBuilder('ac')
                .select(["ac.ActivityName as ActivityName", "ac.id as SubActivityId", "ac.TypeOfWork as TypeOfWork", "ac.TypeOfLand as TypeOfLand", "ac.TypeOfStatus as TypeOfStatus"])
                .where("ac.ParentId = :ParentId", { ParentId: eachActitivy?.ActivityId })
                .getRawMany();
            newArray.push(eachActitivy);
        }
        return newArray;
    };

    async getActivityBasedOnSector(Id) {
        let newArray = [];
        let activityData = await repository.activityRepo.createQueryBuilder('ac')
            .select(["ac.ActivityName as ActivityName", "ac.id as ActivityId", "ac.TypeOfWork as TypeOfWork", "ac.TypeOfLand as TypeOfLand", "ac.TypeOfStatus as TypeOfStatus"])
            .where("ac.SectorId = :SectorId and ac.ParentId = :ParentId", { SectorId: Id, ParentId: '-1' })
            .getRawMany();
        let activityDataLength = activityData.length;
        for (let i = 0; i < activityDataLength; i++) {
            let eachActitivy = { ...activityData[i] };
            delete activityData[i];
            eachActitivy['SubActivity'] = await repository.activityRepo.createQueryBuilder('ac')
                .select(["ac.ActivityName as ActivityName", "ac.id as SubActivityId", "ac.TypeOfWork as TypeOfWork", "ac.TypeOfLand as TypeOfLand", "ac.TypeOfStatus as TypeOfStatus"])
                .where("ac.ParentId = :ParentId", { ParentId: eachActitivy?.ActivityId })
                .getRawMany();
            newArray.push(eachActitivy);
        }
        return newArray;
    };

    async getCategory(data) {
        let newArray = [];
        let categoryData = await repository.categoryRepo.createQueryBuilder('ac')
            .select(["ac.CategoryName as CategoryName", "ac.id as CategoryId"])
            .where("ac.SectorId = :SectorId and ac.ParentId = :ParentId", { SectorId: data?.SectorId, ParentId: '-1' })
            .getRawMany();
        let categoryDataLength = categoryData.length;
        for (let i = 0; i < categoryDataLength; i++) {
            let eachCategory = { ...categoryData[i] };
            delete categoryData[i];
            eachCategory['SubCategory'] = await repository.categoryRepo.createQueryBuilder('ac')
                .select(["ac.CategoryName as CategoryName", "ac.id as CategoryId"])
                .where("ac.ParentId = :ParentId", { ParentId: eachCategory?.CategoryId })
                .getRawMany();
            newArray.push(eachCategory);
        }
        return newArray;
    };

    async getQuestionsBasedOnActivity(data) {
        const { ActivityId } = data;
        let questionsJson = await repository.questionMappingRepo.createQueryBuilder('qm')
            .leftJoinAndSelect(Questions, 'qu', "qu.id = qm.QuestionId")
            .select(["qu.QuestionId as QuestionId", "qu.Question as Question", "qu.QuestionType as QuestionType", "qu.DropDownValues as DropDownValues", "qu.IsMandatory as IsMandatory"])
            .where("qm.ActivityId = :ActivityId", { ActivityId: ActivityId })
            .getRawMany();
        let questionsJsonLength = questionsJson.length;
        const newArray = [];
        for (let i = 0; i < questionsJsonLength; i++) {
            let eachCloneQuestion = { ...questionsJson[i] };
            let eachQuestion = questionsJson[i];
            delete eachCloneQuestion.DropDownValues;

            if (eachQuestion.QuestionType == "DropdownFromId") {
                eachCloneQuestion['DropdownValues'] = await repository.questionDropdownTypesRepo.createQueryBuilder('qdv')
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
        let [VillageEn, VillageKa] = Village.split("-k-");
        const page = Page; // Example: current page number
        const pageSize = PageSize; // Example: number of records per page
        const [results, total] = await repository.dprsPrivateLandRepo.createQueryBuilder('dprs')
            .where('dprs.Village = :Village or dprs.Village = :VillageKa', { Village: VillageEn.trim(), VillageKa: VillageKa.trim() })
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
        let [VillageEn, VillageKa] = Village.split("-k-");
        const page = Page; // Example: current page number
        const pageSize = PageSize; // Example: number of records per page
        let [results, total] = await repository.dprsCommonLandRepo.createQueryBuilder('dprs')
            .where('dprs.Village = :Village or dprs.Village = :VillageKa', { Village: VillageEn.trim(), VillageKa: VillageKa.trim() })
            .orderBy('dprs."id"', 'ASC') // Make sure to use an appropriate column for ordering
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
        try {
            let findData = await repository.userDataRepo.createQueryBuilder('ud')
                .innerJoinAndSelect(Roles, 'rr', "rr.id = ud.RoleId")
                .select(["ud.Mobile as Mobile", "ud.Name as Name", "rr.RoleName as RoleName"])
                .where("ud.UserId = :id", { id: data?.UserId })
                .getRawOne();
            if (!findData) return { code: 422, message: "Access Denied" };
            data.CreatedRole = findData['RoleName'];
            data.CreatedMobile = findData.Mobile;
            data.CreatedName = findData.Name;
            let result = await repository.waterShedDataRepo.save(data);
            await repository.waterShedDataHistoryRepo.save({ ...result, ...{ History: "New Application Added" } });
            return result;
        } catch (E) {
            console.log("E", E.message);
            return E;
        }
    };

    async getSubmissionList(data) {
        const { UserId, PageNo = 1, PageSize = 10, StatusOfWork, CategoryId, SchemeId, SectorId, ActivityId, SubActivityId } = data;
        let whereCondition = CategoryId && SubActivityId ? { UserId: Equal(UserId), StatusOfWork: Equal(StatusOfWork), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), CategoryId: Equal(CategoryId), ActivityId: Equal(ActivityId), SubActivityId: Equal(SubActivityId) }
            : CategoryId && !SubActivityId ? { UserId: Equal(UserId), StatusOfWork: Equal(StatusOfWork), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), CategoryId: Equal(CategoryId), ActivityId: Equal(ActivityId) }
                : SubActivityId && !CategoryId ? { UserId: Equal(UserId), StatusOfWork: Equal(StatusOfWork), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), ActivityId: Equal(ActivityId), SubActivityId: Equal(SubActivityId) }
                    : { UserId: Equal(UserId), StatusOfWork: Equal(StatusOfWork), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), ActivityId: Equal(ActivityId) };

        let totalData = await repository.waterShedDataRepo.findAndCount({
            where: whereCondition,
            select: ["UserId", "SubmissionId", "CreatedDate", "BeneficaryName", "FruitsId", "MobileNumber", "StatusOfWork", "ActivityType", "TypeOfLand"],
            skip: (PageNo - 1) * PageSize,
            take: PageSize
        });
        return {
            totalCount: totalData[1],
            PageNo,
            PageSize,
            totalData: totalData[0]
        }
    };

    async getAllSubmissionList(data) {
        const { UserId, PageNo = 1, PageSize = 10, CategoryId, SchemeId, SectorId, ActivityId, SubActivityId } = data;
        let whereCondition = CategoryId && SubActivityId ? { UserId: Equal(UserId), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), CategoryId: Equal(CategoryId), ActivityId: Equal(ActivityId), SubActivityId: Equal(SubActivityId) }
            : CategoryId && !SubActivityId ? { UserId: Equal(UserId), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), CategoryId: Equal(CategoryId), ActivityId: Equal(ActivityId) }
                : SubActivityId && !CategoryId ? { UserId: Equal(UserId), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), ActivityId: Equal(ActivityId), SubActivityId: Equal(SubActivityId) }
                    : { UserId: Equal(UserId), SchemeId: Equal(SchemeId), SectorId: Equal(SectorId), ActivityId: Equal(ActivityId) };

        let totalData = await repository.waterShedDataRepo.findAndCount({
            where: whereCondition,
            select: ["UserId", "SubmissionId", "CreatedDate", "BeneficaryName", "FruitsId", "MobileNumber", "StatusOfWork", "ActivityType", "TypeOfLand"],
            skip: (PageNo - 1) * PageSize,
            take: PageSize
        });
        return {
            totalCount: totalData[1],
            PageNo,
            PageSize,
            totalData: totalData[0]
        }
    };

    async getRecord(data) {
        const { UserId, SubmissionId, SectorId } = data;
        let query = `execute getRecordForPreview @0,@1,@2`;
        let fetchedRecord = await AppDataSource.query(query, [UserId, SubmissionId, SectorId]);
        let fetchedImages = await repository.watershedImgAndVideoRepo.find({
            where: { SubmissionId: Equal(SubmissionId), UserId: Equal(UserId) },
            select: ["Latitude", "Longitude", "RecordType", "Url"]
        })
        fetchedRecord['ImagesList'] = fetchedImages;
        return fetchedRecord
    };

    async updateSurveyData(data) {
        let findData = await repository.waterShedDataRepo.findOneBy({ SubmissionId: Equal(data?.SubmissionId) });
        let findUser = await repository.userDataRepo.findOneBy({ UserId: Equal(data?.UserId) });
        let userData = { CreatedMobile: findUser.Mobile, CreatedRole: findUser.RoleId, CreatedName: findUser.Name };
        let newData = { ...findData, ...data, ...userData };
        let findHistory = await repository.waterShedDataHistoryRepo.findOneBy({ SubmissionId: Equal(data?.SubmissionId) });
        await repository.waterShedDataHistoryRepo.save({ ...findHistory, ...{ History: "Updated Application Added" }, ...newData, ...userData });
        return await repository.waterShedDataRepo.save(newData);
    };

    async saveSurveyImages(data) {
        try{
        return await repository.watershedImgAndVideoRepo.save(data);
        } catch(e){
            console.log("saveSurveyImages",e.message)
        }
    };

    async retriveDistrictWithCodes() {
        return await repository.masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT DistrictCode, DistrictName")
            .getRawMany();
    };

    async retriveOnlyDistrict(code) {
        return await repository.masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT DistrictCode, DistrictName")
            .where("md.DistrictCode= :id", { id: code })
            .getRawMany();
    };
    async retriveOnlyTaluks(code) {
        return await repository.masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT TalukCode, TalukName")
            .where("md.DistrictCode= :id", { id: code })
            .getRawMany();
    };
    async retriveOnlyHobli(dcode, tcode) {
        return await repository.masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT HobliCode, HobliName")
            .where("md.TalukCode= :id and md.DistrictCode = :dcode", { id: tcode, dcode })
            .getRawMany();
    };
    async retriveOnlyVillages(dcode, tcode, hcode) {
        return await repository.masterDataRepo.createQueryBuilder('md')
            .select("DISTINCT VillageName")
            .where("md.TalukCode= :id and md.DistrictCode = :dcode and md.HobliCode= :hcode", { id: tcode, dcode, hcode })
            .getRawMany();
    };

    async uploadImages(data) {
        const { ImageName, ImageData, UserId } = data;
        return await repository.uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Image', UserId });
    }

    async getImage(id) {
        return await repository.uploadImgAndVideoRepo.findOneBy({ id: Equal(id) })
    }

    async uploadVideos(data) {
        const { ImageName, ImageData, UserId } = data;
        return await repository.uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Video', UserId });
    }

    async getVideo(id) {
        return await repository.uploadImgAndVideoRepo.findOneBy({ id: Equal(id) })
    }

};