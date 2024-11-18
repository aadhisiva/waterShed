import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { SUPER_ADMIN } from '../utils/constants';
import { Equal } from 'typeorm';
import { Questions } from '../entities/questions';
import { QuestionDropdownTypes } from '../entities/questionsDropdownsTypes';
import { AssignedMasters } from '../entities/assignedMasters';
import { Roles } from '../entities/roles';
import { Departments } from '../entities/department';
import { Schemes } from '../entities/schemes';
import { Sectors } from '../entities/sectors';
import { Category } from '../entities/category';
import { Activity } from '../entities/activity';
import { MasterData } from '../entities/masterData';
import { repository } from '../db/repos';

@Service()
export class AdminRepo {

    // async checkWithMobile(Mobile) {
    //     return await loginDataRepo.findOneBy({ Mobile });
    // };

    // async allUsersData(data) {
    //     const { skip, take } = data;
    //     let getData = await loginDataRepo
    //         .createQueryBuilder('user').select(["user.UserRole as UserRole", "user.Name as Name", "user.UserId as UserId", "user.Mobile as Mobile", "user.DistrictCode as DistrictCode",
    //             "user.TalukCode as TalukCode", "user.HobliCode as HobliCode", "user.Status as Status",
    //             "user.Allotted as Allotted", "user.Assignment as Assignment", "user.DistrictName as DistrictName",
    //             "user.TalukName as TalukName", "user.HobliName as HobliName"])
    //         .skip(skip)
    //         .take(take)
    //         .getRawMany();
    //     let count = await loginDataRepo.count();
    //     return [getData, count]
    // };

    // async assigningData(data) {
    //     let userAssign = await loginDataRepo;
    //     let find = await userAssign.findOneBy({ UserId: data?.UserId });
    //     if (!find) return { code: 404 };
    //     let newData = { ...find, ...data };
    //     return await userAssign.save(newData);
    // };

    async getVersionOfApp() {
        return await repository.versionRepo.find();
    };

    // async sendOtp(data: loginData) {
    //     const { Mobile, UserRole } = data;
    //     if (UserRole == SUPER_ADMIN) {
    //         let findData = await superAdminRepo.findOneBy({ Mobile });
    //         if (!findData) return { code: 404 };
    //         let newData = { ...findData, ...data };
    //         return await superAdminRepo.save(newData);
    //     } else {
    //         let loginDb = await loginDataRepo;
    //         let findData = await loginDb.findOneBy({ Mobile, UserRole });
    //         if (!findData) return { code: 404 };
    //         let newData = { ...findData, ...data };
    //         return await loginDb.save(newData);
    //     }
    // };

    async checkMobileLogin(data) {
        const { Mobile, Otp } = data;
        let getData = await repository.assignedMastersRepo.createQueryBuilder('ud')
            .leftJoinAndSelect(Roles, 'lr', "lr.id = ud.RoleId")
            .select(["DISTINCT lr.RoleName", "lr.id as RoleId"])
            .where("ud.Mobile = :Mobile", { Mobile })
            .getRawMany();
        if (getData.length == 0) return { code: 422, message: "Access Denied" };
        let updateOtp = await repository.assignedMastersRepo.findOneBy({ Mobile: Equal(Mobile) });
        let updateObj = { ...updateOtp, ...{ Otp } }
        await repository.assignedMastersRepo.save(updateObj);
        return getData;
    };


    async findUserAndUpdate(data) {
        const { Mobile, Id } = data;
        let getData = await repository.assignedMastersRepo.findOneBy({ RoleId: Equal(Id), Mobile: Equal(Mobile) });
        if (!getData) return { code: 422 };
        let newData = { ...getData, ...{ Otp: data?.Otp } }
        return repository.assignedMastersRepo.save(newData);
    };

    async getDataAccess(data) {
        const { Id } = data;
        let getData = await repository.roleAccessRepo.findOneBy({ RoleId: Equal(Id) });
        if (!getData) return { code: 422, message: "You dont have access to go further" }
        return getData;
    };

    async checkRoleAccess(data) {
        const { RoleId } = data;
        let getData = await repository.roleAccessRepo.findOneBy({ RoleId: Equal(RoleId) });
        if (!getData) return { code: 422, message: "You dont have access to go further" }
        return getData;
    };

    async fetchUser(data) {
        const { Id, Otp } = data;
        let findData = await repository.assignedMastersRepo.findOneBy({ UserId: Equal(Id), Otp: Equal(Otp) });
        if (!findData) return { code: 404 };
        return findData;
    };

