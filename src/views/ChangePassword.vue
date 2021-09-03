<template>
  <div class="dashboard">
    <el-row>
      <el-col :span="12" class="box-content-left">
        <div class="content-left">
          <h1>Thay đổi mật khẩu</h1>
          <br />
          <span>Cập nhật mật khẩu mới</span>
        </div>
      </el-col>
      <el-col :span="12" class="box-change-password"
        ><div class="">
          <el-card class="box-card">
            <div class="text item">
              <div class="inputWrap">
                <p class="title">Mật khẩu <span class="star">*</span></p>
                <el-input
                  placeholder="Mật khẩu"
                  type="password"
                  v-model="password"
                  @keyup.enter.native="changePassword"
                ></el-input>
                <div v-if="this.errorPassword !== ''" class="error">
                  <span> {{ errorPassword }} </span>
                </div>
              </div>
              <div class="inputWrap">
                <p class="title">Mật khẩu mới <span class="star">*</span></p>
                <el-input
                  placeholder="Mật khẩu mới"
                  type="password"
                  v-model="passwordNew"
                  @keyup.enter.native="changePassword"
                ></el-input>
                <div v-if="this.errorPasswordNew !== ''" class="error">
                  <span> {{ errorPasswordNew }} </span>
                </div>
              </div>
              <div class="inputWrap">
                <p class="title">
                  Nhập lại mật khẩu <span class="star">*</span>
                </p>
                <el-input
                  placeholder="Xác thực mật khẩu mới "
                  type="password"
                  v-model="confirmPassword"
                  @keyup.enter.native="changePassword"
                ></el-input>
                <div v-if="this.errorConfirmPassword !== ''" class="error">
                  <span> {{ errorConfirmPassword }} </span>
                </div>
              </div>
              <el-button
                type="primary"
                class="loginButton"
                @click="changePassword"
                >Lưu</el-button
              >
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import {mapMutations } from 'vuex'
import api from "../api";
import {mapGetters, mapMutations} from "vuex";
import router from "@/router";
export default {
  name: "Customer",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return {
      confirmPassword: "",
      password: "",
      passwordNew: "",
      errorPasswordNew: "",
      errorConfirmPassword: "",
      errorPassword: "",
    };
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("");
    },
    changeIndexSidebar() {
      this.updateSideBar("0");
    },
    changePassword() {
      if (this.isValidData()) {
        let data = {
          password: this.password,
          new_password: this.passwordNew,
        };
        api
          .changePassword(data)
          .then(() => {
            this.$message({
              message: "Cập nhật mật khẩu thành công!",
              type: "success",
            });
            this.confirmPassword = "";
            this.password = "";
            this.passwordNew = "";
          })
          .catch((e) => {
            this.$message({
              message: e.response.data.error.password[0],
              type: "error",
            });
          });
      }
    },
    isValidData() {
      let error = false;
      this.errorPassword = "";
      this.errorConfirmPassword = "";
      this.errorPasswordNew = "";
      if (this.password.length < 6) {
        error = true;
        this.errorPassword = "Mật khẩu phải lớn hơn 6 ký tự";
      }
      if (this.password.length === 0) {
        error = true;
        this.errorPassword = "Mật khẩu không được để trống";
      }
      if (this.passwordNew.length < 6) {
        error = true;
        this.errorPasswordNew = "Mật khẩu mới phải lớn hơn 6 ký tự";
      }
      if (this.passwordNew.length === 0) {
        error = true;
        this.errorPasswordNew = "Mật khẩu mới không được để trống";
      }
      if (this.confirmPassword !== this.passwordNew) {
        error = true;
        this.errorConfirmPassword = "Mật khẩu xác thực không trùng nhau";
      }
      if (this.confirmPassword.length === 0) {
        error = true;
        this.errorConfirmPassword = "Mật khẩu xác thực không được để trống";
      }

      return !error;
    },
  },
  watch: {
    password() {
      this.errorPassword = "";
      this.errorConfirmPassword = "";
      this.errorPassword = "";
    },
  },
  mounted() {
    if (this.hasPermission('change-password-user')) {
      this.updateSideBar();
      this.updateTitle();
    } else {
      this.$message({
        message: "Bạn không có quyền thực hiện tác vụ này!",
        type: "error",
        center: true,
      });
      return router.push({ name: "Home" });
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/styles/variables";

.dashboard {
  .content-left {
    text-align: left;
    margin: 0 auto;
    width: 250px;
    h1 {
      font-size: 25px;
      margin-bottom: 0px;
    }
    span {
      color: $colorSecond;
    }
  }
}
//el card
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 500px;
  min-height: 400px;
  height: auto;
  .item {
    .title {
      margin-bottom: 10px;
      margin-top: 30px;
      font-weight: 600;
      font-size: 16px;
    }
    .star {
      color: $colorRed;
    }
    .loginButton {
      margin-top: 30px;
      margin-left: 375px;
    }
    .error {
      color: $colorRed;
      margin-top: 8px;
      font-size: 12px;
      margin-left: 0px;
    }
  }
}

@media only screen and (max-width: 992px) {
  .dashboard {
    .box-content-left {
      width: 100%;
      margin-bottom: 15px;
    }
    .box-change-password {
      width: 100%;
    }
    .content-left {
      text-align: left;
      margin-left: 0px;
      h1 {
        font-size: 14px;
        margin-bottom: 0px;
        margin-top: 0px;
      }
      span {
        font-size: 12px;
        color: $colorSecond;
      }
    }
    .text {
      font-size: 14px;
    }
  }
  .box-card {
    width: 100%;
    min-height: auto !important;
    .item {
      margin-top: 10px !important;
      margin-bottom: 5px !important;
      .title {
        font-size: 14px;
        margin-top: 5px !important;
        margin-bottom: 5px !important;
      }
      .el-input {
        margin-bottom: 10px;
      }
      .loginButton {
        margin-top: 10px;
        float: right;
      }
    }
  }
  .el-main {
    padding-top: 0px !important;
  }
}
</style>
