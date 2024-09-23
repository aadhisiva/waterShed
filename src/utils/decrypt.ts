import CryptoJS from 'crypto-js';

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
};


// generate random string
export const generateRandomString = (RequiredLength:number) => {
    let newString = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < RequiredLength; i++) {
      let randomCharacter = characters.charAt(Math.floor(Math.random() * charactersLength));
      newString += randomCharacter;
    }
    return newString;
  };