<template>
    <div class="loginForm">
      <div class="logo">
        <img v-if="domain == 'cms.ilivingcosmetic.com'" src="../assets/images/logo/Iliving.png" alt="" style="width:150px;height: 100px">
        <img v-else src="../assets/images/logo/logo_dark.png" alt="">
      </div>
      <div class="inputWrap">
          <el-input placeholder="Số điện thoại" type="text" v-model="phone" @keyup.enter.native="handleLogin()"></el-input>
          <div v-if="this.errorPhone !== '' " class="error">
              <span> {{ errorPhone }} </span>
          </div>
      </div>
      <div class="inputWrap">
          <el-input  placeholder="Mật khẩu" type="password"  v-model="password" @keyup.enter.native="handleLogin()"></el-input>
          <div v-if="this.errorPassword !== '' " class="error">
              <span> {{ errorPassword }} </span>
          </div>
      </div>
        <!-- <div class="box-change-pass forgot-password"><span @click="forgotPassword">Quên mật khẩu</span></div> -->
      <el-button type="primary" class="loginButton" @click="handleLogin()">ĐĂNG NHẬP</el-button>
      <div class="tip">
        <span>Được phát triển bởi <a href="https://zentsoft.com/" target="_bank"> ZentSoft</a></span>
      </div>
    </div>
</template>
<script>
  import { mapMutations, mapState } from 'vuex';
  import api from '../api'
  import _ from 'lodash'
  
  export default {
    name: "Login",
    data () {
      return {
        errorPhone: '',
        errorPassword: '',
        phone: '',
        password: '',
        domain: window.location.host,
      }
    },
    computed: {
      ...mapState('auth', ['isAuthenticated'])
    },
    watch: {
      email () {
        this.errorPhone = ''
      },
      password () {
        this.errorPassword = ''
      }
    },
    methods: {
      ...mapMutations('auth', [
        'updateLoginStatus',
        'updateAccessToken'
      ]),
      handleLogin () {
        if (this.isValidData()) {
          let data = {
            phone: this.phone,
            password: this.password,
          }
          api.login(data).then((response) => {
            this.updateAccessToken(_.get(response, 'data.access_token'))
            this.updateLoginStatus(true)
            this.$router.push({ name: 'Home' })
          }).catch(() => {
            this.$message({message: 'Số điện thoại hoặc mật khẩu không chính xác', type: 'error'});
          })
        }
      },
      isValidData () {
        let error = false;
        this.errorPhone = '';
        this.errorPassword = '';
        if (this.phone.length === 0) {
          error = true;
          this.errorPhone = 'Số điện thoại không được để trống';
        }
        if (this.password.length < 6) {
          error = true;
          this.errorPassword = 'Mật khẩu phải lớn hơn 6 ký tự';
        }
        if (this.password.length === 0) {
          error = true;
          this.errorPassword = 'Mật khẩu không được để trống';
        }

        return !error
      }
    },
  }
</script>
<style lang="scss">
    @import "../assets/styles/variables";

    .loginForm {
        max-width: 400px;
        width: 100%;
        display: block;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        background: $colorWhite;
        padding: 24px;
        border-radius: 10px;
        .box-change-pass {
          display: inline-block;
          margin-left: 10px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: row-reverse;
          span {
            font-size: 14px;
            cursor: pointer;
            color: $colorSecondary;
          }
          span:hover {
            color: $colorMainDisable;
          }
        }
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            img {
                width: 200px;
                vertical-align: middle;
                border-style: none;
                box-sizing: border-box;
            }
        }
        .inputWrap {
            margin-bottom: 24px;
            .error {
                color: $colorRed;
                margin-top: 8px;
                font-size: 12px;
            }
        }
        .loginButton {
            width: 100%;
        }

      .tip {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: $colorSecond;

        span {
          a {
            color: $colorOrange;
            text-decoration: none;
          }
        }
      }
    }
</style>