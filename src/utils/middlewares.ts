import { repository } from "../db/repos";
import { API_VERSION_ISSUE } from "./constants";
import { response401, response403 } from "./resBack";
import jwt from "jsonwebtoken";

export async function authVersion(req, res, next) {
    // Read the version from the request header
    const authVersion = req.headers["version"];
    if (!authVersion) return res.status(403).send({ code: 403, status: "Failed", message: "Api Version Not Provided." })
    let getVersion = await repository.versionRepo.find();
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

// export async function webAuthTokenAndVersion(req, res, next) {
//     // Read the JWT access token from the request header
//     const UserRole = req.headers["role"];
//     const token = req.headers["token"];
//     const UserId = req.headers["userid"];
//     const authVersion = req.headers["version"];
//     if (!UserRole && !authVersion && !token && !UserId) return res.status(403).send({ code: 403, status: "Failed", message: "Provide Valid Values." });
//     let getVersion = await versionRepo.find();
//     let checkVersion = authVersion == getVersion[0].WebVersion;
//     if (!checkVersion) return res.status(403).send({ code: 403, status: "Failed", message: API_VERSION_ISSUE });
//     let getUser:any = await AppDataSource.getRepository(UserRole == SUPER_ADMIN ? superAdmin : loginData).findOneBy({ UserId });
//     // Verify the token 
//     let verifyToken = (getUser?.WebToken == token) && getUser?.WebTokenExpirationTime == generateCurrentTime();
//     if (!verifyToken) {
//         return res.status(403).send({ code: 403, message: "Please Login Again" }); // Return 403 if there is an error verifying
//     }
//     next();
// };

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ code: 401, message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.SECRET_KEY, { algorithms: 'HS256' }, async (err, user) => {
        if (err) {
            return res.status(403).json({ code: 403, message: 'Failed to authenticate.' });
        }
        req.user = {...req.user, ...user};
        next();
    });
};

export const authenticateTokenWeb = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response401(res, 'Access denied. No token provided');
    const options: any = { algorithms: 'HS256' }
    jwt.verify(token, process.env.SECRET_KEY!, options, async (err, user) => {
        if (err) return response403(res, 'Failed to authenticate');
        req.user = user;
        next();
    });
};
