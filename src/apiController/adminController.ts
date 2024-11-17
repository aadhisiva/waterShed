import { Container, Service } from 'typedi';
import express from "express";
import { webAppResponse, webAppResponseForLarge } from '../utils/errorHandling';
import { AdminServices } from '../apiServices/adminServ';
import { authenticateToken } from '../utils/middlewares';
import { WEBMESSAGES, WEBPAGES } from '../utils/constants';
import * as XLSX from "xlsx";
import multer from "multer";
import fs from 'fs';
import { checkCommonXlsxKeysExistOrNot, checkXlsxKeysExistOrNot } from '../utils/resuableCode';

const adminRouter = express.Router()

const adminServices = Container.get(AdminServices);

interface ExcelData {
    [key: string]: string | number;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({storage});

const memoryStorage = multer.memoryStorage();
const uploadImage = multer({ storage: memoryStorage });

// adminRouter.post('/checkMobileLogin', async (req, res) => {
//     try {
//         let body = req.body;
//         let result = await adminServices.checkMobileLogin(body);
//         return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.SEND_OTP, req.user?.userid, req.user?.role);
//     } catch (error) {
//         return webAppResponse(res, error);
//     }
// });
adminRouter.post('/checkMobileLogin', async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.checkMobileLogin(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.SEND_OTP, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/getDataAccess', async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getDataAccess(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.SEND_OTP, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

// adminRouter.post('/assigningData', async (req, res) => {
//     try {
//         let body = req.body;
//         let result = await adminServices.assigningData(body);
//         return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.UPDATE, req.user?.userid, req.user?.role);
//     } catch (error) {
//         return webAppResponse(res, error);
//     }
// });

adminRouter.post('/verifyOtp', async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req?.user?.UserId}};
        let result = await adminServices.verifyOtp(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.VERIFY_OTP, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

/* *********** new apis ******** */
adminRouter.post('/departments', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.departments(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.DEPARTMENT, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetschemes', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetschemes(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.SCEHEMS, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetSectors', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        console.log("req.body", req.body);
        let result = await adminServices.addOrGetSectors(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.SECTORS, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetsActivity', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetsActivity(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ACTIVITY, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/getActivityDetails', async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getActivityDetails(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ACTIVITY, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetsCategory', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetsCategory(body);
        return webAppResponseForLarge(res, result, body, "Category", WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetRoles', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetRoles(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetRoleAccess', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetRoleAccess(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});


adminRouter.post('/assignChildAndGet',authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req?.user?.UserId}};
        let result = await adminServices.assignChildAndGet(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});


adminRouter.post('/getChildBasedOnParent',authenticateToken, async (req, res) => {
    try {
        let body = {...req.body, ...{UserId: req?.user?.UserId}};
        let result = await adminServices.getChildBasedOnParent(body);
        return webAppResponse(res, result, body, '/getChildBasedOnParent', WEBMESSAGES.GET_ALLDATA, req?.user?.UserId, req?.user?.RoleId);
    } catch (error) {
        return webAppResponse(res, error, req.body, '/getChildBasedOnParent', WEBMESSAGES.GET_ALLDATA, req?.user?.UserId, req?.user?.RoleId);
    };
});

adminRouter.post('/addOrGetRoles', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetRoles(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetQuestions', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetQuestions(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addOrGetQuestionDropDownTypes', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addOrGetQuestionDropDownTypes(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/mapQuestionOrUpdate', authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.mapQuestionOrUpdate(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.ROLES, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

// adminRouter.post("/superLogin", async (req, res) => {
//     try {
//         let body = req.body;
//         let result = await adminServices.superLogin(body);
//         return webAppResponseForLarge(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
//     } catch (error) {
//         return webAppResponse(res, error);
//     }
// });

adminRouter.post("/assignmentProcess", authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.assignmentProcess(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post("/getMasterDropDown", authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getMasterDropDown(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post("/getAssignedMasters", authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getAssignedMasters(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post("/uploadPrivateLand", upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        // Read the file
        // Use streams for handling large files
        const workbook = XLSX.readFile(file.path, { cellText: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: ''});
        let findError = checkXlsxKeysExistOrNot(jsonData[0]);
        if(findError.error){
            return res.send({code: 422, message: findError.message, data: {}});
        };
        // Convert data to strings if needed
        const convertedData: Partial<ExcelData>[] = jsonData.map((row: any) => {
            const convertedRow: Partial<ExcelData> = {};
            Object.keys(row).forEach((key) => {
                convertedRow[key] = String(row[key]);
            });
            return convertedRow;
        });
        let result = await adminServices.uploadPrivateLand(convertedData);
        // Clean up the uploaded file
        fs.unlinkSync(file.path);
        res.send(result)
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post("/uploadCommonLand", upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        // Read the file
        // Use streams for handling large files
        const workbook = XLSX.readFile(file.path, { cellText: false });
        const sheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' });
        let findError = checkCommonXlsxKeysExistOrNot(jsonData[0]);
        if(findError.error){
            return res.send({code: 422, message: findError.message, data: {}});
        };
        // Convert data to strings if needed
        const convertedData: Partial<ExcelData>[] = jsonData.map((row: any) => {
            const convertedRow: Partial<ExcelData> = {};
            Object.keys(row).forEach((key) => {
                convertedRow[key] = String(row[key]);
            });
            return convertedRow;
        });
        let result = await adminServices.uploadCommonLand(convertedData);
        // Clean up the uploaded file
        fs.unlinkSync(file.path);
        res.send(result)
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post("/getDprsLand", authenticateToken, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getDprsLand(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/uploadImage', uploadImage.single('image') ,authenticateToken, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        let body = {
             ImageName: req.file.originalname,
             ImageData: req.file.buffer,
             UserId: req.user.userid
        } 
        let result = await adminServices.uploadImages(body);
        return webAppResponseForLarge(res, result, req.file, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.GET_ALLDATA, req.user?.userid, req.user?.role);
    } catch (error) {
        return webAppResponse(res, error);
    };
});

adminRouter.get('/getImage/:id', async (req, res) => {
    try {
        const imageId = req.params.id;
        let result:any = await adminServices.getImage(imageId);
        res.setHeader('Content-Disposition', `inline; filename="${result.ImageName}"`);
        res.setHeader('Content-Type', 'image/png');
        res.send(result.ImageData);
    } catch (error) {
        return webAppResponse(res, error);
    };
});

adminRouter.post("/uplodMasters", upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        // Read the file
        // Use streams for handling large files
        const workbook = XLSX.readFile(file.path, { cellText: false });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: ''});
        // let findError = checkXlsxKeysExistOrNot(jsonData[0]);
        // if(findError.error){
        //     return res.send({code: 422, message: findError.message, data: {}});
        // };
        // Convert data to strings if needed
        const convertedData = jsonData.map((row) => {
            const convertedRow = {};
            Object.keys(row).forEach((key) => {
                convertedRow[key] = String(row[key]);
            });
            return convertedRow;
        });
        let result = await adminServices.uploadDistrictMasters(convertedData);
        // Clean up the uploaded file
        fs.unlinkSync(file.path);
        res.send(result)
    } catch (error) {
        return webAppResponse(res, error);
    }
});

export {
    adminRouter
};