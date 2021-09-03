<template>
  <div class="permission-group">
    <div class="parent">
      <i v-if="!isShow" class="fa fa-chevron-right show" aria-hidden="true" @click="showChild"></i>
      <i v-else class="fa fa-chevron-down hidden" aria-hidden="true" @click="hideChild"></i>
      <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="updateGroupPermissionForRole(permissionGroup._id)">
        {{permissionGroup.name}}
      </el-checkbox>
    </div>
    <el-collapse-transition>
      <div class="child" v-if="isShow">
        <el-checkbox-group v-model="checkedPermission">
          <el-checkbox
              v-for="permission in permissionGroup.permissions"
              :label="permission._id" :key="permission._id"
              @change="updatePermissionForRole(permission._id)"
              class="child-check">
            {{permission.display_name}}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import api from '@/api';
import _ from "lodash";
import {mapMutations, mapState} from "vuex";
export default {
  props: ['permissionGroup',],
name: "PermissionGroup",
  data () {
    return {
      isShow: true,
      checkAll: false,
      checkedPermissions: [],
      isIndeterminate: false,
      checkedPermission: [],
    }
  },
  computed: {
    ...mapState('role', ['role']),
  },
  methods: {
    ...mapMutations('role', [
      'updateRoleDetail'
    ]),
    showChild(){
      this.isShow = true
    },
    hideChild(){
      this.isShow = false
    },
    getRole(id) {
      api.getRoleDetail(id).then((response) => {
        this.updateRoleDetail(_.get(response, 'data.data'))
        if (!this.role){
          this.$router.push('/roles')
        }
      })
    },
    updateGroupPermissionForRole(id) {
      let data = {
        permission_id: id
      }
      if (!this.isIndeterminate && !this.checkAll) {
        api.removePermissionForRole(this.role._id, data).then(()=>{
          this.getRole(this.role._id);
        }).catch((error)=>{
          this.$message.error(_.get(error.response))
        })
      } else {
        api.addPermissionForRole(this.role._id, data).then(()=>{
          this.getRole(this.role._id);
        }).catch((error)=>{
          this.$message.error(_.get(error.response))
        })
      }
    },
    updatePermissionForRole(id) {
      let data = {
        permission_id: id
      }
      let isset = this.checkedPermission.includes(id);
      if (isset) {
        api.addPermissionForRole(this.role._id, data).then(()=>{
          this.getRole(this.role._id);
        }).catch((error)=>{
            this.$message.error(_.get(error.response))
        })
      } else {
        api.removePermissionForRole(this.role._id, data).then(()=>{
          this.getRole(this.role._id);
        }).catch((error)=>{
            this.$message.error(_.get(error.response))
        })
      }
    },
    getPermissonRoleId () {
      let permissionRoleId = [];
      let per = null
      if (this.role.length != 0) {
        this.permissionGroup.permissions.forEach(permission => {
          if (this.role.permission_ids) {
            per = this.role.permission_ids.find(item => permission._id == item)
            if (per) {
              permissionRoleId.push(per);
            }
          }
        })
      }
      return permissionRoleId;
    },
    equar(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false
      } else {
        arr1.forEach((item, index) => {
          if (item.id != arr2[index]) {
            return false;
          }
        })
        return true;
      }
    },
    getPermissionGroup () {
      let groupPermission = [];
      this.permissionGroup.permissions.forEach(permission => {
        groupPermission.push({
          'id': permission._id,
          'display_name': permission.display_name
        });
      })
      return groupPermission;
    },
    setValue() {
      this.isIndeterminate = true;
      this.checkAll = false;
      let permissionRoleId = this.getPermissonRoleId();
      let groupPermission = this.getPermissionGroup();
      let isEquar = this.equar(groupPermission, permissionRoleId)
      if (isEquar) {
        this.isIndeterminate = false;
        this.checkAll = true
      }
      this.checkedPermission = permissionRoleId;
      if (this.checkedPermission.length == 0) {
        this.isIndeterminate = false;
        this.checkAll = false;
      }
    }
  },
  watch: {
    role () {
      this.setValue()
    }
  },
  mounted() {
    this.setValue()
  },
}
</script>

<style lang="scss" scoped>
.permission-group {
  .parent{
    i{
      font-size: 14px;
      margin-right: 20px;
      font-weight: bold;
      width: 20px;
      text-align: center;
    }
    input{
      margin-right: 10px;
    }
  }
  .child{
    padding: 10px 0 0px 81px;
    transition: 0.5s;
    .sub-child{
      padding: 10px 0;
      input{
        margin-right: 10px;
        cursor: pointer;
      }
    }
    .el-checkbox-group{
      display: flex;
      flex-direction: column;
    }
    .child-check {
      margin-bottom: 7px;
    }
  }
}
</style>