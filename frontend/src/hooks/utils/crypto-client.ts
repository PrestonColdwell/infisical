import CryptoJS from "crypto-js";

const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY; // Must be 32 bytes

export const encrypt = (text: string): string => {
  if (!key) {
    throw new Error("Encryption key is undefined");
  }
  return CryptoJS.AES.encrypt(text, key).toString();
};