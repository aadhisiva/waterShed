import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { Activity, Departments, loginData, masterData, Roles, Schemes, Sectors, superAdmin, UserData, Versions } from '../entities';
import { SUPER_ADMIN } from '../utils/constants';
import { Equal } from 'typeorm';


let superAdminRepo = AppDataSource.getRepository(superAdmin);
let loginDataRepo = AppDataSource.getRepository(loginData);
let schemesRepo = AppDataSource.getRepository(Schemes);
let versionRepo = AppDataSource.getRepository(Versions);
let mastersRepo = AppDataSource.getRepository(masterData);
let sectorsRepo = AppDataSource.getRepository(Sectors);
let activityRepo = AppDataSource.getRepository(Activity);
let departmentsRepo = AppDataSource.getRepository(Departments);
let rolesRepo = AppDataSource.getRepository(Roles);
let userDataRepo = AppDataSource.getRepository(UserData);

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

    async allDistricts(data: masterData) {
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
        console.log("data", data)
        let findData = await sectorsRepo.createQueryBuilder('master').select(['DISTINCT master.ActivityCode as value', 'master.SectorName as name'])
            .where("master.SchemeCode = :dCode", { dCode: data?.code })
            .orderBy('master.SectorName', 'ASC').getRawMany();
        return findData;
    };

    async activityInSector(data) {
        if (!data?.code) return { code: 400 };
        console.log("data?.code",data)
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

    async addDepartment(data){
        let existingData = await departmentsRepo.findOneBy({id: Equal(data?.id)});
        let newData = {...existingData, ...data};
        return await departmentsRepo.save(newData);
    };

    async getDepartment(data){
        return await departmentsRepo.find();
    };

    async getDropdownDepart(){
        return await departmentsRepo.createQueryBuilder('dd')
        .select(["dd.id as value", "dd.DepartmentName as name"])
        .getRawMany();
    };

    async getDropdownSchemes(){
        return await schemesRepo.createQueryBuilder('sc')
        .select(["sc.id as value", "sc.SchemeName as name"])
        .getRawMany();
    };

    async getDropdownSectors(){
        return await sectorsRepo.createQueryBuilder('sc')
        .select(["sc.id as value", "sc.SectorName as name"])
        .getRawMany();
    };

    async getDropdownActivty(){
        return await activityRepo.createQueryBuilder('sc')
        .select(["sc.id as value", "sc.ActivityName as name"])
        .getRawMany();
    };

    async addschemes(data){
        let existingData = await schemesRepo.findOneBy({id: Equal(data?.id)});
        let newData = {...existingData, ...data};
        return await schemesRepo.save(newData);
    };

    async getSchemesData(){
            return await schemesRepo.createQueryBuilder('scheme')
                .leftJoinAndSelect(Departments, 'dp', "dp.id = scheme.DepartmentId")
                .leftJoinAndSelect(Schemes, 'sc', 'sc.id = scheme.ParentId')
                .select(["scheme.id as id",  "scheme.Description as Description", 
                "scheme.SchemeName as SchemeName","scheme.SchemeLogo as SchemeLogo", "scheme.ParentId as ParentId", 'sc.SchemeName as ParentName', 
                "dp.DepartmentName as DepartmentName", "scheme.DepartmentId as DepartmentId"])
                .getRawMany();
    };

    async addSectors(data){
        let existingData = await sectorsRepo.findOneBy({id: Equal(data?.id)});
        let newData = {...existingData, ...data};
        return await sectorsRepo.save(newData);
    };

    async getSectorsData(){
            return await sectorsRepo.createQueryBuilder('sec')
                .leftJoinAndSelect(Departments, 'dp', "dp.id = sec.DepartmentId")
                .leftJoinAndSelect(Sectors, 'sc', 'sc.id = sec.ParentId')
                .select(["sec.id as id",  "sec.Description as Description", 
                "sec.SectorName as SectorName","sec.SectorLogo as SectorLogo", "sec.ParentId as ParentId", 'sc.SectorName as ParentName', 
                "dp.DepartmentName as DepartmentName", "sec.DepartmentId as DepartmentId"])
                .getRawMany();
    };

    async addRoles(data){
        let existingData = await rolesRepo.findOneBy({id: Equal(data?.id)});
        let newData = {...existingData, ...data};
        return await rolesRepo.save(newData);
    };

    async getRolesData(){
            return await rolesRepo.createQueryBuilder('role')
                .leftJoinAndSelect(Departments, 'dp', "dp.id = role.DepartmentId")
                .select(["role.id as id",  "role.RoleName as RoleName", 
                "role.District as District","role.Taluk as Taluk", "role.Hobli as Hobli", "dp.DepartmentName as DepartmentName", 
                "role.Village as Village", "role.DepartmentId as DepartmentId"])
                .getRawMany();
    };

    async addActivity(data){
        let existingData = await activityRepo.findOneBy({id: Equal(data?.id)});
        let newData = {...existingData, ...data};
        return await activityRepo.save(newData);
    };

    async getActivityData(){
        return await activityRepo.createQueryBuilder('ac')
        .leftJoinAndSelect(Departments, 'dp', "dp.id = ac.DepartmentId")
        .leftJoinAndSelect(Activity, 'ac1', 'ac1.id = ac.ParentId')
        .select(["ac.id as id", "ac.ActivityName as ActivityName", "ac.ParentId as ParentId", 
            'ac1.ActivityName as ParentName', "dp.DepartmentName as DepartmentName", "ac.DepartmentId as DepartmentId"])
        .getRawMany();
    };

    async checkUsername(user){
        let check = await superAdminRepo.findOneBy({Username: Equal(user)})
        return check;
    };

    async addSuperAdminData(data){
        let check = await superAdminRepo.save(data);
        return check;
    };
};