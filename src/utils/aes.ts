import { AES, enc, mode, pad } from 'crypto-js';

// 默认自定义的约定密钥(与后端密钥保持一致)
const KEY = enc.Utf8.parse('CityDO@Security#'); // 密钥16位长度字符   内容可自定义
const IV = enc.Utf8.parse('CityDO@Security#'); //  密钥偏移量    16位长度字符

/**
 * AES对称加密（CBC模式，需要偏移量）
 * @param value
 * @param key
 * @param iv
 */
export function encrypt(value: string): string;
export function encrypt(value: string, key: string, iv: string): string;
export function encrypt(value: string, key?: string, iv?: string) {
  let _key = KEY;
  let _iv = IV;
  if (key && iv) {
    _key = enc.Utf8.parse(key);
    _iv = enc.Utf8.parse(iv);
  }
  // 明文
  const valueString = enc.Utf8.parse(value);
  // 加密
  const encrypt = AES.encrypt(valueString, _key, {
    iv: _iv,
    mode: mode.CBC, // AES加密模式
    padding: pad.Pkcs7, // 填充方式
  });
  // 返回base64格式密文
  return enc.Base64.stringify(encrypt.ciphertext);
}
