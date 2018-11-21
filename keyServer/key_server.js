const express = require('express');
const fs = require('fs');
const path = require('path');

var app = express();

app.get('/getKey', function(req, res){
    var publicPem = fs.readFileSync(path.join(__dirname, 'key.pem'), 'utf8');
    var publicKey = publicPem.toString();

    res.send(publicKey);
});

app.get('/getPublicKey', function(req, res){
    var publicPem = fs.readFileSync(path.join(__dirname, 'public.pem'), 'utf8');
    var publicKey = publicPem.toString();

    res.send(publicKey);
});

app.get('/getPrivateKey', function(req, res){
    var privatePem = fs.readFileSync(path.join(__dirname, 'private.pem'), 'utf8');
    var privateKey = privatePem.toString();

    res.send(privateKey);
});


app.listen(3000, function(){
    console.log('listen...3000');
});

