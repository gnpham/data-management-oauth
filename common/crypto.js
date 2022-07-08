const cryptoJs = require("crypto-js");
const keyUtf8 = cryptoJs.enc.Utf8.parse(process.env.AES_KEY);

module.exports.encrypt = (plainText) => {
  const encrypted = cryptoJs.AES.encrypt(plainText, keyUtf8, {
    mode: cryptoJs.mode.ECB,
    keySize: 128,
  });

  return encrypted.toString();
};

module.exports.decrypt = (encryptText) => {
  const decrypted = cryptoJs.AES.decrypt(encryptText.toString(), keyUtf8, {
    mode: cryptoJs.mode.ECB,
    keySize: 128,
  });

  return decrypted.toString(cryptoJs.enc.Utf8);
};
