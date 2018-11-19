<template>
  <div class="hello">
    <input class="input" v-model="msg">
    <button @click="cipherBtn">
      Cipher
    </button>
    <button @click="decipherBtn" :disabled="isCipher">
      Decipher
    </button>
    <button @click="reset">
      Reset
    </button>
    <div>
      Cipher : {{cipherMsg}}
      <br>
      Decipher: {{decipherMsg}}
    </div>
  </div>
</template>

<script>
let crypto = require('../cryptoAPI')
// let crypto = require('crypto');

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '',
      cipherMsg: '',
      decipherMsg: '',
      isCipher: true,
      key: 'asdhjwheru*asd123-123'
    }
  },
  methods: {
    cipherBtn : function(){
      this.cipherMsg = crypto.cipherMsg(this.msg);
      // var md5 = crypto.createHash('md5');
      // var digest = md5.update(this.msg, 'utf8').digest('hex');
      // this.md5Msg = digest;
      
      
      this.isCipher = false;
    },
    decipherBtn: function() {
      this.decipherMsg = crypto.decipherMsg(this.cipherMsg);
    },
    reset: function() {
      this.msg = '';
      this.cipherMsg = '';
      this.decipherMsg = '';
      this.isCipher = true;
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