    async addDepartment(data) {
        let existingData = await repository.departmentsRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.departmentsRepo.save(newData);
    };

    async getDepartment(data) {
        return await repository.departmentsRepo.find();
    };

    async getDropdownDepart() {
        return await repository.departmentsRepo.createQueryBuilder('dd')
            .select(["dd.id as value", "dd.DepartmentName as name"])
            .getRawMany();
    };

    async getDropdownSchemes() {
        return await repository.schemesRepo.createQueryBuilder('sc')
            .leftJoinAndSelect(Departments, 'dp', 'dp.id = sc.DepartmentId')
            .select(["sc.id as value", "CONCAT(sc.SchemeName,'-D-',dp.DepartmentName ) as name"])
            .getRawMany();
    };

    async getDropdownSectors() {
        return await repository.sectorsRepo.createQueryBuilder('sc')
            .leftJoinAndSelect(Schemes, 'se', 'se.id = sc.SchemeId')
            .select(["sc.id as value", "CONCAT(sc.SectorName,'-SE-',se.SchemeName) as name"])
            .where("sc.RecordType = :RecordType", {RecordType: "New Sector"})
            .getRawMany();
    };

    async getDropdownActivty() {
        return await repository.activityRepo.createQueryBuilder('sc')
            .leftJoinAndSelect(Sectors, 'sec', 'sec.id = sc.SectorId')
            .select(["sc.id as value", "CONCAT(sc.ActivityName,'-SEC-',sec.SectorName) as name"])
            .getRawMany();
    };

    async addCategory(data) {
        let existingData = await repository.categoryRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.categoryRepo.save(newData);
    };

    async getCategoryData() {
        return await repository.categoryRepo.createQueryBuilder('ca')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = ca.DepartmentId")
            .leftJoinAndSelect(Category, 'ca1', 'ca1.id = ca.ParentId')
            .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ca.SectorId')
            .select(["ca.id as id", "ca.CategoryName as CategoryName", "ca.ParentId as ParentId", "sec.id as SectorId", "sec.SectorName as SectorName",
                'ca1.CategoryName as ParentName', "dp.DepartmentName as DepartmentName", "ca.DepartmentId as DepartmentId"])
            .getRawMany();
    };

    async getDropdownCategory() {
        return await repository.categoryRepo.createQueryBuilder('ca')
            .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ca.SectorId')
            .select(["ca.id as value", "CONCAT(ca.CategoryName,'-SEC-',sec.SectorName) as name"])
            .getRawMany();
    };

    async addschemes(data) {
        let existingData = await repository.schemesRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.schemesRepo.save(newData);
    };

    async getSchemesData() {
        return await repository.schemesRepo.createQueryBuilder('scheme')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = scheme.DepartmentId")
            .leftJoinAndSelect(Schemes, 'sc', 'sc.id = scheme.ParentId')
            .leftJoinAndSelect(Roles, 'rl', 'rl.id = scheme.RoleId')
            .select(["scheme.id as id", "scheme.Description as Description", "rl.RoleName as RoleName", "scheme.RoleId as RoleId",
                "scheme.SchemeName as SchemeName", "scheme.SchemeLogo as SchemeLogo", "scheme.ParentId as ParentId", 'sc.SchemeName as ParentName',
                "dp.DepartmentName as DepartmentName", "scheme.DepartmentId as DepartmentId"])
            .getRawMany();
    };

    async addSectors(data) {
        let existingData = await repository.sectorsRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.sectorsRepo.save(newData);
    };

    async getSectorsData() {
        return await repository.sectorsRepo.createQueryBuilder('sec')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = sec.DepartmentId")
            .leftJoinAndSelect(Sectors, 'sc', 'sc.id = sec.ParentId')
            .leftJoinAndSelect(Sectors, 'sse', 'sse.id = sec.SectorId')
            .leftJoinAndSelect(Schemes, 'se', 'se.id = sec.SchemeId')
            .select(["sec.id as id", "sec.Description as Description", "se.SchemeName as SchemeName", "sec.SchemeId as SchemeId",
                "sec.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.ParentId as ParentId", 'sc.SectorName as ParentName',
                "dp.DepartmentName as DepartmentName", "sec.DepartmentId as DepartmentId", "sec.IsCategory as IsCategory",
                "sec.RecordType as RecordType","sse.SectorName as SSectorName", "sec.SectorId as SectorId"])
            .getRawMany();
    };

