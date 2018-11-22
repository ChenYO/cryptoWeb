<template>
  <div class="hello">
    <textarea rows="4" cols="40" v-model="msg">
    </textarea>
    <br>
    <button @click="cipherBtn">
      Cipher
    </button>
    <button @click="decipherBtn" :disabled="isCipher">
      Decipher
    </button>
    <button @click="rsaCipherBtn">
      RSACipher
    </button>
    <button @click="rsaDecipherBtn" :disabled="isRsaCipher">
      RSADecipher
    </button>
    <button @click="AesRsaCipherBtn">
      AES_RSACipher
    </button>
    <button @click="AesRsaDecipherBtn" >
      AES_RSADecipher
    </button>
    <button @click="reset">
      Reset
    </button>
    <div>
      <h3>對稱式加密</h3>
      <font color='red'>Cipher : </font>{{cipherMsg}}
      <br>
      <font color='red'>Decipher: </font>{{decipherMsg}}
      <br>
      <h3>非對稱式加密</h3>
      <font color='red'>RSAEncrypt: </font>{{rsaCipherMsg.join('')}}
      <br>
      <font color='red'>RSADecrypt: </font>{{rsaDecipherMsg}}

      <h3>對稱式加密明文，非對稱式加密密文</h3>
      <font color='red'>Aes_RsaEncrypt: </font>{{encryptedSection.join('')}}
      <br>
      <font color='red'>Aes_RSADecrypt: </font>{{rsaDecryptedMsg}}
    </div>
  </div>
</template>

<script>
// let crypto = require('../cryptoAPI');
let axios = require('axios');
let crypto = require('crypto');

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '',
      cipherMsg: '',
      decipherMsg: '',
      rsaCipherMsg: [],
      rsaDecipherMsg: '',
      rsaEncryptedMsg: '',
      rsaDecryptedMsg: '',
      encryptedSection: [],
      isCipher: true,
      isRsaCipher: true,
      isAesRsaCipher: true,
    }
  },
  methods: {
    //Using axios to get key, then encrypt message with AES
    cipherBtn : function(){
      var $this = this;

      axios.get('getKey').then(function(res){
        $this.isCipher = false;
        var key = res.data
        var cipher = crypto.createCipher('aes256', key);
        $this.cipherMsg = cipher.update($this.msg, 'utf8', 'hex');
        $this.cipherMsg += cipher.final('hex');
      });    
      
      // var md5 = crypto.createHash('md5');
      // var digest = md5.update(this.msg, 'utf8').digest('hex');
      // this.md5Msg = digest;
          
    },
    //Decrypting message
    decipherBtn: function() {
      var $this = this;

      axios.get('getKey').then(function(res){
        var key = res.data
        var decipher = crypto.createDecipher('aes256', key);
        $this.decipherMsg = decipher.update($this.cipherMsg, 'hex', 'utf8');
        $this.decipherMsg += decipher.final('utf8');
      });    
    },
    // RSA : Using public key to encrypt
    rsaCipherBtn: function(){
      var $this = this;

      axios.get('getPublicKey').then(function(res){
        $this.isRsaCipher = false;
        var publicKey = res.data
        
        var pivot = 130;
        var rsaEncryptedSection = []
        for(var i = 0 ; i < $this.msg.length ; i += pivot) {
          var section = $this.msg.substring(i, i + pivot);
          rsaEncryptedSection.push(section)
        }
        for(var data of rsaEncryptedSection){
          var bufferData = new Buffer(data);
          var encrypted = crypto.publicEncrypt(publicKey, bufferData);
          $this.rsaCipherMsg.push(encrypted.toString('base64')); 
        }
      });  
    },
    // RSA : Using private key to decrypt
    rsaDecipherBtn: function(){
      var $this = this;

      axios.get('getPrivateKey').then(function(res){
        $this.isRsaCipher = false;
        var privateKey = res.data
        
        for(var data of $this.rsaCipherMsg) {
          var bufferData = new Buffer(data, 'base64');
          var encrypted = crypto.privateDecrypt(privateKey, bufferData);
          $this.rsaDecipherMsg += encrypted.toString('utf8'); 
        }
      });  
    },
    /*  Using AES to encrypt data, then using RSA to encrypt AES code.
        Because RSA can only encrypt short data, so it needs to be devided into several sections.
        Here setting section's length to be 50
    */
    AesRsaCipherBtn: function(){
      var $this = this;
      $this.rsaDecryptedMsg = '';
      axios.get('getKey').then(function(res){
        //先使用AES針對內文作加密
        var key = res.data
        var cipher = crypto.createCipher('aes256', key);
        var aesEnctypted = cipher.update($this.msg, 'utf8', 'hex');
        aesEnctypted += cipher.final('hex');

       
        //將密文分段以RSA加密
        var pivot = 130;
        var rsaEncryptedSection = []
        for(var i = 0 ; i < aesEnctypted.length ; i += pivot) {
          var section = aesEnctypted.substring(i, i + pivot);
          rsaEncryptedSection.push(section)
        }
        
        axios.get('getPublicKey').then(function(res){
          var publicKey = res.data
          for(var data of rsaEncryptedSection){
            var bufferData = new Buffer(data);
            var rsaEncrypted = crypto.publicEncrypt(publicKey, bufferData);
            var rsaEncryptedMsg = rsaEncrypted.toString('base64'); 
            $this.encryptedSection.push(rsaEncryptedMsg)
          }
        }); 

      });
    },
    // Decrypt RSA data to AES code, then decrypt AES code 
    AesRsaDecipherBtn: function(){
      var $this = this;

      axios.get('getPrivateKey').then(function(res){
        $this.isRsaCipher = false;
        var privateKey = res.data
        var rsaDecryptedSection = [];
        //將密文解密取得原先AES密文
        for(var data of $this.encryptedSection) {
          var bufferData = new Buffer(data, 'base64');
          var encrypted = crypto.privateDecrypt(privateKey, bufferData);
          var rsaDecipherMsg = encrypted.toString('utf8'); 
          rsaDecryptedSection.push(rsaDecipherMsg)
        }
        
        //將AES密文解密
        axios.get('getKey').then(function(res){
          var key = res.data
          var decipher = crypto.createDecipher('aes256', key);
          $this.rsaDecryptedMsg = decipher.update(rsaDecryptedSection.join(''), 'hex', 'utf8');
          $this.rsaDecryptedMsg += decipher.final('utf8');
        });   
      });  
    },
    reset: function() {
      this.msg = '';
      this.cipherMsg = '';
      this.decipherMsg = '';
      this.rsaCipherMsg = [];
      this.rsaDecipherMsg = '';
      this.rsaEncryptedMsg = '';
      this.rsaDecryptedMsg = '';
      this.isCipher = true;
      this.isRsaCipher = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.input {
  width: 300px;
}
</style>
