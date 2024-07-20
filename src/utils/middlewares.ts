import { AppDataSource } from "../db/config";
import { loginData, superAdmin, Versions } from "../entities";
import { API_VERSION_ISSUE, SUPER_ADMIN } from "./constants";
import { generateCurrentTime, generateEOfTTime } from "./resuableCode";

export async function authVersion(req, res, next) {
    // Read the version from the request header
    const authVersion = req.headers["version"];
    if (!authVersion) return res.status(403).send({ code: 403, status: "Failed", message: "Api Version Not Provided." })
    let getVersion = await AppDataSource.getRepository(Versions).find();
    let checkVersion = authVersion == getVersion[0].Version;
    if (!checkVersion) return res.status(403).send({ code: 403, status: "Failed", message: API_VERSION_ISSUE });
    next();
};

export async function authTokenAndVersion(req, res, next) {
    // Read the JWT access token from the request header
    // const token = req.headers["token"];
    const UserId = req.headers["userid"];
    const UserRole = req.headers["role"];
    // const authVersion = req.headers["version"];
    if (!UserRole && !UserId) return res.status(403).send({ code: 403, status: "Failed", message: "Provide Valid Values." });
    // let getVersion = await AppDataSource.getRepository(Versions).find();
    // let checkVersion = authVersion == getVersion[0]?.Version;
    // if (!checkVersion) return res.status(403).send({ code: 403, status: "Failed", message: API_VERSION_ISSUE });
    // let getUser = await AppDataSource.getRepository(loginData).findOneBy({ UserId });
    // Verify the token
    // let verifyToken = getUser?.TokenExpirationTime == generateCurrentTime();
    // if (!verifyToken) {
    //     return res.status(403).send({ code: 403, message: "PLease Login Again" }); // Return 403 if there is an error verifying
    // }
    next();
};

export async function webAuthTokenAndVersion(req, res, next) {
    // Read the JWT access token from the request header
    const UserRole = req.headers["role"];
    const token = req.headers["token"];
    const UserId = req.headers["userid"];
    const authVersion = req.headers["version"];
    if (!UserRole && !authVersion && !token && !UserId) return res.status(403).send({ code: 403, status: "Failed", message: "Provide Valid Values." });
    let getVersion = await AppDataSource.getRepository(Versions).find();
    let checkVersion = authVersion == getVersion[0].WebVersion;
    if (!checkVersion) return res.status(403).send({ code: 403, status: "Failed", message: API_VERSION_ISSUE });
    let getUser = await AppDataSource.getRepository(UserRole == SUPER_ADMIN ? superAdmin : loginData).findOneBy({ UserId });
    // Verify the token 
    let verifyToken = (getUser?.WebToken == token) && getUser?.WebTokenExpirationTime == generateCurrentTime();
    if (!verifyToken) {
        return res.status(403).send({ code: 403, message: "Please Login Again" }); // Return 403 if there is an error verifying
    }
    next();
};