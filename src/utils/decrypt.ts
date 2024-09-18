import CryptoJS from 'crypto-js';

const secret = '523d7fb5d51eee97cde7ea9d72f198b4'; 

// export const decryptData = (encryptedData: any) => {
//     const parts = encryptedData.split(':');
//     const iv = CryptoJS.enc.Hex.parse(parts[0]);
//     const encryptedText = parts[1];

//     const decrypted = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Hex.parse(secret), {
//         iv: iv,
//     });
//     return decrypted.toString(CryptoJS.enc.Base64);
// };



// export const decryptData = (encryptedData: string) => {
//     try {
//         // Split the encrypted data into IV and the actual ciphertext
//         const [secKey, Iv, json] = encryptedData.split('-');
//         console.log("parts", secKey);
//         const iv = CryptoJS.enc.Hex.parse(Iv); // Extract IV (in hex format)
//         const encryptedText = json; // Extract the encrypted text

//         // Decrypt the encrypted text using AES with the same key and IV
//         const decrypted = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Hex.parse(secKey), {
//             iv: iv,
//             mode: CryptoJS.mode.CBC, // Use CBC mode
//             padding: CryptoJS.pad.Pkcs7, // Use PKCS7 padding (default in Node.js crypto)
//         });

//         // Convert decrypted data (from WordArray) to a UTF-8 string
//         const decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);

//         return decryptedString;
//     } catch (error) {
//         console.error("Decryption error:", error);
//         throw new Error("Failed to decrypt data");
//     }
// };

// Decryption function
export function decryptData(encryptedData: any) {
    const [secretKey, iv, json] = encryptedData.split('-');
    // Decrypt data using the AES algorithm
    const decrypted = CryptoJS.AES.decrypt(json, CryptoJS.enc.Hex.parse(secretKey), {
        iv: CryptoJS.enc.Hex.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) throw new Error('Decryption failed!');

    return JSON.parse(decryptedText); 
}