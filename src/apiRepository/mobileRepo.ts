import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { Activity, loginData, masterData, Roles, RolesAccess, Schemes, Sectors, UploadImgAndVideo, Versions } from '../entities';
import { Equal } from 'typeorm';


const loginDataRepo = AppDataSource.getRepository(loginData);
const mastersRepo = AppDataSource.getRepository(masterData);
const schemesRepo = AppDataSource.getRepository(Schemes);
const sectorsRepo = AppDataSource.getRepository(Sectors);
const activityRepo = AppDataSource.getRepository(Activity);
const rolesAccessRepo = AppDataSource.getRepository(RolesAccess);
const rolesRepo = AppDataSource.getRepository(Roles);
const uploadImgAndVideoRepo = AppDataSource.getRepository(UploadImgAndVideo);
@Service()
export class MobileRepo {

    async saveLogin(data: loginData) {
        return await loginDataRepo.save(data);
    };

    async getVersionOfApp() {
        return await AppDataSource.getRepository(Versions).find();
    };

    async sendOtp(data: loginData) {
        const { Mobile, RoleId } = data;
        let loginDb = await AppDataSource.getRepository(loginData);
        let findData = await loginDb.findOneBy({ Mobile, RoleId });
        if (!findData) return { code: 404 };
        let newData = { ...findData, ...data };
        return await loginDb.save(newData);
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
                if(!eachIndex.DistrictName) break;
                newObject['District'] = eachIndex.DistrictName;
                newObject['Taluk'] = eachIndex.TalukName;
                if(!eachIndex.HobliName) break;
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

    async saveActualData(data){
        let savingData = await "waterShedRepo";
        return savingData;
    }

    async getAllSchemes(data){
        let savingData = await schemesRepo.createQueryBuilder('scheme')
        .select(["scheme.SchemeName as SchemeName", "scheme.SchemeLogo as SchemeLogo", "scheme.id as SchemeId"])
        .where("scheme.RoleId = :RoleId", {RoleId: data?.RoleId})
        .getRawMany();
        return savingData;
    };

    async getAllRoles(){
        let savingData = await rolesRepo.createQueryBuilder('role')
        .select(["role.RoleName as RoleName", "role.id as RoleId"])
        .getRawMany();
        return savingData;
    };

    async getSectors(data){
        let savingData = await sectorsRepo.createQueryBuilder('sec')
        .select(["sec.SectorName as SectorName", "sec.SectorLogo as SectorLogo", "sec.id as SectorId"])
        .where("sec.SchemeId = :SchemeId", {SchemeId: data?.SchemeId})
        .getRawMany();
        return savingData;
    };

    async getActivity(data){
        let newArray = [];
        let activityData = await activityRepo.createQueryBuilder('ac')
        .select(["ac.ActivityName as ActivityName", "ac.id as ActivityId"])
        .where("ac.SectorId = :SectorId and ac.ParentId = :ParentId", {SectorId: data?.SectorId, ParentId: '-1'})
        .getRawMany();
        let activityDataLength = activityData.length;
        for (let i = 0; i < activityDataLength; i++) {
            let eachActitivy = activityData[i];
            eachActitivy['SubActivity'] = await activityRepo.createQueryBuilder('ac')
            .select(["ac.ActivityName as ActivityName", "ac.id as SubActivityId"])
            .where("ac.ParentId = :ParentId", {ParentId: eachActitivy.ParentId})
            .getRawMany();
            newArray.push(eachActitivy);
        }
        return newArray;
    };

  async uploadImages(name, data) {
    return await uploadImgAndVideoRepo.save({ImageData: name, ImageName: data, RecordType: 'Image'})
  }

  async getImage(id) {
    return await uploadImgAndVideoRepo.findOneBy({id: Equal(id)})
  }

  async uploadVideos(name, data) {
    return await uploadImgAndVideoRepo.save({ImageData: name, ImageName: data, RecordType: 'Video'})
  }

  async getVideo(id) {
    return await uploadImgAndVideoRepo.findOneBy({id: Equal(id)})
  }

};