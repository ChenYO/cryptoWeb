const crypto = require('crypto');
// const fs = require('fs');
const path = require('path');

let key = 'asdhjwheru*asd123-123';
// var publicPem = fs.readFileSync(path.join(__dirname, '../key.pem'), 'utf8');
// var publicKey = publicPem.toString();
// console.log(fs)

var cipherMsg = function(msg) {
    
    var cipher = crypto.createCipher('aes256', key);
    var crypted = cipher.update(msg, 'utf8', 'hex');
    crypted += cipher.final('hex');
    
    return crypted; 
}

var decipherMsg = function(msg) { 
    var decipher = crypto.createDecipher('aes256', key);
    var dec = decipher.update(msg, 'hex', 'utf8');
    dec += decipher.final('utf8');
    
    return dec;
}

module.exports = {
    cipherMsg,
    decipherMsg
}