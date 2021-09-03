<template>
  <div class="permission">
    <el-card class="permission-main">
      <div class="permission-head">
        <span>Vai trò: </span>
        <h1 class="role-name">{{role.name}}</h1>
      </div>
      <hr>
      <div class="all-permission">
        <PermissionGroup v-for="permissionGroup in permissionGroups" :key="permissionGroup._id" :permissionGroup="permissionGroup"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import PermissionGroup from "@/components/Permission/PermissionGroup";
import api from "../api";
import _ from "lodash";
import router from "@/router";
import {mapMutations, mapState, mapGetters} from "vuex";
export default {
name: "Permission",
  components: {
    PermissionGroup
  },
  data () {
    return {
      permissionGroups: [],
      role: '',
    }
  },
  computed: {
    ...mapState([
        'sidebarIndex', 'pageTitle'
    ]),
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    ...mapMutations('role', [
        'updateRoleDetail'
    ]),
    ...mapMutations([
       'updateSideBar', 'updateTitle'
    ]),
    changePageTitle() {
      this.updateTitle("Quyền hạn");
    },
    changeIndexSidebar() {
      this.updateSideBar("7");
    },
    getData() {
      api.getPermissions().then((response) => {
        this.permissionGroups = _.get(response, 'data.data')
      }).catch((error) => {
        this.$message.error(_.get(error.response))
      })
    },
    getDataRoleDetail() {
      if (!this.$route.query.id) {
        return router.push({name: "Role"});
      } else {
        api.getRoleDetail(this.$route.query.id).then((response) => {
          if (!_.get(response, 'data.data')) {
            this.$message({
              message: "Vai trò không tồn tại!",
              type: "error",
            });
            return router.push({name: "Role"});
          } else {
            this.role = _.get(response, 'data.data')
            this.updateRoleDetail(_.get(response, 'data.data'))
          }
        }).catch((error) => {
          this.$message.error(_.get(error.response))
        })
      }
    }
  },
  mounted() {
    if (this.hasPermission('get-permission')) {
      this.changePageTitle();
      this.changeIndexSidebar();
      this.getDataRoleDetail()
      this.getData()
    } else {
      this.$message({
        message: "Bạn không có quyền thực hiện tác vụ này!",
        type: "error",
        center: true,
      });
      return router.push({ name: "Home" });
    }
  }
}
</script>

<style lang="scss" scoped>
.permission {
  .permission-main {
    .permission-head {
      margin-bottom: 30px;
      .role-name {
        margin: 0;
        display: inline;
      }
    }
    .all-permission {
      height: 74vh;
      overflow-y: auto;
      overflow-x: hidden;
      margin-top: 30px;
    }
    .all-permission::-webkit-scrollbar {
      width: 10px;
    }
    .all-permission::-webkit-scrollbar-thumb {
      background-color: #C0C4CC;
      border-radius: 8px;
    }
  }
}
</style>