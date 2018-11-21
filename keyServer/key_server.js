const express = require('express');
const fs = require('fs');
const path = require('path');

var app = express();

app.get('/getKey', function(req, res){
    var publicPem = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');
    var publicKey = publicPem.toString();

    res.send(publicKey);
});

app.listen(3000, function(){
    console.log('listen...3000');
});

