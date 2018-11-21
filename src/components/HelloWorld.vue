<template>
  <div class="hello">
    <input class="input" v-model="msg">
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
    <button @click="reset">
      Reset
    </button>
    <div>
      Cipher : {{cipherMsg}}
      <br>
      Decipher: {{decipherMsg}}
      <br>
      RSACipher: {{rsaCipherMsg}}
      <br>
      RSADecipher: {{rsaDecipherMsg}}
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
      rsaCipherMsg: '',
      rsaDecipherMsg: '',
      isCipher: true,
      isRsaCipher: true,
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
    rsaCipherBtn: function(){
      var $this = this;

      axios.get('getPublicKey').then(function(res){
        $this.isRsaCipher = false;
        var publicKey = res.data
        
        var bufferData = new Buffer($this.msg);
        var encrypted = crypto.publicEncrypt(publicKey, bufferData);
        $this.rsaCipherMsg = encrypted.toString('base64'); 

        // var decipher = crypto.createDecipher('aes256', key);
        // $this.rsaCipherMsg = decipher.update($this.msg, 'hex', 'utf8');
        // $this.rsaCipherMsg += decipher.final('utf8');
      });  
      
    },
    rsaDecipherBtn: function(){
      var $this = this;

      axios.get('getPrivateKey').then(function(res){
        $this.isRsaCipher = false;
        var privateKey = res.data
        
        var bufferData = new Buffer($this.rsaCipherMsg, 'base64');
        var encrypted = crypto.privateDecrypt(privateKey, bufferData);
        $this.rsaDecipherMsg = encrypted.toString('utf8'); 

        // var decipher = crypto.createDecipher('aes256', key);
        // $this.rsaCipherMsg = decipher.update($this.msg, 'hex', 'utf8');
        // $this.rsaCipherMsg += decipher.final('utf8');
      });  
    },
    reset: function() {
      this.msg = '';
      this.cipherMsg = '';
      this.decipherMsg = '';
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
