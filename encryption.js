const { AES, enc } = require('crypto-js')

const { SECRET } = process.env

const encrypt = message => AES.encrypt(message, SECRET).toString()
const decrypt = encryptedMessage =>
  AES.decrypt(encryptedMessage, SECRET).toString(enc.Utf8)

module.exports = {
  encrypt,
  decrypt
}