    async addRoleAccess(data) {
        let existingData = await repository.roleAccessRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.roleAccessRepo.save(newData);
    };

    async getDropdownRoles() {
        return await repository.rolesRepo.createQueryBuilder('sc')
            .select(["sc.id as value", "sc.RoleName as name"])
            .getRawMany();
    };


    async getChildAccess() {
        return await repository.childRoleRepo.createQueryBuilder('la')
            .leftJoinAndSelect(Roles, 'lr', 'lr.id=la.RoleId')
            .leftJoinAndSelect(Roles, 'lr1', 'lr1.id=la.ChildId')
            .select(["la.id id", "lr.RoleName RoleName", 'lr.id RoleId', "lr1.RoleName ChildName", "la.ChildId ChildId"])
            .getRawMany();
    };

    async getChildBasedOnParent(data) {
        const { RoleId } = data;
        return await repository.childRoleRepo.createQueryBuilder('rl')
            .leftJoinAndSelect(Roles, 'lr', "lr.id = rl.ChildId")
            .select(["lr.id as value", "lr.RoleName as name"])
            .where("rl.RoleId = :RoleId", { RoleId: RoleId })
            .getRawMany();

    };

    async assignChildAccess(data) {
        let getOneObj = await repository.childRoleRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...getOneObj, ...data };
        return await repository.childRoleRepo.save(newData);
    };

    async addRoles(data) {
        let existingData = await repository.rolesRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.rolesRepo.save(newData);
    };

    async addQuestion(data) {
        let existingData = await repository.questionsRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.questionsRepo.save(newData);
    };

    async addQuestionDropDownTypes(data) {
        let existingData = await repository.questionDropdownTypesRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.questionDropdownTypesRepo.save(newData);
    };

    async getQuestionData() {
        return await repository.questionsRepo.createQueryBuilder('qu')
            .select(["qu.id as id", "qu.Question as Question", "qu.QuestionId as QuestionId", "qu.QuestionType as QuestionType", "qu.IsMandatory as IsMandatory",
                "qu.DropDownValues as DropDownValues"])
            .getRawMany();
    };

    async getQuestionDataDropDownTypes() {
        return await repository.questionDropdownTypesRepo.createQueryBuilder('qu')
            .select(["qu.id as id", "qu.DropdownName as DropdownName", "qu.DropdownType as DropdownType"])
            .getRawMany();
    };

    async getDropdownDropDownTypes() {
        return await repository.questionDropdownTypesRepo.createQueryBuilder('sc')
            .select(["DISTINCT sc.DropdownType as value", "sc.DropdownType as name"])
            .getRawMany();
    };

    async getDropdownQuestions() {
        return await repository.questionsRepo.createQueryBuilder('sc')
            .select(["sc.id as value", "sc.Question as name"])
            .getRawMany();
    };

    async getRolesDataAccess() {
        return await repository.roleAccessRepo.createQueryBuilder('role')
            .leftJoinAndSelect(Roles, 'rl', "rl.id = role.RoleId")
            .select(["role.id as id", "rl.RoleName as RoleName", "role.RoleId as RoleId",
                "role.District as District", "role.Taluk as Taluk", "role.Hobli as Hobli",
                "role.Village as Village", "role.Type Type"])
            .getRawMany();
    };

    async getRolesData() {
        return await repository.rolesRepo.createQueryBuilder('role')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = role.DepartmentId")
            .select(["role.id as id", "role.RoleName as RoleName",
                "dp.DepartmentName as DepartmentName", "role.DepartmentId as DepartmentId", "role.IsMobile as IsMobile"])
            .getRawMany();
    };

    async addActivity(data) {
        let existingData = await repository.activityRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await repository.activityRepo.save(newData);
    };

    async addMapping(data) {
        return await repository.questionMappingRepo.save(data);
    };

    async editMappedQuestion(data) {
        let findValue = await repository.questionMappingRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...findValue, ...data };
        return await repository.questionMappingRepo.save(newData);
    };

    async getMappedQuestion() {
        return await repository.questionMappingRepo.createQueryBuilder('qm')
            .leftJoinAndSelect(Activity, 'ac', "ac.id = qm.ActivityId")
            .leftJoinAndSelect(Questions, 'qu', "qu.id = qm.QuestionId")
            .select(["qm.id as id", "ac.ActivityName as ActivityName", "qu.Question as Question", "ac.id as ActivityId", "qu.id as QuestionId",
                "qu.QuestionType as QuestionType", "qm.TypeOfLand as TypeOfLand"])
            .getRawMany();
    };

    async getActivityDetails(data){
        return await repository.activityRepo.findOneBy({id: Equal(data?.ActivityId)});
    }

    async getActivityData() {
        return await repository.activityRepo.createQueryBuilder('ac')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = ac.DepartmentId")
            .leftJoinAndSelect(Activity, 'ac1', 'ac1.id = ac.ParentId')
            .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ac.SectorId')
            .leftJoinAndSelect(Category, 'ct', 'ct.id = ac.CategoryId')
            .select(["ac.id as id", "ac.ActivityName as ActivityName", "ac.ParentId as ParentId", "ac.SectorId as SectorId", "sec.SectorName as SectorName",
                'ac1.ActivityName as ParentName', "dp.DepartmentName as DepartmentName", "ac.DepartmentId as DepartmentId", "ac.TypeOfWork as TypeOfWork",
                "ac.TypeOfLand as TypeOfLand", "ac.TypeOfStatus as TypeOfStatus", "ct.id as CategoryId", "ct.CategoryName as CategoryName"])
            .getRawMany();
    };

    // async checkUsername(user) {
    //     let check = await superAdminRepo.findOneBy({ Username: Equal(user) })
    //     return check;
    // };

    // async addSuperAdminData(data) {
    //     let check = await superAdminRepo.save(data);
    //     return check;
    // };

    async assignmentProcess(data) {
        let findData = await repository.assignedMastersRepo.findOneBy({ UserId: Equal(data?.id) });
        let newData = { ...findData, ...data };
        let result = await repository.assignedMastersRepo.save(newData);
        await repository.assignMastersHistoryRepo.save({ ...result, ...{ History: "New user Added" } });
        return {};
    };

    async assignToSurvey(data) {
        let findData = await repository.userDataRepo.findOneBy({ UserId: Equal(data?.UserId) });
        let newData = { ...findData, ...data };
        let result = await repository.userDataRepo.save(newData);
        await repository.assignMastersHistoryRepo.save({ ...result, ...{ History: "Surveyer Added" } });
        return {};
    };

    async getDistrictsDD(data) {
        return await repository.masterDataRepo.createQueryBuilder('dd')
            .select(["DISTINCT dd.DistrictCode as value", "dd.DistrictName as name"])
            .orderBy("DistrictName", "ASC")
            .getRawMany();
    };

    async getAuthDistrictDD(data) {
        const { Mobile, ListType } = data;
        return await repository.masterDataRepo.createQueryBuilder('dd')
            .innerJoinAndSelect(AssignedMasters, 'am', 'am.DistrictCode=dd.DistrictCode')
            .select(["DISTINCT dd.DistrictCode as value", "dd.DistrictName as name"])
            .where("am.Mobile = :Mobile and am.ListType = :ListType", { Mobile, ListType })
            .orderBy("DistrictName", "ASC")
            .getRawMany();
    };
    async getTalukDD(code) {
        return await repository.masterDataRepo.createQueryBuilder('tt')
            .select(["DISTINCT tt.TalukCode as value", "tt.TalukName as name"])
            .where("tt.DistrictCode = :dc", { dc: code })
            .orderBy("TalukName", "ASC")
            .getRawMany();
    };
    async getAuthTalukDD(data) {
        const { Mobile, ListType } = data;
        return await repository.masterDataRepo.createQueryBuilder('tt')
            .leftJoinAndSelect(AssignedMasters, 'am', 'am.TalukCode=tt.TalukCode and am.DistrictCode=tt.DistrictCode')
            .select(["DISTINCT tt.TalukCode as value", "tt.TalukName as name"])
            .where("am.Mobile = :Mobile and am.ListType = :ListType", { Mobile, ListType })
            .orderBy("TalukName", "ASC")
            .getRawMany();
    };

    async getHobliDD(UDCode, UTCode) {
        return await repository.masterDataRepo.createQueryBuilder('gd')
            .select(["DISTINCT gd.HobliCode as value", "gd.HobliName as name"])
            .where("gd.TalukCode = :tc and gd.DistrictCode = :dc", { tc: UTCode, dc: UDCode })
            .orderBy("HobliName", "ASC")
            .getRawMany();
    };

    async getAuthHobliDD(data) {
        const { Mobile, ListType } = data;
        return await repository.masterDataRepo.createQueryBuilder('gd')
            .innerJoinAndSelect(AssignedMasters, 'am', 'am.TalukCode=gd.TalukCode and am.DistrictCode=gd.DistrictCode and am.HobliCode=gd.HobliCode')
            .select(["DISTINCT gd.HobliCode as value", "gd.HobliName as name"])
            .where("am.Mobile = :Mobile and am.ListType = :ListType", { Mobile, ListType })
            .orderBy("HobliName", "ASC")
            .getRawMany();
    }
    async getVillagesDD(UDCode, UTCode, UHCode) {
        return await repository.masterDataRepo.createQueryBuilder('vd')
            .select(["DISTINCT vd.VillageCode as value", "vd.VillageName as name"])
            .where("vd.HobliCode = :hc and vd.DistrictCode = :dc and vd.TalukCOde = :tc", { hc: UHCode, dc: UDCode, tc: UTCode })
            .getRawMany();
    };

    async getAssignedData(data) {
        const { Mobile, ReqType, DataType } = data;
        let query = `execute assignedOfficersOrSurveyers @0,@1,@2`;
        return await AppDataSource.query(query, [ReqType, Mobile, DataType]);
    };

    async getAssignedDistricts() {
        return await repository.assignedMastersRepo.createQueryBuilder('ta')
            .leftJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .leftJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode')
            .select(["DISTINCT md.DistrictName DistrictName", "ta.id id", "md.DistrictCode DistrictCode", "md.DistrictNameKA DistrictNameKA", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "District" })
            .getRawMany();
    };

    async getAssignedTaluk() {
        return await repository.assignedMastersRepo.createQueryBuilder('ta')
            .innerJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode and md.TalukCode=ta.TalukCode')
            .select(["DISTINCT md.TalukName TalukName", "md.DistrictName DistrictName", "md.DistrictCode DistrictCode", "md.TalukCode TalukCode", "ta.id id", "md.TalukNameKA TalukNameKA", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "Taluk" })
            .getRawMany();
    };

    async getAssignedHobli() {
        return await repository.assignedMastersRepo.createQueryBuilder('ta')
            .innerJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode and md.TalukCode=ta.TalukCode and md.HobliCode=ta.HobliCode')
            .select(["DISTINCT md.HobliName HobliName", "md.HobliNameKA HobliNameKA", "md.TalukName TalukName", "md.DistrictName DistrictName", "md.DistrictCode DistrictCode", "md.HobliCode HobliCode", "md.TalukCode TalukCode", "ta.id id", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "Hobli" })
            .getRawMany();
    };

    async getAssignedVillage() {
        return await repository.assignedMastersRepo.createQueryBuilder('ta')
            .innerJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode and md.TalukCode=ta.TalukCode and md.HobliCode=ta.HobliCode and md.VillageCode=ta.VillageCode')
            .select(["DISTINCT md.VillageName VillageName", "md.VillageNameKA VillageNameKA", "md.TalukName TalukName", "md.DistrictName DistrictName", "md.HobliName HobliName", "md.VillageCode VillageCode", "md.DistrictCode DistrictCode", "md.HobliCode HobliCode", "md.TalukCode TalukCode", "ta.id id", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "Village" })
            .getRawMany();
    };

    async uploadPrivateLand(data) {
        let chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await repository.dprsPrivateLandRepo.save(chunk);
        }
        return { code: 200, message: "Uploaded Successfully.", data: {} };
    }

    async uploadCommonLand(data) {
        let chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await repository.dprsCommonLandRepo.save(chunk);
        }
        return { code: 200, message: "Uploaded Successfully.", data: {} };
    }

    async getDprsPrivateLand(data) {
        const { RowsPerPage, Page } = data;
        const offset = (Page - 1) * RowsPerPage;
        const [totalData, total] = await repository.dprsPrivateLandRepo.findAndCount({
            take: RowsPerPage,
            skip: offset,
            order: { id: "ASC" }
        });
        return { total, totalData }
    }

    async getDprsCommonLand(data) {
        const { RowsPerPage, Page } = data;
        const offset = (Page - 1) * RowsPerPage;
        const [totalData, total] = await repository.dprsCommonLandRepo.findAndCount({
            take: RowsPerPage,
            skip: offset,
            order: { id: "ASC" }
        });
        return { total, totalData }
    };

    async uploadImages(data) {
        const { ImageName, ImageData, UserId } = data;
        return await repository.uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Image', UserId });
    }

    async getImage(id) {
        return await repository.uploadImgAndVideoRepo.findOneBy({ id: Equal(id) })
    };


    async uploadDistrictMasters(data) {
        return await repository.masterDataRepo.save(data);
    }
};