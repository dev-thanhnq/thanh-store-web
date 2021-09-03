<template>
  <el-container>
    <el-aside class="sideBar">
      <div class="logoWrap" @click="dashboard">
      </div>
      <el-menu
        :default-active="sidebarIndex"
        text-color="#253036"
        active-text-color="#27AE60"
      >
        <el-menu-item index="1" @click="dashboard">
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <span> Tổng quan</span>
        </el-menu-item>
        <el-menu-item v-if="hasPermission('get-order')" index="5" @click="orderManagement">
          <i class="fa fa-list-alt"></i>
          <span> Đơn hàng</span>
        </el-menu-item>
        <el-menu-item v-if="hasPermission('get-product')" index="3" @click="goToProducts">
          <i class="fa fa-archive" aria-hidden="true"></i>
          <span> Sản phẩm</span>
        </el-menu-item>
        <el-menu-item v-if="hasPermission('get-category')" index="2" @click="goToCagories">
          <i class="fa fa-bars" aria-hidden="true"></i>
          <span> Thể loại</span>
        </el-menu-item>
        <el-menu-item v-if="hasPermission('get-customer')" index="4" @click="customerManagement">
          <i class="fa fa-users"></i>
          <span> Tác giả</span>
        </el-menu-item>
<!--        <el-menu-item-->
<!--          v-if="hasPermission('get-user')"-->
<!--          index="6"-->
<!--          @click="userManagement"-->
<!--        >-->
<!--          <i class="fa fa-user-circle-o"></i>-->
<!--          <span> Nhân viên</span>-->
<!--        </el-menu-item>-->
<!--        <el-menu-item-->
<!--            v-if="hasPermission('get-role')"-->
<!--            index="7"-->
<!--            @click="roleManagement"-->
<!--        >-->
<!--          <i class="fa fa-cog"></i>-->
<!--          <span> Chức vụ</span>-->
<!--        </el-menu-item>-->
      </el-menu>
      <el-footer class="footer">
        <span
          >Được phát triển bởi
          <a href="https://zentsoft.com/" target="_bank"> ZentSoft</a></span
        >
      </el-footer>
    </el-aside>
    <el-container>
      <el-header class="header">
        <el-dropdown trigger="click" class="side-bar-dr" style="display: none">
          <div class="btn-block-side-bar">
            <div>
              <i class="fa fa-bars el-dropdown-link"></i>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="dashboard" icon="fa fa-th-large">Tổng quan</el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('get-order')" index="5" @click.native="orderManagement" icon="fa fa-list-alt">Đơn hàng</el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('get-product')" @click.native="goToProducts" icon="fa fa-archive">Sản phẩm</el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('get-category')" @click.native="goToCagories" icon="fa fa-bars">Nhóm sản phẩm</el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('get-customer')" @click.native="customerManagement" icon="fa fa-users">Khách hàng</el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('get-user')" @click.native="userManagement" icon="fa fa-user">Nhân viên</el-dropdown-item>
            <el-dropdown-item v-if="hasPermission('get-role')" @click.native="roleManagement" icon="fa fa-cog">Chức vụ</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="headerLeftWrap header-title">
          {{ pageTitle }}
        </div>
        <div class="headerRightWrap">
          <el-badge v-if="hasPermission('add-cart')" class="cart-button" :value="cartSum">
            <el-button @click="goToCarts" size="small"
              ><i class="fa fa-shopping-cart"></i> Bán hàng</el-button
            >
          </el-badge>
          <el-dropdown class="avatar">
            <el-avatar size="medium" shape="circle" icon="el-icon-user-solid" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                  v-if="hasPermission('get-profile-user')"
                  @click.native="Profile"
                >Thông tin tài khoản</el-dropdown-item
              >
              <el-dropdown-item
                  v-if="hasPermission('change-password-user')"
                  @click.native="changePassword"
                >Đổi mật khẩu</el-dropdown-item
              >
              <el-dropdown-item @click.native="logout">
                Đăng xuất
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters} from "vuex";
import api from "../api";
import _ from "lodash";
import router from "@/router";

