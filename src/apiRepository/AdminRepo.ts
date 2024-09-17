import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { Activity, AssignMastersHistory, ChildRoles, Departments, DprsCommonLand, DprsPrivateLand, loginData, MasterData, QuestionMapping, Roles, RolesAccess, Schemes, Sectors, superAdmin, UploadImgAndVideo, UserData, Versions } from '../entities';
import { SUPER_ADMIN } from '../utils/constants';
import { Equal } from 'typeorm';
import { Questions } from '../entities/questions';
import { QuestionDropdownTypes } from '../entities/questionsDropdownsTypes';
import { AssignedMasters } from '../entities/assignedMasters';
import { generateUniqueId } from '../utils/resuableCode';


let superAdminRepo = AppDataSource.getRepository(superAdmin);
let loginDataRepo = AppDataSource.getRepository(loginData);
let schemesRepo = AppDataSource.getRepository(Schemes);
let versionRepo = AppDataSource.getRepository(Versions);
let mastersRepo = AppDataSource.getRepository(MasterData);
let sectorsRepo = AppDataSource.getRepository(Sectors);
let activityRepo = AppDataSource.getRepository(Activity);
let departmentsRepo = AppDataSource.getRepository(Departments);
let rolesRepo = AppDataSource.getRepository(Roles);
let roleAccessRepo = AppDataSource.getRepository(RolesAccess);
let userDataRepo = AppDataSource.getRepository(UserData);
let dprsCommonLandRepo = AppDataSource.getRepository(DprsCommonLand);
let dprsPrivateLandRepo = AppDataSource.getRepository(DprsPrivateLand);
let uploadImgAndVideoRepo = AppDataSource.getRepository(UploadImgAndVideo);
let questionsRepo = AppDataSource.getRepository(Questions);
let questionDropdownTypesRepo = AppDataSource.getRepository(QuestionDropdownTypes);
let questionMappingRepo = AppDataSource.getRepository(QuestionMapping);
let assignedMastersRepo = AppDataSource.getRepository(AssignedMasters);
let masterDataRepo = AppDataSource.getRepository(MasterData);
let childRoleRepo = AppDataSource.getRepository(ChildRoles);
let assignMastersHositoryRepo = AppDataSource.getRepository(AssignMastersHistory);

@Service()
export class AdminRepo {

    async addUser(data: loginData) {
        return await loginDataRepo.save(data);
    };

    async addSuperAdmin(data: loginData) {
        return await superAdminRepo.save(data);
    };

    async checkWithMobile(Mobile) {
        return await loginDataRepo.findOneBy({ Mobile });
    };

    async allUsersData(data) {
        const { skip, take } = data;
        let getData = await loginDataRepo
            .createQueryBuilder('user').select(["user.UserRole as UserRole", "user.Name as Name", "user.UserId as UserId", "user.Mobile as Mobile", "user.DistrictCode as DistrictCode",
                "user.TalukCode as TalukCode", "user.HobliCode as HobliCode", "user.Status as Status",
                "user.Allotted as Allotted", "user.Assignment as Assignment", "user.DistrictName as DistrictName",
                "user.TalukName as TalukName", "user.HobliName as HobliName"])
            .skip(skip)
            .take(take)
            .getRawMany();
        let count = await loginDataRepo.count();
        return [getData, count]
    };

    async assigningData(data) {
        let userAssign = await loginDataRepo;
        let find = await userAssign.findOneBy({ UserId: data?.UserId });
        if (!find) return { code: 404 };
        let newData = { ...find, ...data };
        return await userAssign.save(newData);
    };

    async getVersionOfApp() {
        return await versionRepo.find();
    };

    async sendOtp(data: loginData) {
        const { Mobile, UserRole } = data;
        if (UserRole == SUPER_ADMIN) {
            let findData = await superAdminRepo.findOneBy({ Mobile });
            if (!findData) return { code: 404 };
            let newData = { ...findData, ...data };
            return await superAdminRepo.save(newData);
        } else {
            let loginDb = await loginDataRepo;
            let findData = await loginDb.findOneBy({ Mobile, UserRole });
            if (!findData) return { code: 404 };
            let newData = { ...findData, ...data };
            return await loginDb.save(newData);
        }
    };

