<template>
    <el-container>
        <el-header class="header" height="50px">
            <div class="logoWrap">
                <img @click="backToHome" v-if="domain == 'cms.ilivingcosmetic.com'" src="../assets/images/logo/Iliving.png" alt="">
                <img @click="backToHome" v-else src="../assets/images/logo/logo_dark.png" alt="">
            </div>
            <div class="headerRightWrap">
                <el-dropdown>
                    <el-avatar
                    size="medium"
                    shape="circle"
                    icon="el-icon-user-solid"
                    />
                    <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="Profile"
                        >Thông tin tài khoản</el-dropdown-item
                    >
                    <el-dropdown-item @click.native="changePassword"
                        >Đổi mật khẩu</el-dropdown-item
                    >
                    <el-dropdown-item divided @click.native="logout">
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
</template>

<script>
import router from "@/router";
import { mapActions } from "vuex";

export default {
    name: "SaleLayout",
    data () {
      return {
        domain: window.location.host,
      }
    },
    methods: {
        ...mapActions("auth", ["logout"]),
        backToHome() {
            if (router.currentRoute.name !== "Home") {
                return router.push({ name: "Home" });
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
    }
}
</script>

<style lang="scss" scoped>
@import "../assets/styles/variables";

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $colorStroke;
    width: 100%;
    background: $colorHeaderBg;
    padding: 0 24px;

    .logoWrap {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        img {
            width: 112px;
            height: 50px;
        }
    }

  .headerRightWrap {
    height: 100%;
    .el-dropdown {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
  }
}

.el-main {
    position: relative;
    padding: 20px;
    width: 100%;
    height: calc(100vh - 50px);
    background: $colorMainBg;
}

.el-main::-webkit-scrollbar {
    width: 6px;
}
.el-main::-webkit-scrollbar-thumb {
    background-color: #C0C4CC;
    border-radius: 8px;
}

@media only screen and (max-width: 768px) {
    .header {
        position: fixed;
        z-index: 1000;
    }
    .el-main {
        margin-top: 50px;
        padding: 10px;
    }
}
</style>