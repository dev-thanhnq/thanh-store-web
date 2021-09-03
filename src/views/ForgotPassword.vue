<template>
    <div class="loginForm">
        <div class="logo">
            <img src="../assets/images/logo/logo_dark.png" alt="">
        </div>
        <div>
          <div class="title"><span>Quên mật khẩu</span></div>
          <div class="back-to-login" @click="backLogin"><span>Quay lại</span></div>
        </div>
        <div class="inputWrap">
            <el-input  placeholder="Mật khẩu" type="password"  v-model="password"></el-input>
            <div v-if="this.errorPassword !== '' " class="error">
                <span> {{ errorPassword }} </span>
            </div>
        </div>
        <div class="inputWrap">
            <el-input  placeholder="Mật khẩu xác thực" type="password"  v-model="confirmPassword "></el-input>
            <div v-if="this.errorConfirmPassword !== '' " class="error">
                <span> {{ errorConfirmPassword }} </span>
            </div>
        </div>
        <el-button type="primary" class="loginButton">ĐĂNG NHẬP</el-button>
    </div>
</template>
<script>
  import { mapMutations, mapState } from 'vuex';
  // import api from '../api'
  
  export default {
    name: "Login",
    data () {
      return {
        errorPassword: '',
        password: '',
        errorConfirmPassword: '',
        confirmPassword:'',
      }
    },
    computed: {
      ...mapState('auth', ['isAuthenticated'])
    },
    watch: {
      password () {
        this.errorPassword = ''
      }
    },
    methods: {
      ...mapMutations('auth', [
        'updateLoginStatus',
        'updateAccessToken'
      ]),
      isValidData () {
        let error = false;
        this.errorPassword = '';
        this.errorConfirmPassword = '';
        if (this.password.length < 6) {
          error = true;
          this.errorPassword = 'Mật khẩu phải lớn hơn 6 ký tự';
        }
        if (this.password.length === 0) {
          error = true;
          this.errorPassword = 'Mật khẩu không được để trống';
        }
        if (this.confirmPassword !== this.password) {
          error = true;
          this.errorConfirmPassword = 'Mật khẩu xác thực không trùng nhau';
        }
        if (this.confirmPassword.length === 0) {
          error = true;
          this.errorConfirmPassword = 'Mật khẩu xác thực không được để trống';
        }

        return !error
      },
      backLogin() {
        this.$router.push({ name: 'Login' })
      }
    },
  }
</script>
<style lang="scss">
    @import "../assets/styles/variables";

    .loginForm {
      .title {
        margin-bottom: 10px;
        font-weight: bold;
        color: $colorSecond;
        display: inline-block;
      }
      .back-to-login{
        display: inline-block;
        margin-left: 176px;
        font-size: 14px;
        cursor: pointer;
        color: $colorSecondary;
      }
      .back-to-login:hover {
        color: $colorMainDisable;
      }
        max-width: 400px;
        width: 100%;
        display: block;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        background: $colorWhite;
        padding: 24px;
        border-radius: 10px;
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
                margin-left: 0px;
            }
        }
        .loginButton {
            width: 100%;
        }
    }
</style>