    async checkMobileLogin(data) {
        const { Mobile, Otp } = data;
        let getData = await assignedMastersRepo.createQueryBuilder('ud')
            .leftJoinAndSelect(Roles, 'lr', "lr.id = ud.RoleId")
            .select(["DISTINCT ud.Mobile Mobile", "lr.RoleName RoleName", "lr.id RoleId"])
            .where("ud.Mobile = :Mobile", { Mobile })
            .getRawMany();
        if (getData.length == 0) return { code: 422, message: "Access Denied" };
        let updateOtp = await assignedMastersRepo.findOneBy({ Mobile: Equal(Mobile) });
        let updateObj = { ...updateOtp, ...{ Otp } }
        await assignedMastersRepo.save(updateObj);
        return getData;
    };


    async checkRoleAccess(data) {
        const { RoleId } = data;
        let getData = await roleAccessRepo.findOneBy({ RoleId: Equal(RoleId) });
        if (!getData) return { code: 422, message: "You dont have access to go further" }
        return getData;
    };

    async fetchUser(data: loginData) {
        const { Mobile, UserRole } = data;
        if (UserRole == SUPER_ADMIN) {
            let findData = await superAdminRepo.findOneBy({ Mobile });
            if (!findData) return { code: 404 };
            return findData;
        } else {
            let findData = await loginDataRepo.findOneBy({ Mobile, UserRole });
            if (!findData) return { code: 404 };
            return findData;
        }
    };

    async getSchemes(data: loginData) {
        let findData = await schemesRepo.find();
        return findData;
    };

    async allDistricts(data: MasterData) {
        let findData = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.DistrictCode as value', 'master.DistrictName as name'])
            .orderBy('master.DistrictCode', 'ASC').getRawMany();
        return findData;
    };

    async districtWiseTaluk(data) {
        if (!data?.code) return { code: 400 };
        let findData = await mastersRepo.createQueryBuilder('master')
            .select(['DISTINCT master.TalukCode as value', 'master.TalukName as name'])
            .where("master.DistrictCode = :dCode", { dCode: data?.code })
            .orderBy('master.TalukCode', 'ASC')
            .getRawMany();
        return findData;
    };

    async talukWiseHobli(data) {
        if (!data?.code) return { code: 400 };
        let findData = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.HobliCode as value', 'master.HobliName as name'])
            .where("master.TalukCode = :dCode", { dCode: data?.code })
            .orderBy('master.HobliCode', 'ASC').getRawMany();
        return findData;
    };

    async subWaterSheadInHobli(data) {
        if (!data?.code) return { code: 400 };
        let findData = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.SubWatershedCode as value', 'master.SubWatershedName as name'])
            .where("master.HobliCode = :dCode", { dCode: data?.code })
            .orderBy('master.SubWatershedCode', 'ASC').getRawMany();
        return findData;
    };

    async microWaterShedInSubWaterShed(data) {
        if (!data?.code) return { code: 400 };
        let findData = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.MicroWatershedCode as value', 'master.MicroWatershedName as name'])
            .where("master.SubWatershedCode = :dCode", { dCode: data?.code })
            .orderBy('master.MicroWatershedCode', 'ASC').getRawMany();
        return findData;
    };

    async schemeSelect(data) {
        let findData = await schemesRepo.createQueryBuilder('master').select(['DISTINCT master.SchemeCode as value', 'master.SchemeName as name'])
            .orderBy('master.SchemeName', 'ASC').getRawMany();
        return findData;
    };

    async sectorInSchemes(data) {
        if (!data?.code) return { code: 400 };
        let findData = await sectorsRepo.createQueryBuilder('master').select(['DISTINCT master.ActivityCode as value', 'master.SectorName as name'])
            .where("master.SchemeCode = :dCode", { dCode: data?.code })
            .orderBy('master.SectorName', 'ASC').getRawMany();
        return findData;
    };

