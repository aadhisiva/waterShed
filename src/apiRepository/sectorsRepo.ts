import { Service } from 'typedi';
import { AppDataSource } from '../db/config';
import { Activity, Category, Schemes, Sectors, SubActivity, SubSchemes, formats } from '../entities';
import { YES } from '../utils/constants';
import { Equal } from 'typeorm';

@Service()
export class SectorRepo {

    async getSchemes(data) {
        const { UserId, UserRole } = data;
        if (!UserRole) return { code: 400 };
        let schemesJson = await AppDataSource.getRepository(Schemes).createQueryBuilder('scheme').
            select(['scheme.SchemeName as SchemeName, scheme.SchemeCode as SchemeCode']).getRawMany()
        let promiseRes = await new Promise(async (resolve, reject) => {
            let newArray = [];
            const schemesLength = schemesJson.length;
            for (let i = 0; i < schemesLength; i++) {
                let eachScheme = schemesJson[i];
                eachScheme['SectorsJson'] = [];
                let newObj = {
                    ...eachScheme,
                    SectorsJson: await AppDataSource.getRepository(Sectors).createQueryBuilder('sector').
                        select([`sector.SectorName as SectorName,sector.IsSubScheme as IsSubScheme, sector.IsCategory as IsCategory,
                    sector.IsActivity as IsActivity,sector.IsSubActivity as IsSubActivity,sector.ActivityCode as ActivityCode,
                    sector.SubSchemeCode as SubSchemeCode,sector.SubActivityCode as SubActivityCode,sector.CategoryCode as CategoryCode`])
                        .where("sector.SchemeCode =:code and sector.UserRole = :UserRole", { code: eachScheme.SchemeCode, UserRole: UserRole }).getRawMany()
                }
                if(newObj?.SectorsJson?.length == 0) break;  
                newArray.push(newObj);
            };
            resolve(newArray);
        });
        return promiseRes;
    };

