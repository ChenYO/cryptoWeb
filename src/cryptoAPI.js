let crypto = require('crypto');

let key = 'asdhjwheru*asd123-123'

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