    async activityInSector(data) {
        if (!data?.code) return { code: 400 };
        let findData = await activityRepo.createQueryBuilder('master').select(['DISTINCT master.ActivityCode as value', 'master.ActivityName as name'])
            .where("master.ActivityCode = :dCode", { dCode: data?.code }).getRawMany();
        return findData ?? [];
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
                newObject['District'] = eachIndex.DistrictName;
                newObject['Taluk'] = eachIndex.TalukName;
                newObject['Hobli'] = eachIndex.HobliName;
                newObject['villages'] = await mastersRepo.createQueryBuilder('master').select(['DISTINCT master.KGISVillageName as village'])
                    .where("master.HobliName = :dCode", { dCode: eachIndex.HobliName })
                    .orderBy('master.KGISVillageName', 'ASC')
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

    async addDepartment(data) {
        let existingData = await departmentsRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await departmentsRepo.save(newData);
    };

    async getDepartment(data) {
        return await departmentsRepo.find();
    };

    async getDropdownDepart() {
        return await departmentsRepo.createQueryBuilder('dd')
            .select(["dd.id as value", "dd.DepartmentName as name"])
            .getRawMany();
    };

    async getDropdownSchemes() {
        return await schemesRepo.createQueryBuilder('sc')
            .leftJoinAndSelect(Departments, 'dp', 'dp.id = sc.DepartmentId')
            .select(["sc.id as value", "CONCAT(sc.SchemeName,'-D-',dp.DepartmentName ) as name"])
            .getRawMany();
    };

    async getDropdownSectors() {
        return await sectorsRepo.createQueryBuilder('sc')
            .leftJoinAndSelect(Schemes, 'se', 'se.id = sc.SchemeId')
            .select(["sc.id as value", "CONCAT(sc.SectorName,'-SE-',se.SchemeName) as name"])
            .getRawMany();
    };

    async getDropdownActivty() {
        return await activityRepo.createQueryBuilder('sc')
            .leftJoinAndSelect(Sectors, 'sec', 'sec.id = sc.SectorId')
            .select(["sc.id as value", "CONCAT(sc.ActivityName,'-SEC-',sec.SectorName) as name"])
            .getRawMany();
    };

    async addschemes(data) {
        let existingData = await schemesRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await schemesRepo.save(newData);
    };

    async getSchemesData() {
        return await schemesRepo.createQueryBuilder('scheme')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = scheme.DepartmentId")
            .leftJoinAndSelect(Schemes, 'sc', 'sc.id = scheme.ParentId')
            .leftJoinAndSelect(Roles, 'rl', 'rl.id = scheme.RoleId')
            .select(["scheme.id as id", "scheme.Description as Description", "rl.RoleName as RoleName", "scheme.RoleId as RoleId",
                "scheme.SchemeName as SchemeName", "scheme.SchemeLogo as SchemeLogo", "scheme.ParentId as ParentId", 'sc.SchemeName as ParentName',
                "dp.DepartmentName as DepartmentName", "scheme.DepartmentId as DepartmentId"])
            .getRawMany();
    };

    async addSectors(data) {
        let existingData = await sectorsRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await sectorsRepo.save(newData);
    };

    async getSectorsData() {
        return await sectorsRepo.createQueryBuilder('sec')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = sec.DepartmentId")
            .leftJoinAndSelect(Sectors, 'sc', 'sc.id = sec.ParentId')
            .leftJoinAndSelect(Schemes, 'se', 'se.id = sec.SchemeId')
            .select(["sec.id as id", "sec.Description as Description", "se.SchemeName as SchemeName", "sec.SchemeId as SchemeId",
                "sec.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.ParentId as ParentId", 'sc.SectorName as ParentName',
                "dp.DepartmentName as DepartmentName", "sec.DepartmentId as DepartmentId"])
            .getRawMany();
    };

    async addRoleAccess(data) {
        let existingData = await roleAccessRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await roleAccessRepo.save(newData);
    };

    async getDropdownRoles() {
        return await rolesRepo.createQueryBuilder('sc')
            .select(["sc.id as value", "sc.RoleName as name"])
            .getRawMany();
    };


    async getChildAccess() {
        return await childRoleRepo.createQueryBuilder('la')
            .leftJoinAndSelect(Roles, 'lr', 'lr.id=la.RoleId')
            .leftJoinAndSelect(Roles, 'lr1', 'lr1.id=la.ChildId')
            .select(["la.id id", "lr.RoleName RoleName", 'lr.id RoleId', "lr1.RoleName ChildName", "la.ChildId ChildId"])
            .getRawMany();
    };

    async getChildBasedOnParent(data) {
        const { RoleId } = data;
        return await childRoleRepo.createQueryBuilder('rl')
            .leftJoinAndSelect(Roles, 'lr', "lr.id = rl.ChildId")
            .select(["lr.id as value", "lr.RoleName as name"])
            .where("rl.RoleId = :RoleId", { RoleId: RoleId })
            .getRawMany();

    };

    async assignChildAccess(data) {
        let getOneObj = await childRoleRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...getOneObj, ...data };
        return await childRoleRepo.save(newData);
    };

