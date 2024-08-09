import { Container, Service } from 'typedi';
import express from "express";
import { webAppResponse, webAppResponseForLarge } from '../utils/errorHandling';
import { AdminServices } from '../apiServices/adminServ';
import { authenticateToken, webAuthTokenAndVersion } from '../utils/middlewares';
import { WEBMESSAGES, WEBPAGES } from '../utils/constants';
import * as XLSX from "xlsx";
import multer from "multer";
import fs from 'fs';
import path from 'path';
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


adminRouter.post('/sendOtp', async (req, res) => {
    try {
        let body = req.body;
        body.userUniqueId = req.headers["userid"]
        let result = await adminServices.sendOtp(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.SEND_OTP, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addUser', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addUser(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.ADDED, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/addSuperAdmin', async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.addSuperAdmin(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.ADDED, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/allUsersData', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.allUsersData(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/assigningData', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.assigningData(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.UPDATE, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/verifyOtp', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.verifyOtp(body);
        return webAppResponse(res, result, body, WEBPAGES.LOGIN_PAGE, WEBMESSAGES.VERIFY_OTP, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/getSchemes', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.getSchemes(body);
        return webAppResponse(res, result, body, WEBPAGES.SCEHEMS, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/allDistricts', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.allDistricts(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/districtWiseTaluk', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.districtWiseTaluk(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/talukWiseHobli', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.talukWiseHobli(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/subWaterSheadInHobli', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.subWaterSheadInHobli(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/microWaterShedInSubWaterShed', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.microWaterShedInSubWaterShed(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/schemeSelect', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.schemeSelect(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/sectorInSchemes', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        body.UserRole = req.headers["role"]
        let result = await adminServices.sectorInSchemes(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});
adminRouter.post('/activityInSector', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.activityInSector(body);
        return webAppResponse(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
    } catch (error) {
        return webAppResponse(res, error);
    }
});

adminRouter.post('/locations', webAuthTokenAndVersion, async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.locations(body);
        return webAppResponseForLarge(res, result, body, WEBPAGES.USER_MANAGEMENT, WEBMESSAGES.GET_ALLDATA, req.headers["userid"], req.headers["role"]);
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

adminRouter.post("/superLogin", async (req, res) => {
    try {
        let body = req.body;
        let result = await adminServices.superLogin(body);
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

adminRouter.post("/getDprsLand", async (req, res) => {
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


export {
    adminRouter
};