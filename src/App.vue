<template>
  <div id="app">
    <template v-if="isAuthenticated">
      <SaleLayout v-if="currentRoute" />
      <AdminLayout v-else />
    </template>
    <LoginLayout v-else />
  </div>
</template>

<script>
import AdminLayout from "./layouts/AdminLayout";
import LoginLayout from "./layouts/LoginLayout";
import SaleLayout from "./layouts/SaleLayout";
import { mapState } from "vuex";

export default {
  name: "App",
  data() {
    return {
      currentRoute: false,
    };
  },
  computed: {
    ...mapState("auth", ["isAuthenticated", "authUser"]),
  },
  components: {
    AdminLayout,
    LoginLayout,
    SaleLayout,
  },
  watch: {
    $route(to) {
      if (to.name === "Carts") {
        this.currentRoute = true;
      } else {
        this.currentRoute = false;
      }
    },
  },
};
</script>

<style lang="scss">
@import "./assets/styles/variables";

#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $colorDefault;
}

body {
  margin: 0;
  background: $colorMainBg;
  .el-message-box__btns {
    .btn-delete-list {
      background: $colorRed !important;
      border: 1px solid $colorRed;
    }
  }

  .cell {
    word-break: inherit !important;
  }
}
.el-table__body-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: none;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 8px;
}
.chartjs-render-monitor {
  max-height: 58vh;
  min-height: 58vh;
}
@media only screen and (max-width: 768px) {
  #addUser {
    .el-dialog {
      width: 80% !important;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  #editUser {
    .el-dialog {
      width: 80% !important;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  #resetPassword {
    .el-dialog {
      width: 80% !important;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  .el-message-box {
    width: 300px !important;
  }
}
#add-user-cart {
  .el-dialog {
    width: 400px;
  }

  @media only screen and (max-width: 767px) {
    .el-dialog {
      width: 310px;
    }
  }
}
@media only screen and (max-width: 375px) {
  .dialog-add-category {
    .el-dialog {
      width: 80% !important;
      margin: 0 auto;
    }
  }
  .dialog-edit-category {
    .el-dialog {
      width: 80% !important;
      margin: 0 auto;
    }
  }
}

#add-product-dialog {
  .el-dialog {
    width: 900px;
  }

  @media only screen and (max-width: 992px) {
    .el-dialog {
      width: 700px;
    }
  }

  @media only screen and (max-width: 767px) {
    .el-dialog {
      width: 310px;
    }
  }
}

#excel-product {
  .el-dialog {
    width: 700px;
  }

  @media only screen and (max-width: 767px) {
    .el-dialog {
      width: 310px;
    }
  }
}

#add-quantini-product {
  .el-dialog {
    width: 600px;
  }

  @media only screen and (max-width: 767px) {
    .el-dialog {
      width: 310px;
    }
  }
}
@media only screen and (max-width: 767px) {
  #addCustomer {
    .el-dialog {
      width: 90%;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  #editCustomer {
    .el-dialog {
      width: 90% !important;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  .el-message-box {
    width: 330px !important;
  }
    #add-category {
    .el-dialog {
      width: 80% !important;
    }
  }
  #edit-category {
    .el-dialog {
      width: 80% !important;
    }
  }
}
@media only screen and (min-width: 768px) and (max-width: 992px) {
  #addCustomer {
    .el-dialog {
      width: 85% !important;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  #editCustomer {
    .el-dialog {
      width: 55% !important;
      .dialog-footer {
        .btn-dialog {
          margin-left: 10px;
        }
      }
    }
  }
  .el-message-box {
    width: 330px !important;
  }

  #add-category {
    .el-dialog {
      width: 60% !important;
    }
  }
  #edit-category {
    .el-dialog {
      width: 60% !important;
    }
  }
}
</style>
