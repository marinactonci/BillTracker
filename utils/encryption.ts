import CryptoJs from 'crypto-js';
import { secretKey } from '@/lib/supabaseClient';

const cryptoJS = CryptoJs;

export const encrypt = (plainText: string) => {
  return cryptoJS.AES.encrypt(plainText, secretKey).toString();
};

export const decrypt = (cipherText: string) => {
  if (cipherText.length === 0) return "";
  const bytes = cryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(cryptoJS.enc.Utf8);
}