export default {
  name: "AdminLayout",
  data() {
    return {
      domain: window.location.host,
    };
  },
  computed: {
    ...mapState(["pageTitle", "cartSum", "sidebarIndex"]),
    ...mapState("auth", ["authUser"]),
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    ...mapMutations("auth", ["updateAuthUser"]),
    ...mapMutations(["sumCart"]),
    ...mapActions("auth", ["logout"]),
    dashboard() {
      if (router.currentRoute.name !== "Home") {
        return router.push({ name: "Home" });
      }
    },
    customerManagement() {
      if (router.currentRoute.name !== "Customer") {
        return router.push({ name: "Customer" });
      }
    },
    userManagement() {
      if (router.currentRoute.name !== "User") {
        return router.push({ name: "User" });
      }
    },
    goToProducts() {
      if (router.currentRoute.name !== "Products") {
        return router.push({ name: "Products" });
      }
    },
    roleManagement() {
      if (router.currentRoute.name !== "Role") {
        return router.push({ name: "Role" });
      }
    },
    Profile() {
      if (router.currentRoute.name !== "Profile") {
        return router.push({ name: "Profile" });
      }
    },
    changePassword() {
      if (router.currentRoute.name !== "ChangePassword") {
        return router.push({ name: "ChangePassword" });
      }
    },
    goToCarts() {
      if (router.currentRoute.name !== "Carts") {
        return router.push({ name: "Carts" });
      }
    },
    goToCagories() {
      if (router.currentRoute.name !== "Categories") {
        return router.push({ name: "Categories" });
      }
    },
    orderManagement() {
      if (router.currentRoute.name !== "Order") {
        return router.push({ name: "Order" });
      }
    },
    getCarts() {
      if (this.hasPermission('get-cart')) {
        api.getDataCarts().then((response) => {
          this.sumCart(_.get(response, "data.data").length);
        });
      }
    },
  },

  mounted() {
    this.getCarts();
    api.getAuthUser().then((response) => {
      if (response) {
        this.updateAuthUser(response.data);
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables";

.sideBar {
  background: $colorWhite;
  width: 200px !important;
  height: 100vh;
  box-shadow: inset -10px 0 10px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  outline: none;
  overflow: hidden;

  .el-menu-item:hover {
    background-color: $colorBrand !important;
    color: $colorBrandText !important;
    i {
      color: $colorBrandText !important;
    }
  }
  .logoWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    cursor: pointer;
    min-height: 60px;
    img {
      width: 150px;
      height: 65px;
    }
  }

  .el-menu {
    border: none;
    box-shadow: inset -10px 0 10px -5px rgba(0, 0, 0, 0.1);
  }
  .is-active {
    background-color: $colorBrand !important;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $colorStroke;
  height: 60px;
  width: 100%;
  background: $colorHeaderBg;
  padding: 0 24px;

  .headerLeftWrap {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
  }

  .headerRightWrap {
    display: flex;
    align-items: center;
    .cart-button {
      margin-right: 40px;
    }
    .notification {
      margin-right: 40px;
      font-size: 24px;
    }
  }
}

.el-main {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 90vh;
  padding: 20px 20px 0 20px;
  background: $colorMainBg;
}
.el-main::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.el-main::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 8px;
}
.menu-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  display: none;
}
.icon-order {
  font-size: 17px !important;
  margin-right: 0px !important;
  width: 14px !important;
  text-align: left;
}
.footer {
  bottom: 0;
  position: absolute;
  display: flex;
  align-items: center;
  font-size: 12px;
  span {
    a {
      color: $colorOrange;
      text-decoration: none;
    }
  }
}
@media only screen and (max-width: 768px) {
  .side-bar-dr {
    display: block!important;
  }
  .el-dropdown {
    height: 50px;
    .btn-block-side-bar {
      margin-left: -23px;
      margin-top: -4px;
      display: block !important;
      width: 80px;
      height: 59px;
      text-align: center !important;
      position: relative;
      div {
        width: 50px;
        height: 50px;
        border: 1px solid $colorStroke;
        border-radius: 5px;
        background-color: $colorStroke;
        cursor: pointer;
        position: absolute;
        top: 3px;
        left: 6px;
        i {
          font-size: 30px;
          color: $colorSecond;
          line-height: 50px;
        }
      }
    }
  }
  .sideBar {
    width: 135px !important;
    display: none;
    .el-menu-item {
      padding-left: 10px !important;
      font-size: 13px;
      i {
        font-size: 13px;
      }
    }
    .logoWrap {
      img {
        width: 135px;
        height: 60px;
      }
    }
  }
  .header-title {
    font-size: 15px!important;
  }
  .avatar {
    padding-top: 15px!important;
  }
  .cart-button {
      margin-right: 14px!important;
      margin-left: 20px!important;
    }
}
</style>
