<template>
  <div class="dashboard">
    <el-row>
      <el-col :span="12" class="box-content-left">
        <div class="content-left">
          <h1>Thông tin cá nhân</h1>
          <br>
          <span>Cập nhật thông tin cá nhân</span>
        </div>
      </el-col>
      <el-col :span="12" class="box-change-profile"
        ><div class="">
          <el-card class="box-card">
            <div class="text item">
              <div class="inputWrap">
                <p class="title">Họ và tên <span class="star">*</span></p>
                <el-input
                  placeholder="Họ và tên"
                  type="text"
                  v-model="user.name"
                  @keyup.enter.native="updateUser"
                ></el-input>
                <div v-if="this.errorName !== ''" class="error">
                  <span> {{ errorName }} </span>
                </div>
              </div>
              <div class="inputWrap">
                <p class="title">Số điện thoại <span class="star">*</span></p>
                <el-input
                  placeholder="Số điện thoại"
                  type="text"
                  v-model="user.phone"
                  @keyup.enter.native="updateUser"
                ></el-input>
                <div v-if="this.errorPhone !== ''" class="error">
                  <span> {{ errorPhone }} </span>
                </div>
              </div>
              <div class="inputWrap">
                <p class="title">Email</p>
                <el-input
                  placeholder="Email"
                  type="email"
                  v-model="email"
                  @keyup.enter.native="updateUser"
                ></el-input>
                <div v-if="this.errorEmail !== ''" class="error">
                  <span> {{ errorEmail }} </span>
                </div>
              </div>
              <div class="inputWrap">
                <p class="title">Địa chỉ <span class="star">*</span></p>
                <el-input
                  placeholder="Địa chỉ"
                  type="text"
                  v-model="user.address"
                  @keyup.enter.native="updateUser"
                ></el-input>
                <div v-if="this.errorAddress !== ''" class="error">
                  <span> {{ errorAddress }} </span>
                </div>
              </div>
              <el-button type="primary" class="loginButton" @click="updateUser" v-if="hasPermission('update-profile-user')"
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
import { isValidEmail } from "../utils/helper";
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
      email: "",
      errorName: "",
      errorPhone: "",
      errorEmail: "",
      errorAddress: "",
      user: [],
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
    updateUser() {
      if (this.hasPermission('update-profile-user')) {
        if (this.isValidData()) {
          let data = {
            name: this.user.name,
            phone: this.user.phone,
            email: this.email,
            address: this.user.address,
          };
          api.updateProfile(data).then(() => {
            this.$message({
              message: "Cập nhật thông tin thành công!",
              type: "success",
            });
            this.getDataProfile();
          });
        }
      }
    },
    isValidData() {
      let error = false;
      this.errorName = "";
      this.errorEmail = "";
      this.errorPhone = "";
      this.errorAddress = "";

      if (this.email) {
        if (!isValidEmail(this.email)) {
          error = true;
          this.errorEmail = "Email sai định dạng, vui lòng nhập lại";
        }
      }
      if (this.user.name.length === 0) {
        error = true;
        this.errorName = "Họ và tên không được để trống!";
      }
      if (this.user.phone.length < 9) {
        error = true;
        this.errorPhone = "Số điện thoại phải lớn hơn 9 ký tự!";
      }
      if (this.user.phone.length > 11) {
        error = true;
        this.errorPhone = "Số điện thoại phải nhỏ hơn 11 ký tự!";
      }
      if (this.user.phone.length === 0) {
        error = true;
        this.errorPhone = "Số điện thoại không được để trống!";
      }

      return !error;
    },
    getDataProfile() {
      api.getDataProfile().then((response) => {
        this.user = response.data.data;
        this.email = this.user.email;
      });
    },
  },
  mounted() {
    if (this.hasPermission('get-profile-user')) {
      this.changePageTitle();
      this.getDataProfile();
      this.changeIndexSidebar();
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
  min-height: 500px;
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
      margin-bottom: 10px;
      .content-left {
        margin-left: 0px;
      }
    }
    .box-change-profile {
      width: 100%;
    }
    .content-left {
      text-align: left;
      margin: 0 auto;
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
    min-height: auto!important;
    .el-card__body {
      padding-top: 0px;
      .item {
        margin-bottom: 5px!important;
        .title {
          font-size: 14px;
          margin-top: 10px!important;
          margin-bottom: 5px!important;
        }
        .loginButton {
          margin-top: 10px;
          margin-left: 0px!important;
          float: right;
        }
      }
    }
  }
  .el-main {
    padding-top: 0px!important;
  }
}
</style>
