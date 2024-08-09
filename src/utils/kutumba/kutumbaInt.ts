import axios from "axios";
import { DecryptStringFromEncrypt, generateUniqueId, HashHMACHex } from "../resuableCode";
import Logger from "../../loggers/winstonLogger";

const getReqBody = async (data, creteHMAC) => {
    const { aadhar, rc } = data;
    return {
        DeptID: "",
        BenID: "",
        RC_Number: rc ? `${rc}` : "",
        Aadhar_No: aadhar ? aadhar : "",
        ClientCode: process.env.KUTUMA_CLIENT_CODE,
        HashedMac: creteHMAC,
        APIVersion: "1.0",
        IsPhotoRequired: "0",
        Member_ID: "",
        Mobile_No: "",
        Request_ID: generateUniqueId(),
        UIDType: "1"
    };
};



export const fetchDataFromKutumba = async (data) => {
    try {
        let inputValue = "";
        inputValue = (data?.aadhar) ?
        `${process.env.KUTUMA_CLIENT_CODE}___${data.aadhar}_` :
        `${process.env.KUTUMA_CLIENT_CODE}__${data.rc}__`;
        let creteHMAC = HashHMACHex(process.env.KUTUMBA_CLIENT_SEC_KEY, inputValue);
        let response = await axios.post(process.env.KUTUMBA_API, await getReqBody(data, creteHMAC), {
            headers: {
                "Accept": "application/json"
            }
        });
        if (response.status == 200 && response.data?.StatusCode == 0) {
            let decryptString = DecryptStringFromEncrypt(process.env.KUTUMBA_AES_KEY, process.env.KUTUMBA_IV_KEY, response?.data?.EncResultData)
            let pasingDecryptData = JSON.parse(decryptString);
            if (pasingDecryptData?.StatusCode === 0 && pasingDecryptData?.StatusText === "Sucess") {
                return pasingDecryptData?.ResultDataList;
            } else {
                return pasingDecryptData;
            }
        } else {
            return response.data;
        }
    } catch (e) {
        Logger.error("[ *********** getFamilyAdDataFromKutumba ************* ]", e);
        return e.message;
    };
};