<template>
    <div class="dashboard">
        <el-card class="card">
                <div class="box-search">
                    <el-input class="search-input"
                    placeholder="Nhập tên nhân viên"
                    v-model="search"
                    prefix-icon="el-icon-search"
                    clearable
                    @clear="getDataUser"
                    @keydown.enter.native="submitSearch">

                    </el-input>
                    <el-button @click="submitSearch" class="search-btn">Tìm kiếm</el-button>
                     <el-button
            @click="submitSearch"
            class="search-glass"
            ><i class="fa fa-search"></i
          ></el-button>
                    <el-button
                        v-if="hasPermission('create-user')"
                        class="show-card"
                        type="primary"
                        @click="dialogAddCustomer = true"><i class="fa fa-plus"></i> Thêm mới</el-button>
                </div>
            </el-card>
        <el-card style="margin-top:20px">
            <!-- them moi khach hang -->
                <el-dialog
                    :visible.sync="dialogAddCustomer"
                    id="addUser"
                    width="30%"
                    title="Thêm nhân viên"
                    label-position="top"
                    size="small"
                    top="5vh">
                    <el-row class="big-box">
                        <el-col class="box-add-customer">
                            <div style="margin-bottom: 5px;font-weight: bold;" class="label-add label-add-header">
                                <span>Tên nhân viên</span><span class="star"> *</span>
                            </div>
                            <el-input class="input-add" v-model="name"></el-input><br>
                            <div v-if="this.errorName !== '' " class="error">
                                <span> {{ errorName }} </span>
                            </div>
                            <div class="label-add">
                                <span>Số điện thoại</span><span class="star"> *</span>
                            </div>
                            <el-input class="input-add" v-model="phone"></el-input><br>
                            <div v-if="this.errorPhone !== '' " class="error">
                                <span> {{ errorPhone }} </span>
                            </div>
                            <div class="label-add">
                                <span class="label-add">Mật khẩu <span class="star"> *</span></span>
                            </div>
                            <el-input type="password" class="input-add" v-model="passwordNew"></el-input><br>
                            <div v-if="this.errorpasswordNew !== '' " class="error">
                                <span> {{ errorpasswordNew }} </span>
                            </div>
                            <div class="label-add">
                                <span>Địa chỉ</span>
                            </div>
                            <el-input class="input-add" v-model="address"></el-input><br>
                            <div class="label-add">
                                <span>Email</span>
                            </div>
                            <el-input class="input-add" v-model="email"></el-input><br>
                            <div v-if="this.errorEmail !== '' " class="error">
                                <span> {{ errorEmail }} </span>
                            </div>
                            <div class="label-add">
                                <span>Vai trò <span class="star"> *</span></span>
                            </div>
                            <el-select v-model="value" style="width: 100%;">
                                <el-option v-for="role in roles" :key="role._id" :value="role._id" :label="role.name">{{ role.name }}</el-option>
                            </el-select>
                            <div v-if="this.errorRole !== '' " class="error">
                                <span> {{ errorRole }} </span>
                            </div>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeAddUserBtn">Hủy</el-button>
                        <el-button type="primary" @click="addNewUser">Lưu</el-button>
                    </span>
                </el-dialog>
                <!-- chinh sua khach hang -->
                <el-dialog
                    title="Chỉnh sửa nhân viên"
                    id="editUser"
                    :visible.sync="dialogEditCustomer"
                    label-position="top"
                    size="small"
                    width="30%"
                    top="5vh">
                    <el-row class="big-box">
                        <el-col class="box-add-customer title-lable">
                            <div style="margin-bottom: 5px;font-weight: bold" class="label-add label-add-header">
                                <span>Tên nhân viên</span><span class="star"> *</span>
                            </div>
                            <el-input class="input-add" v-model="name"></el-input><br>
                            <div v-if="this.errorName !== '' " class="error">
                                <span> {{ errorName }} </span>
                            </div>
                            <div class="label-add">
                                <span>Số điện thoại</span><span class="star"> *</span>
                            </div>
                            <el-input class="input-add" v-model="phone"></el-input><br>
                             <div v-if="this.errorPhone !== '' " class="error">
                                <span> {{ errorPhone }} </span>
                            </div>
                            <div class="label-add">
                                <span class="label-add">Địa chỉ</span>
                            </div>
                            <el-input class="input-add" v-model="address"></el-input><br>
                            <div class="label-add">
                                <span>Email</span>
                            </div>
                            <el-input class="input-add" v-model="email"></el-input><br>
                            <div v-if="this.errorEmail !== '' " class="error">
                                <span> {{ errorEmail }} </span>
                            </div>
                            <div class="label-add">
                                <span>Vai trò <span class="star"> *</span></span>
                            </div>
                            <el-select v-model="value" style="width: 100%;">
                                <el-option v-for="role in roles" :key="role._id" :value="role._id" :label="role.name">{{ role.name }}</el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeEditUserBtn">Hủy</el-button>
                        <el-button type="primary" @click="editUser">Lưu</el-button>
                    </span>
                </el-dialog>
                <!-- reset mat khau -->
                <el-dialog
                    title="Đặt lại mật khẩu"
                    id="resetPassword"
                    :visible.sync="dialogResetPassword"
                    label-position="top"
                    size="small"
                    width="30%"
                    top="5vh">
                    <el-row class="big-box">
                        <el-col class="box-add-customer">
                            <div style="margin-bottom: 5px;" class="label-add label-add-header">
                                <span>Mật khẩu</span><span class="star"> *</span>
                            </div>
                            <el-input class="input-add" v-model="password" type="password"></el-input><br>
                            <div v-if="this.errorPassword !== '' " class="error">
                                <span> {{ errorPassword }} </span>
                            </div>
                            <div class="label-add">
                                <span>Nhập lại mật khẩu</span><span class="star"> *</span>
                            </div>
                            <el-input class="input-add" v-model="confirmPassword" type="password"></el-input><br>
                             <div v-if="this.errorConfimPassword !== '' " class="error">
                                <span> {{ errorConfimPassword }} </span>
                            </div>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeResetPasswordBtn">Hủy</el-button>
                        <el-button type="primary" @click="resetPassword">Lưu</el-button>
                    </span>
                </el-dialog>
            <div>
            </div>
            <div class="box-tabel">
                <el-table
                id="box-table-mini"
                :data="tableData"
                height="calc(100vh - 345px)"
                v-loading="loading"
                style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="Tên nhân viên">
                    </el-table-column>
                    <el-table-column
                        prop="phone"
                        label="Số điện thoại">
                    </el-table-column>
                    <el-table-column
                        prop="email"
                        label="Email">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="Địa chỉ">
                    </el-table-column>
                    <el-table-column
                        label="Vai trò">
                        <template v-slot:default="a">
                            <span>{{roleUser(a.row.role_id)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="hasPermission('update-user') || hasPermission('reset-password-user') ||hasPermission('delete-user')"
                        prop="work"
                        label="Hoạt động"
                        width="90px"
                        align="center"
                        class="tabel-work">
                        <template v-slot:default="a">
                            <el-popover
                                class="pop-edit"
                                placement="bottom"
                                width="100px"
                                trigger="click">
                                <div
                                    v-if="hasPermission('update-user')"
                                    class="box-edit-dailog"
                                    @click="openEditCustomer(a.row)">
                                  <i class="fa fa-pencil"></i> Chỉnh sửa</div>
                                <div
                                    v-if="authUser.permissions[0].name === 'admin'"
                                    class="box-edit-dailog"
                                    @click="openResetPassword(a.row)">
                                  <i class="fa fa-refresh"></i> Đặt lại mật khẩu</div>
                                <div
                                    class="box-edit-dailog" v-if="authUser._id !== a.row._id && hasPermission('delete-user')" @click="deleteUser(a.row._id)"><i class="el-icon-delete"></i> Xoá bỏ</div>
                                <div class="btn-edit" slot="reference"><i class="fa fa-ellipsis-v" ></i></div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>

      </div>
      <div class="paginationWarp">
        <el-col :xs="24" :span="7">
          <div class="textInfo">
            <p>
              Số lượng kết quả: {{ page.from }} - {{ page.to }} của
              {{ page.total }}
            </p>
          </div>
        </el-col>
        <el-col :xs="24" :span="17" class="pagination-box">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.pageSize"
            :current-page="page.currentPage"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-col>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
import api from "../api";
import { isValidEmail, isValidPhone } from "../utils/helper";
import { mapGetters, mapMutations, mapState } from "vuex";
import _ from "lodash";
import router from "@/router";
export default {
  name: "Customer",
  props: {
    msg: String,
  },
  components: {},
  computed: {
    ...mapState("auth", ["authUser"]),
    ...mapGetters("auth", ["hasPermission"]),
  },
  data() {
    return {
            id: '',
            name: '',
            phone: '',
            address: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorName:'',
            errorEmail: '',
            errorPhone:'',
            errorPassword:'',
            errorConfimPassword:'',
            search:'',
            total:0,
            dialogAddCustomer: false,
            dialogEditCustomer: false,
            dialogResetPassword: false,
            tableData: [],
            value: '',
            passwordNew: '',
            errorpasswordNew: '',
            errorRole: '',
            //pagination
            loading: true,
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                from: 0,
                to: 0
            },
            roles: [],
            role: ''
        }
  },
    methods: {
      ...mapMutations([
        'updateTitle','updateSideBar'
      ]),
      changePageTitle() {
        this.updateTitle('Danh sách nhân viên')
      },
        changeIndexSidebar() {
            this.updateSideBar('6')
        },

        //pagination
        handleCurrentChange(val) {
            let payload = {
                page: val,
                q: this.search
            }
            this.getDataUser(payload);
        },

        closeAddUserBtn() {
            this.dialogAddCustomer = false
            this.reloadItem()
        },
        closeEditUserBtn() {
            this.dialogEditCustomer = false
            this.reloadItem()
        },
        addNewUser() {
          if (this.hasPermission('create-user')) {
            if (this.isValidData()) {
              let data = {
                name: this.name,
                phone: this.phone,
                email: this.email,
                address: this.address,
                role_id: this.value,
                password: this.passwordNew
              }
              api.addNewUser(data).then(() => {
                this.$message({
                  message: 'Thêm mới nhân viên thành công!',
                  type: 'success'
                });
                this.dialogAddCustomer = false
                this.reloadItem()
                this.getDataUser()
              }).catch(error => {

                let errors = _.get(error.response,'data.error', {})
                if (Object.keys(errors).length === 0) {
                  this.$message.error({
                    type: 'error',
                    message: _.get(error.response, 'data.message', '')
                  })
                }
                if (Object.keys(errors).length > 0) {
                  this.errorEmail = _.get(errors, 'email[0]', '')
                  this.errorPhone = _.get(errors, 'phone[0]', '')
                }
              });
            }
          }
        },
        openEditCustomer(data) {
          if (this.hasPermission('update-user')) {
            this.dialogEditCustomer = true
            this.id = data._id
            this.name = data.name
            this.email = data.email
            this.phone = data.phone
            this.address = data.address
            this.value = data.role_id
          }
        },
        editUser() {
          if (this.hasPermission('update-user')) {
            if (this.isValidDataEdit()) {
              let data = {
                id: this.id,
                name: this.name,
                email: this.email,
                phone: this.phone,
                address: this.address,
                role_id: this.value,
                password: this.passwordNew
              }
              api.editUser(data).then(() => {
                this.$message({
                  message: 'Sửa nhân viên thành công!',
                  type: 'success',
                  center:true
                });
                this.reloadItem()
                this.getDataUser()
                this.dialogEditCustomer = false
              }).catch(error => {

                let errors = _.get(error.response,'data.error', {})
                if (Object.keys(errors).length === 0) {
                  this.$message.error({
                    type: 'error',
                    message: _.get(error.response, 'data.message', '')
                  })
                }
                if (Object.keys(errors).length > 0) {
                  this.errorEmail = _.get(errors, 'email[0]', '')
                  this.errorPhone = _.get(errors, 'phone[0]', '')
                }
              });
            }
          }
        },
        openResetPassword(data) {
            this.id = data._id
            this.dialogResetPassword = true
        },
        closeResetPasswordBtn() {
            this.dialogResetPassword = false
            this.reloadItem()
        },
        resetPassword() {
            if(this.isValidDataPassWord()) {
                let data = {
                    id: this.id,
                    password: this.password,
                }
                api.resetPassword(data).then(() =>{
                    this.$message({
                        message: 'Đặt lại mật khẩu thành công!',
                        type: 'success',
                        center:true
                    });
                    this.dialogResetPassword = false
                    this.reloadItem()
                })
            }
        },
        deleteUser(id) {
          if (this.hasPermission('delete-user')) {
            this.$confirm('Bạn có chắc chắn muốn xóa không?', 'Cảnh báo', {
              confirmButtonText: 'Xóa',
              cancelButtonText: 'Hủy',
              confirmButtonClass: 'btn-delete-list',
              type: 'warning'
            }).then(() => {
              api.deleteUser(id).then(() => {
                this.$message({
                  message: 'Xóa nhân viên thành công!',
                  type: 'success',
                  center:true
                });
                this.getDataUser()
              })
            })
          }
        },
        isValidData () {
          let error = false;
          this.errorName = '';
          this.errorPhone = '';
          this.errorEmail = '';
          this.errorpasswordNew = '';
          this.errorRole = '';
          if(this.email) {
              if (!isValidEmail(this.email)) {
                  error = true;
                  this.errorEmail = 'Email sai định dạng, vui lòng nhập lại';
              }
          }
          if (this.name.length === 0) {
          error = true;
          this.errorName = 'Tên không được để trống';
          }
          if (this.value.length === 0) {
            error = true;
            this.errorRole = 'Vai trò không được để trống';
        }
          if (!isValidPhone(this.phone)) {
              error = true;
              this.errorPhone = 'Số điện thoại sai định dạng, vui lòng nhập lại';
          }
          if (this.passwordNew.length === 0) {
            error = true;
            this.errorpasswordNew = 'Mật khẩu không được để trống';
          } else if (this.passwordNew.length === 0 && this.passwordNew.length < 6) {
            error = true;
            this.errorpasswordNew = 'Mật khẩu phải lớn hơn 6 ký tự';
          }

          return !error
        },
      isValidDataEdit() {
        let error = false;
        this.errorName = '';
        this.errorPhone = '';
        this.errorEmail = '';
        if(this.email) {
          if (!isValidEmail(this.email)) {
            error = true;
            this.errorEmail = 'Email sai định dạng, vui lòng nhập lại';
          }
        }
        if (this.name.length === 0) {
          error = true;
          this.errorName = 'Tên không được để trống';
        }
        if (!isValidPhone(this.phone)) {
          error = true;
          this.errorPhone = 'Số điện thoại sai định dạng, vui lòng nhập lại';
        }
        return !error
      },
        isValidDataPassWord () {
            let errorResetPW = false;
            this.errorPassword = '';
            this.errorConfimPassword = '';
            if (this.password.length < 6) {
            errorResetPW = true;
            this.errorPassword = 'Mật khẩu phải lớn hơn 6 ký tự';
            }
            if (this.password.length === 0) {
            errorResetPW = true;
            this.errorPassword = 'Mật khẩu không được để trống';
            }
            if (this.confirmPassword.length === 0) {
            errorResetPW = true;
            this.errorConfimPassword = 'Mật khẩu nhập lại không được để trống';
            }
            if (this.confirmPassword !== this.password) {
            errorResetPW = true;
            this.errorConfimPassword = 'Mật khẩu nhập lại không trùng nhau';
            }

            return !errorResetPW
        },
        reloadItem() {
        this.errorName = '';
        this.errorPhone = '';
        this.errorAddRess = '';
        this.errorEmail = '';
        this.name = ''
        this.phone = ''
        this.address = ''
        this.email = ''
        this.id = ''
        this.password = ''
        this.confirmPassword = ''
        this.errorPassword = ''
        this.errorConfimPassword = ''
        this.passwordNew = ''
        this.errorpasswordNew = ''
        },
        roleUser(data) {
            for(let i = 0;i<this.roles.length;i++) {
                if (this.roles[i]._id === data) {
                    return this.roles[i].name
                }
            }
        },
        getRoles() {
            api.getRoleAll().then((res) => {
                this.roles = _.get(res, 'data.data')
            })
        },
        // lay ra data user
        getDataUser(params = {}) {
            this.loading = true
            api.getDataUser(params).then((res) => {

                this.tableData = res.data.data.data

                this.total = res.data.data.total;
                this.page.currentPage = _.get(res, 'data.data.current_page')
                this.page.pageSize = _.get(res, 'data.data.per_page')
                this.page.total = _.get(res, 'data.data.total')
                let from = _.get(res, 'data.data.from', 0)
                let to = _.get(res, 'data.data.to', 0)
                this.page.from = from ? from : 0
                this.page.to = to ? to : 0

                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        // tim kiem khach hang
        submitSearch() {
            let params = {
                q: this.search,
            };
            this.getDataUser(params)
        },
        fomatDate(dateString) {
            return moment(dateString).format('DD/MM/YYYY')
        }
    },
    mounted(){
      if (this.hasPermission('get-user')) {
        this.changePageTitle()
        this.changeIndexSidebar()
        this.getDataUser()
        this.getRoles()
      } else {
        this.$message({
          message: "Bạn không có quyền thực hiện tác vụ này!",
          type: "error",
          center: true,
        });
        return router.push({ name: "Home" });
      }
    },
  watch: {
    dialogAddCustomer (value) {
      if (value) {
        this.id = ''
        this.name = ''
        this.phone = ''
        this.address = ''
        this.email = ''
        this.errorName = ''
        this.errorEmail = ''
        this.errorPhone = ''
        this.errorAddRess = ''
        this.value = ''
        this.passwordNew = ''
        this.errorpasswordNew = ''
        this.errorRole = ''
      }
    },
    dialogEditCustomer (value) {
      if (value) {
        this.errorName = ''
        this.errorEmail = ''
        this.errorPhone = ''
        this.errorAddRess = ''
        this.errorRole = ''
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/styles/variables";

.dashboard {
  label {
    font-weight: bold;
    margin-bottom: 10px;
  }

  .paginationWarp {
    padding: 20px 0;
    margin-bottom: 10px;

    .el-pagination {
      float: right;
    }

    .textInfo {
      p {
        font-size: 0.92857rem;
        margin: 10px 0;
      }
    }
  }
}
.text {
  font-size: 14px;
}
.search-input {
  width: 25%;
}
.search-btn {
  margin-left: 20px;
}
.search-glass {
  display: none;
}
.show-card {
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.btn-edit-work {
  margin-left: 7px !important;
}
.box-edit-dailog {
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  margin-top: 5px;
  margin-bottom: 10px;
  height: 30px;
  line-height: 30px;
  i {
    margin-right: 5px;
  }
  cursor: pointer;
}
.box-edit-dailog:hover {
  background-color: #f8f9fa;
}
.pop-edit {
  cursor: pointer;
}
.label-add {
  margin-bottom: 5px;
  margin-top: 30px;
  font-weight: bold;
}
.star {
  color: red;
}
.error {
  color: red;
  font-size: 12px;
  width: 250px;
  margin-top: 3px;
}
.label-add-header {
  margin-top: 0px;
}
@media only screen and (max-width: 992px) {
  #box-table-mini {
    height: 400px !important;
  }
}
@media only screen and (max-width: 768px) {
  .dashboard {
    label {
      font-weight: bold;
      margin-bottom: 5px;
    }
    .paginationWarp {
      padding: 20px 0;
      margin-bottom: 10px;
      .el-pagination {
        float: right;
      }
      .textInfo,
      .pagination-box {
        display: flex;
        align-items: center;
        justify-content: center;
        p {
          font-size: 12px;
          margin-bottom: 10px;
        }
      }
    }
  }
  .card {
    padding-bottom: 10px;
  }
  .text {
    font-size: 14px;
  }
  .search-input {
    width: 75%;
    padding-left: 5px;
  }
  .search-btn {
    display: none;
  }
  .search-glass {
    display: inline !important;
  }
  .show-card {
    float: left;
    margin-top: 10px;
  }
  .el-button + .el-button {
    margin-left: 5px;
    font-size: 12px;
  }
  .btn-edit-work {
    margin-left: 7px !important;
  }
  .box-edit-dailog {
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    margin-top: 5px;
    margin-bottom: 10px;
    height: 30px;
    line-height: 15px;
    i {
      margin-right: 5px;
    }
    cursor: pointer;
  }
  .label-add {
    margin-bottom: 5px;
    margin-top: 15px;
    font-weight: bold;
    font-size: 12px;
  }
  .label-add-header {
    margin-top: 0px;
  }
  .error {
    color: red;
    font-size: 10px;
    width: 100px;
    margin-top: 3px;
  }
  .el-table {
    font-size: 12px;
  }
  .el-button {
    font-size: 12px;
  }
  .dialog {
    width: 100% !important;
  }
  #box-table-mini {
    height: 250px !important;
  }
  .el-message-box {
    width: 250px !important;
  }
}
</style>