    async codeWiseJsonFormate(data) {
        const { ActivityCode, SubSchemeCode, CategoryCode, SubActivityCode } = data;
        return await new Promise(async (resolve, reject) => {
            if (ActivityCode) {
                let newArray = [];
                let schemesJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                    select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                    .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: ActivityCode }).getRawMany()
                let schemesLength = schemesJson.length;
                for (let i = 0; i < schemesLength; i++) {
                    schemesJson[i]['SubActivityJson'] = [];
                    if (schemesJson[i].IsSubActivity == YES) {
                        let newObj = {
                            ...schemesJson[i],
                            SubActivityJson: await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: schemesJson[i].SubActivityCode } })
                        }
                        newArray.push(newObj);
                    }
                    newArray.push(schemesJson[i])
                };
                resolve(newArray);
            } else if (SubSchemeCode) {
                let newArray = [];
                let SubSchemesJson = await AppDataSource.getRepository(SubSchemes).find({ where: { SubSchemeCode: SubSchemeCode } });
                let SubSchemesLength = SubSchemesJson.length;
                for (let i = 0; i < SubSchemesLength; i++) {
                    let eachObj = SubSchemesJson[i];
                    eachObj['activityJson'] = [];
                    eachObj['subActivityJson'] = [];
                    let newSubScheme = {
                        ...eachObj,
                        categoryJson: []
                    }
                    // catergory process
                    if (eachObj.IsCategory == YES) {
                        // let categoryJson = await AppDataSource.getRepository(Category).find({ where: { CategoryCode: eachObj.CategoryCode } });
                        let categoryJson = await AppDataSource.getRepository(Category).createQueryBuilder('Category').
                            select([`Category.CategoryName as CategoryName,Category.CategoryCode as CategoryCode,Category.SectorCode as SectorCode,Category.IsActivity as IsActivity,Category.IsSubActivity as IsSubActivity,Category.ActivityCode as ActivityCode,Category.SubActivityCode as SubActivityCode`])
                            .where("Category.CategoryCode =:CategoryCode", { CategoryCode: eachObj.CategoryCode }).getRawMany()
                        let categoriesLength = categoryJson.length;
                        for (let j = 0; j < categoriesLength; j++) {
                            let eachCategory = categoryJson[j];
                            eachCategory['subActivityJson'] = [];
                            let newCategory = {
                                ...eachCategory,
                                activityJson: []
                            }
                            // activity process
                            if (eachObj.IsActivity == YES) {
                                // let activityJson = await AppDataSource.getRepository(Activity).find({ where: { ActivityCode: eachCategory.ActivityCode } });
                                let activityJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                                    select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                                Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                                Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                                    .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: eachCategory.ActivityCode }).getRawMany()
                                let activityLength = activityJson.length;
                                for (let k = 0; k < activityLength; k++) {
                                    let eachActivity = activityJson[k];
                                    if (eachActivity.IsSubActivity == YES) {
                                        let newActivityObj = {
                                            ...eachActivity,
                                            // SubActivityJson: await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: eachActivity.SubActivityCode } })
                                            SubActivityJson: await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                                                select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                                        SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                                        SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                                                .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachActivity.SubActivityCode }).getRawMany()
                                        }
                                        newCategory.activityJson.push(newActivityObj);
                                    } else {
                                        newCategory.activityJson.push(eachActivity);
                                    }
                                }
                            } else if (eachObj.IsSubActivity == YES) {
                                // let SubActivityJson = await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: eachObj.SubActivityCode } });
                                let SubActivityJson = await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                                    select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                        SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                        SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                                    .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachObj.SubActivityCode }).getRawMany()
                                newSubScheme['subActivityJson'].push(SubActivityJson);
                            }
                        }
                        newArray.push(newSubScheme)
                    } else if (eachObj.IsActivity == YES) {
                        // let activityJson = await AppDataSource.getRepository(Activity).find({ where: { ActivityCode: eachObj.ActivityCode } });
                        let activityJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                            select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                                Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                                Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                            .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: eachObj.ActivityCode }).getRawMany()
                        let activityLength = activityJson.length;
                        for (let k = 0; k < activityLength; k++) {
                            let eachActivity = activityJson[k];
                            eachActivity['subActivityJson'] = [];
                            if (eachActivity.IsSubActivity == YES) {
                                let newActivityObj = {
                                    ...eachActivity,
                                    SubActivityJson: await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                                        select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                                    SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                                    SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                                        .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachActivity.SubActivityCode }).getRawMany()

                                }
                                newArray['activityJson'].push(newActivityObj);
                            } else {
                                newArray['activityJson'].push(eachActivity);
                            }
                        }
                    } else if (eachObj.IsSubActivity == YES) {
                        // let SubActivityJson = await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: eachObj.SubActivityCode } });
                        let SubActivityJson = await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                            select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                        SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                        SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                            .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachObj.SubActivityCode }).getRawMany()
                        newArray['categoryJson'].push([]);
                        newArray['activityJson'].push([]);
                        newArray['subActivityJson'].push(SubActivityJson);
                    }
                }
                resolve(newArray);
            } else if (CategoryCode) {
                let newArray = [];
                // let categoryJson = await AppDataSource.getRepository(Category).find({ where: { CategoryCode: CategoryCode } });
                let categoryJson = await AppDataSource.getRepository(Category).createQueryBuilder('Category').
                    select([`Category.CategoryName as CategoryName,Category.CategoryCode as CategoryCode,Category.SectorCode as SectorCode,Category.IsActivity as IsActivity,Category.IsSubActivity as IsSubActivity,Category.ActivityCode as ActivityCode,Category.SubActivityCode as SubActivityCode`])
                    .where("Category.CategoryCode =:CategoryCode", { CategoryCode: CategoryCode }).getRawMany()
                let categoriesLength = categoryJson.length;
                for (let j = 0; j < categoriesLength; j++) {
                    let eachCategory = categoryJson[j];
                    eachCategory['activityJson'] = [];
                    eachCategory['subActivityJson'] = [];
                    let newCategory = {
                        ...eachCategory,
                        activityJson: []
                    };
                    // activity process
                    if (eachCategory.IsActivity == YES) {
                        // let activityJson = await AppDataSource.getRepository(Activity).find({ where: { ActivityCode: eachCategory.ActivityCode } });
                        let activityJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                            select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                        Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                        Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                            .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: eachCategory.ActivityCode }).getRawMany()
                        let activityLength = activityJson.length;
                        for (let k = 0; k < activityLength; k++) {
                            let eachActivity = activityJson[k];
                            if (eachActivity.IsSubActivity == YES) {
                                let newActivityObj = {
                                    ...eachActivity,
                                    // SubActivityJson: await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: eachActivity.SubActivityCode } })
                                    SubActivityJson: await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                                        select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                                    SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                                    SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                                        .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachActivity.SubActivityCode }).getRawMany()
                                }
                                newCategory.activityJson.push(newActivityObj);
                            } else {
                                newCategory.activityJson.push(eachActivity);
                            }
                        };
                        newArray.push(newCategory);
                    } else if (eachCategory.IsSubActivity == YES) {
                        // let SubActivityJson = await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: eachCategory.SubActivityCode } });
                        let SubActivityJson = await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                            select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                        SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                        SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                            .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachCategory.SubActivityCode }).getRawMany()
                        newCategory['subActivityJson'].push(SubActivityJson);
                    }
                }
                resolve(newArray);
            } else if (SubActivityCode) {
                let newArray = [];
                newArray['categoryJson'].push([]);
                newArray['subSchemeJson'].push([]);
                newArray['activityJson'].push([]);
                // let SubActivityJson = await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: SubActivityCode } });
                let SubActivityJson = await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                    select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                        SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                        SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                    .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: SubActivityCode }).getRawMany()
                newArray['subActivityJson'].push(SubActivityJson);
                resolve(newArray);
            }
        })
    };

    async caterGoryOrActivity(data) {
        const { ActivityCode, SubSchemeCode, CategoryCode, SubActivityCode } = data;
        return await new Promise(async (resolve, reject) => {
            if (ActivityCode) {
                let schemesJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                    select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                    .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: ActivityCode }).getRawMany()
                resolve(schemesJson);
            } else if (SubSchemeCode) {
                let newArray = [];
                let SubSchemesJson = await AppDataSource.getRepository(SubSchemes).find({ where: { SubSchemeCode: SubSchemeCode } });
                let SubSchemesLength = SubSchemesJson.length;
                for (let i = 0; i < SubSchemesLength; i++) {
                    let eachObj = SubSchemesJson[i];
                    eachObj['activityJson'] = [];
                    let newSubScheme = {
                        ...eachObj,
                        categoryJson: []
                    }
                    // catergory process
                    if (eachObj.IsCategory == YES) {
                        // let categoryJson = await AppDataSource.getRepository(Category).find({ where: { CategoryCode: eachObj.CategoryCode } });
                        let categoryJson = await AppDataSource.getRepository(Category).createQueryBuilder('Category').
                            select([`Category.CategoryName as CategoryName,Category.CategoryCode as CategoryCode,Category.SectorCode as SectorCode,Category.IsActivity as IsActivity,Category.IsSubActivity as IsSubActivity,Category.ActivityCode as ActivityCode,Category.SubActivityCode as SubActivityCode`])
                            .where("Category.CategoryCode =:CategoryCode", { CategoryCode: eachObj.CategoryCode }).getRawMany()
                        let categoriesLength = categoryJson.length;
                        for (let j = 0; j < categoriesLength; j++) {
                            let eachCategory = categoryJson[j];
                            let newCategory = {
                                ...eachCategory,
                                activityJson: []
                            }
                            // activity process
                            if (eachObj.IsActivity == YES) {
                                // let activityJson = await AppDataSource.getRepository(Activity).find({ where: { ActivityCode: eachCategory.ActivityCode } });
                                newCategory.activityJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                                    select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                                Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                                Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                                    .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: eachCategory.ActivityCode }).getRawMany()
                            } 
                                newSubScheme['activityJson'].push(newCategory);
                        }
                        newArray.push(newSubScheme)
                    } else if (eachObj.IsActivity == YES) {
                        // let activityJson = await AppDataSource.getRepository(Activity).find({ where: { ActivityCode: eachObj.ActivityCode } });
                        newSubScheme['activityJson'] = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                            select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                                Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                                Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                            .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: eachObj.ActivityCode }).getRawMany()
                        newArray.push(newSubScheme);   
                    }
                }
                resolve(newArray);
            } else if (CategoryCode) {
                let newArray = [];
                // let categoryJson = await AppDataSource.getRepository(Category).find({ where: { CategoryCode: CategoryCode } });
                let categoryJson = await AppDataSource.getRepository(Category).createQueryBuilder('Category').
                    select([`Category.CategoryName as CategoryName,Category.CategoryCode as CategoryCode,Category.SectorCode as SectorCode,Category.IsActivity as IsActivity,Category.IsSubActivity as IsSubActivity,Category.ActivityCode as ActivityCode,Category.SubActivityCode as SubActivityCode`])
                    .where("Category.CategoryCode =:CategoryCode", { CategoryCode: CategoryCode }).getRawMany()
                let categoriesLength = categoryJson.length;
                for (let j = 0; j < categoriesLength; j++) {
                    let eachCategory = categoryJson[j];
                    eachCategory['activityJson'] = [];
                    eachCategory['subActivityJson'] = [];
                    let newCategory = {
                        ...eachCategory,
                        activityJson: []
                    };
                    // activity process
                    if (eachCategory.IsActivity == YES) {
                        // let activityJson = await AppDataSource.getRepository(Activity).find({ where: { ActivityCode: eachCategory.ActivityCode } });
                        newCategory.activityJson = await AppDataSource.getRepository(Activity).createQueryBuilder('Activity').
                            select([`Activity.ActivityName as ActivityName, Activity.CategoryCode as CategoryCode, Activity.SectorCode as SectorCode,
                        Activity.SubSchemeCode as SubSchemeCode,Activity.IsSubActivity as IsSubActivity,Activity.ActivityCode as ActivityCode,
                        Activity.FormateType as FormateType,Activity.SubActivityCode as SubActivityCode,Activity.TypeOfPerson as TypeOfPerson, Activity.TypeOfWork as TypeOfWork`])
                            .where("Activity.ActivityCode =:ActivityCode", { ActivityCode: eachCategory.ActivityCode }).getRawMany()
                        // let activityLength = activityJson.length;
                        // for (let k = 0; k < activityLength; k++) {
                        //     let eachActivity = activityJson[k];
                        //     if (eachActivity.IsSubActivity == YES) {
                        //         let newActivityObj = {
                        //             ...eachActivity,
                        //             // SubActivityJson: await AppDataSource.getRepository(SubActivity).find({ where: { SubActivityCode: eachActivity.SubActivityCode } })
                        //             SubActivityJson: await AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                        //                 select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                        //             SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                        //             SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                        //                 .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: eachActivity.SubActivityCode }).getRawMany()
                        //         }
                        //         newCategory.activityJson.push(newActivityObj);
                        //     } else {
                        //         newCategory.activityJson.push(eachActivity);
                        //     }
                        // };
                        newArray.push(newCategory);
                    }
                }
                resolve(newArray);
            }
        })
    };

    async subActivityJson(data) {
        const { SubActivityCode } = data;
        if(!SubActivityCode) return {code: 400};
        return await new Promise(async (resolve, reject) => {
                 let result = AppDataSource.getRepository(SubActivity).createQueryBuilder('SubActivity').
                    select([`SubActivity.SubActivityName as SubActivityName, SubActivity.CategoryCode as CategoryCode, SubActivity.SectorCode as SectorCode,
                        SubActivity.SubSchemeCode as SubSchemeCode,SubActivity.ActivityCode as ActivityCode,
                        SubActivity.FormateType as FormateType,SubActivity.SubActivityCode as SubActivityCode,SubActivity.TypeOfPerson as TypeOfPerson, SubActivity.TypeOfWork as TypeOfWork`])
                    .where("SubActivity.SubActivityCode =:SubActivityCode", { SubActivityCode: SubActivityCode }).getRawMany()
                    resolve(result);
                });
    };

    async saveShemes(data) {
        return await AppDataSource.getRepository(Schemes).save(data);
    };

    async saveSectors(data) {
        if (data.IsActivity == YES) {
            data.ActivityCode = 'SC' + new Date().getTime();
        } else if (data.IsSubScheme == YES) {
            data.SubSchemeCode = 'SC' + new Date().getTime();
        } else if (data.IsSubActivity == YES) {
            data.SubActivityCode = 'SC' + new Date().getTime();
        } else if (data.IsCategory == YES) {
            data.CategoryCode = 'SC' + new Date().getTime();
        }
        return await AppDataSource.getRepository(Sectors).save(data);
    }
    async saveCategory(data) {
        if (data.IsActivity == YES) {
            data.ActivityCode = 'CA' + new Date().getTime();
        } else if (data.IsSubActivity == YES) {
            data.SubActivityCode = 'CA' + new Date().getTime();
        }
        return await AppDataSource.getRepository(Category).save(data);
    }
    async saveActivity(data) {
        if (data.IsSubActivity == YES) {
            data.SubActivityCode = 'AC' + new Date().getTime();
        }
        data.TypeOfRefractionist = JSON.stringify(data.TypeOfRefractionist);
        data.TypeOfWork = JSON.stringify(data.TypeOfWork)
        return await AppDataSource.getRepository(Activity).save(data);
    }
    async saveSubActivity(data) {
        data.TypeOfRefractionist = JSON.stringify(data.TypeOfRefractionist);
        data.TypeOfWork = JSON.stringify(data.TypeOfWork)
        return await AppDataSource.getRepository(SubActivity).save(data);
    }
    async saveQuestions(data: formats) {
        data.QuestionValues = JSON.stringify(data.QuestionValues);
        return await AppDataSource.getRepository(formats).save(data);
    }
    async getQuestions(data: formats) {
        const { formateType, TypeOfPerson } = data;
        if (!formateType || !TypeOfPerson) return { code: 400 };
        // data.QuestionValues = JSON.stringify(data.QuestionValues);
        return await AppDataSource.getRepository(formats).findBy({ formateType, TypeOfPerson });
    }
}