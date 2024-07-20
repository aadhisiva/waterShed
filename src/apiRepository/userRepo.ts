import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { loginData, masterData, Versions, WaterShedData } from '../entities';


const loginDataRepo = AppDataSource.getRepository(loginData);
const mastersRepo = AppDataSource.getRepository(masterData);
const waterShedRepo = AppDataSource.getRepository(WaterShedData);
@Service()
export class UserRepo {

    async saveLogin(data: loginData) {
        let loginDb = await AppDataSource.getRepository(loginData);
        return await loginDb.save(data);
    };

    async getVersionOfApp() {
        return await AppDataSource.getRepository(Versions).find();
    };

    async sendOtp(data: loginData) {
        const { Mobile, UserRole } = data;
        let loginDb = await AppDataSource.getRepository(loginData);
        let findData = await loginDb.findOneBy({ Mobile, UserRole });
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
        let savingData = await waterShedRepo.save(data);
        return savingData;
    }

};