    async addRoles(data) {
        let existingData = await rolesRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await rolesRepo.save(newData);
    };

    async addQuestion(data) {
        let existingData = await questionsRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await questionsRepo.save(newData);
    };

    async addQuestionDropDownTypes(data) {
        let existingData = await questionDropdownTypesRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await questionDropdownTypesRepo.save(newData);
    };

    async getQuestionData() {
        return await questionsRepo.createQueryBuilder('qu')
            .select(["qu.id as id", "qu.Question as Question", "qu.QuestionId as QuestionId", "qu.QuestionType as QuestionType",
                "qu.DropDownValues as DropDownValues"])
            .getRawMany();
    };

    async getQuestionDataDropDownTypes() {
        return await questionDropdownTypesRepo.createQueryBuilder('qu')
            .select(["qu.id as id", "qu.DropdownName as DropdownName", "qu.DropdownType as DropdownType"])
            .getRawMany();
    };

    async getDropdownDropDownTypes() {
        return await questionDropdownTypesRepo.createQueryBuilder('sc')
            .select(["DISTINCT sc.DropdownType as value", "sc.DropdownType as name"])
            .getRawMany();
    };

    async getDropdownQuestions() {
        return await questionsRepo.createQueryBuilder('sc')
            .select(["sc.id as value", "sc.Question as name"])
            .getRawMany();
    };

    async getRolesDataAccess() {
        return await roleAccessRepo.createQueryBuilder('role')
            .leftJoinAndSelect(Roles, 'rl', "rl.id = role.RoleId")
            .select(["role.id as id", "rl.RoleName as RoleName", "role.RoleId as RoleId",
                "role.District as District", "role.Taluk as Taluk", "role.Hobli as Hobli",
                "role.Village as Village", "role.Type Type"])
            .getRawMany();
    };

    async getRolesData() {
        return await rolesRepo.createQueryBuilder('role')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = role.DepartmentId")
            .select(["role.id as id", "role.RoleName as RoleName",
                "dp.DepartmentName as DepartmentName", "role.DepartmentId as DepartmentId", "role.IsMobile as IsMobile"])
            .getRawMany();
    };

