const crypto = require('crypto');
const axios = require('axios');

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

var rsaCipherMsg = function(msg){
    var key = ''
    axios.get('getKey').then(function(res){
        key = res.data
    });    
}


module.exports = {
    cipherMsg,
    decipherMsg,
    rsaCipherMsg
}