    async addActivity(data) {
        let existingData = await activityRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...existingData, ...data };
        return await activityRepo.save(newData);
    };

    async addMapping(data) {
        return await questionMappingRepo.save(data);
    };

    async editMappedQuestion(data) {
        let findValue = await questionMappingRepo.findOneBy({ id: Equal(data?.id) });
        let newData = { ...findValue, ...data };
        return await questionMappingRepo.save(newData);
    };

    async getMappedQuestion() {
        return await questionMappingRepo.createQueryBuilder('qm')
            .leftJoinAndSelect(Activity, 'ac', "ac.id = qm.ActivityId")
            .leftJoinAndSelect(Questions, 'qu', "qu.id = qm.QuestionId")
            .select(["qm.id as id", "ac.ActivityName as ActivityName", "qu.Question as Question", "ac.id as ActivityId", "qu.id as QuestionId",
                "qu.QuestionType as QuestionType"])
            .getRawMany();
    };

    async getActivityData() {
        return await activityRepo.createQueryBuilder('ac')
            .leftJoinAndSelect(Departments, 'dp', "dp.id = ac.DepartmentId")
            .leftJoinAndSelect(Activity, 'ac1', 'ac1.id = ac.ParentId')
            .leftJoinAndSelect(Sectors, 'sec', 'sec.id = ac.SectorId')
            .select(["ac.id as id", "ac.ActivityName as ActivityName", "ac.ParentId as ParentId", "ac.SectorId as SectorId", "sec.SectorName as SectorName",
                'ac1.ActivityName as ParentName', "dp.DepartmentName as DepartmentName", "ac.DepartmentId as DepartmentId", "ac.TypeOfWork TypeOfWork",
                "ac.TypeOfLand TypeOfLand", "ac.TypeOfStatus TypeOfStatus"])
            .getRawMany();
    };

    async checkUsername(user) {
        let check = await superAdminRepo.findOneBy({ Username: Equal(user) })
        return check;
    };

    async addSuperAdminData(data) {
        let check = await superAdminRepo.save(data);
        return check;
    };

    async assignmentProcess(data){
    if(!data?.id){
        await assignMastersHositoryRepo.save({...data, ...{Status: "Added"}})
        return await assignedMastersRepo.save(data);
      } else {
        let findData = await assignedMastersRepo.findOneBy({id: Equal(data?.id)});
        let newData = {...findData, ...data};
        await assignMastersHositoryRepo.save({...data, ...{Status: "Updated"}})
        return await assignedMastersRepo.save(newData);
      }
    };

    async assignToSurvey(data) {
        if (!data?.id) {
          data.UserId = generateUniqueId();
          await assignMastersHositoryRepo.save({ ...data, ...{ Status: "Added In Survey" } })
          return await userDataRepo.save(data);
        } else {
          let findData = await userDataRepo.findOneBy({ id: Equal(data?.id) });
          let newData = { ...findData, ...data };
          await assignMastersHositoryRepo.save({ ...data, ...{ Status: "Updated In Survey" } })
          return await userDataRepo.save(newData);
        }
      };

    async getDistrictsDD(data){
        return await masterDataRepo.createQueryBuilder('dd')
        .select(["DISTINCT dd.DistrictCode as value", "dd.DistrictName as name"])
        .orderBy("DistrictName", "DESC")
        .getRawMany();
      };
    
      async getAuthDistrictDD(data){
        const { Mobile, ListType } = data;
        return await masterDataRepo.createQueryBuilder('dd')
        .innerJoinAndSelect(AssignedMasters, 'am', 'am.DistrictCode=dd.DistrictCode')
        .select(["DISTINCT dd.DistrictCode as value", "dd.DistrictName as name"])
        .where("am.Mobile = :Mobile and am.ListType = :ListType", {Mobile, ListType})
        .getRawMany();
      };
      async getTalukDD(code){
        return await masterDataRepo.createQueryBuilder('tt')
        .select(["DISTINCT tt.TalukCode as value", "tt.TalukName as name"])
        .where("tt.DistrictCode = :dc", {dc: code})
        .getRawMany();
      };
      async getAuthTalukDD(data){
        const { Mobile, ListType} = data;
        return await masterDataRepo.createQueryBuilder('tt')
        .leftJoinAndSelect(AssignedMasters, 'am', 'am.TalukCode=tt.TalukCode and am.DistrictCode=tt.DistrictCode')
        .select(["DISTINCT tt.TalukCode as value", "tt.TalukName as name"])
        .where("am.Mobile = :Mobile and am.ListType = :ListType", {Mobile, ListType})
        .getRawMany();
      };
      
      async getHobliDD(UDCode, UTCode){
        return await masterDataRepo.createQueryBuilder('gd')
        .select(["DISTINCT gd.HobliCode as value", "gd.HobliName as name"])
        .where("gd.TalukCode = :tc and gd.DistrictCode = :dc", {tc: UTCode, dc: UDCode})
        .getRawMany();
      };
    
      async getAuthHobliDD(data){
        const { Mobile, ListType} = data;
        return await masterDataRepo.createQueryBuilder('gd')
        .innerJoinAndSelect(AssignedMasters, 'am', 'am.TalukCode=gd.TalukCode and am.DistrictCode=gd.DistrictCode and am.HobliCode=gd.HobliCode')
        .select(["DISTINCT gd.HobliCode as value", "gd.HobliName as name"])
        .where("am.Mobile = :Mobile and am.ListType = :ListType", {Mobile, ListType})
        .getRawMany();
      }
      async getVillagesDD(UDCode, UTCode, UHCode){
        return await masterDataRepo.createQueryBuilder('vd')
        .select(["DISTINCT vd.VillageCode as value", "vd.VillageName as name"])
        .where("vd.HobliCode = :hc and vd.DistrictCode = :dc and vd.TalukCOde = :tc", {hc: UHCode, dc: UDCode, tc: UTCode})
        .getRawMany();
      };

      async getAssignedData(data) {
        const { Mobile, ReqType, DataType } = data;
      let query = `execute assignedOfficersOrSurveyers @0,@1,@2`;
      return await AppDataSource.query(query, [ReqType, Mobile, DataType]);
    };

    async getAssignedDistricts() {
        return await assignedMastersRepo.createQueryBuilder('ta')
            .leftJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .leftJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode')
            .select(["DISTINCT md.DistrictName DistrictName", "ta.id id", "md.DistrictCode DistrictCode", "md.DistrictNameKA DistrictNameKA", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "District" })
            .getRawMany();
    };

    async getAssignedTaluk() {
        return await assignedMastersRepo.createQueryBuilder('ta')
            .innerJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode and md.TalukCode=ta.TalukCode')
            .select(["DISTINCT md.TalukName TalukName", "md.DistrictName DistrictName", "md.DistrictCode DistrictCode", "md.TalukCode TalukCode", "ta.id id", "md.TalukNameKA TalukNameKA", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "Taluk" })
            .getRawMany();
    };

    async getAssignedHobli() {
        return await assignedMastersRepo.createQueryBuilder('ta')
            .innerJoinAndSelect(Roles, 'rl', 'rl.id=ta.RoleId')
            .innerJoinAndSelect(MasterData, 'md', 'md.DistrictCode=ta.DistrictCode and md.TalukCode=ta.TalukCode and md.HobliCode=ta.HobliCode')
            .select(["DISTINCT md.HobliName HobliName", "md.HobliNameKA HobliNameKA", "md.TalukName TalukName", "md.DistrictName DistrictName", "md.DistrictCode DistrictCode", "md.HobliCode HobliCode", "md.TalukCode TalukCode", "ta.id id", "ta.Name Name", "ta.Mobile Mobile", "rl.id RoleId",
                "rl.RoleName RoleName", "ta.Type Type"])
            .where("ta.ListType = :ListType", { ListType: "Hobli" })
            .getRawMany();
    };

    async getAssignedVillage() {
        return await assignedMastersRepo.createQueryBuilder('ta')
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
            await dprsPrivateLandRepo.save(chunk);
        }
        return { code: 200, message: "Uploaded Successfully.", data: {} };
    }

    async uploadCommonLand(data) {
        let chunkSize = 50;
        for (let i = 0; i < data.length; i += chunkSize) {
            const chunk = data.slice(i, i + chunkSize);
            await dprsCommonLandRepo.save(chunk);
        }
        return { code: 200, message: "Uploaded Successfully.", data: {} };
    }

    async getDprsPrivateLand(data) {
        const { RowsPerPage, Page } = data;
        const offset = (Page - 1) * RowsPerPage;
        const [totalData, total] = await dprsPrivateLandRepo.findAndCount({
            take: RowsPerPage,
            skip: offset,
            order: {id: "ASC"}
          });
          return {total, totalData}
    }

    async getDprsCommonLand(data) {
        const { RowsPerPage, Page } = data;
        const offset = (Page - 1) * RowsPerPage;
        const [totalData, total] = await dprsCommonLandRepo.findAndCount({
            take: RowsPerPage,
            skip: offset,
            order: {id: "ASC"}
          });
          return {total, totalData}
        };

    async uploadImages(data) {
        const { ImageName, ImageData, UserId } = data;
        return await uploadImgAndVideoRepo.save({ ImageData, ImageName, RecordType: 'Image', UserId });
    }

    async getImage(id) {
        return await uploadImgAndVideoRepo.findOneBy({ id: Equal(id) })
    };

    
  async uploadDistrictMasters(data) {
    return await masterDataRepo.save(data);
  }
};