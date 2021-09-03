<template>
    <div class="dashboard">
        <el-card>
                <div class="box-search">
                    <el-input class="search-input"
                    placeholder="Nhập tên khách hàng để tìm kiếm"
                    v-model="search"
                    clearable
                    prefix-icon="el-icon-search"
                    @clear="getDataCustomer"
                    @keydown.enter.native="submitSearch">
                    </el-input>
                    <el-button @click="submitSearch" class="search-btn">Tìm kiếm</el-button>
                    <el-button @click="submitSearch" style="margin-left:15px" class="search-glass"><i class="fa fa-search"></i></el-button>
                    <el-button
                        v-if="hasPermission('create-customer')"
                        class="show-card" type="primary"
                        @click="dialogAddCustomer = true">
                      <i class="fa fa-plus"></i> Thêm mới</el-button>
                </div>
            </el-card>

        <el-card style="margin-top:20px" class="customer-table">
                <!-- chinh sua khach hang -->
                <el-dialog
                id="editCustomer"
                    title="Chỉnh sửa khách hàng"
                    :visible.sync="dialogEditCustomer"
                    label-position="top"
                    size="small"
                    width="30%"
                    top="4vh">
                    <el-row class="big-box">
                        <el-col class="box-add-customer">
                            <div class="label-add" style="margin-bottom: 5px;font-weight: bold;">
                                <span>Tên khách hàng</span><span class="star"> *</span>
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
                                <span>Email</span>
                            </div>
                            <el-input class="input-add" v-model="email"></el-input><br>
                            <div v-if="this.errorEmail !== '' " class="error">
                                <span> {{ errorEmail }} </span>
                            </div>
                            <div class="label-add">
                                <span class="label-add">Địa chỉ</span>
                            </div>
                            <el-input class="input-add" v-model="address"></el-input><br>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeEditCustomerBtn">Hủy</el-button>
                        <el-button class="btn-dialog" type="primary" @click="editCustomer">Lưu</el-button>
                    </span>
                </el-dialog>
        <div>
            </div>
            <div class="box-tabel">
                <el-table
                :data="tableData"
                v-loading="loading"
                height="calc(100vh - 345px)"
                style="width: 100%">
                    <el-table-column
                        prop="code"
                        label="Mã khách hàng">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="Tên khách hàng">
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
                        prop="date"
                        label="Ngày tham gia">
                        <template slot-scope="scope">
                            {{ formatDateCreated(scope.row.created_at) }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="hasPermission('update-customer') || hasPermission('delete-customer')"
                        prop="work"
                        label="Hành động"
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
                                    v-if="hasPermission('update-customer')"
                                    class="box-edit-dailog" @click="openEditCustomer(a.row)"><i class="fa fa-pencil"></i> Chỉnh sửa</div>
                                <div
                                    v-if="hasPermission('delete-customer')"
                                    class="box-edit-dailog" @click="deleteCustomer(a.row._id)"><i class="el-icon-delete"></i> Xoá bỏ</div>
                                <div class="btn-edit" slot="reference"><i class="fa fa-ellipsis-v" ></i></div>
                            </el-popover>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paginationWarp">
                <el-col :xs="24"  :span="7">
                    <div class="textInfo">
                    <p>Số lượng kết quả: {{ page.from }} - {{ page.to }} của {{ page.total }} </p>
                    </div>
                </el-col>
                <el-col   class="pagi" :xs="24" :span="17">
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
        <el-dialog
                class="dialog"
                id="addCustomer"
                    :visible.sync="dialogAddCustomer"
                    title="Thêm khách hàng" 
                    label-position="top" 
                    size="small"
                    top="4vh">
                    <el-row class="big-box">
                        <el-col class="box-add-customer">
                            <div class="label-add" style="margin-bottom: 5px;font-weight: bold;">
                                <span>Tên khách hàng</span><span class="star"> *</span>
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
                                <span>Email</span>
                            </div>
                            <el-input class="input-add" v-model="email"></el-input><br>
                            <div v-if="this.errorEmail !== '' " class="error">
                                <span> {{ errorEmail }} </span>
                            </div>
                            <div class="label-add">
                                <span>Địa chỉ</span>
                            </div>
                            <el-input class="input-add" v-model="address"></el-input><br>
                        </el-col>
                    </el-row>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="closeAddCustomerBtn">Hủy</el-button>
                        <el-button class="btn-dialog" type="primary" @click="addNewCustomer">Lưu</el-button>
                    </span>
                </el-dialog>
  </div>
</template>

<script>

import moment from 'moment'
import api from '../api'
import {isValidEmail} from '../utils/helper'
import {isValidPhone} from '../utils/helper'
import {mapGetters, mapMutations,} from 'vuex'
import {formatDate} from "@/utils/helper";
import _ from "lodash";
import router from "@/router";
export default {
  name: 'Customer',
  props: {
    msg: String
  },
  components: {
  },
  data() {
        return {
            id: '',
            name: '',
            phone: '',
            address: '',
            email: '',
            errorName:'',
            errorEmail: '',
            errorPhone:'',
            search:'',
            dialogAddCustomer: false,
            dialogEditCustomer: false,
            tableData: [],

            loading: true,
            page: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
                from: 0,
                to: 0
            },
        }
    },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
    methods: {
      ...mapMutations([
        'updateTitle', 'updateSideBar'
      ]),
      formatDateCreated (dateString) {
        return formatDate(dateString)
        },
      changePageTitle() {
        this.updateTitle('Danh sách khách hàng')
      },
      changeIndexSidebar() {
        this.updateSideBar('4')
      },
        handleCurrentChange(val) {
                let payload = {
                    page: val,
                    q: this.search
                }
            this.getDataCustomer(payload);
        },
        submitSearch() {
            let params = {
                q: this.search,
            };
            this.getDataCustomer(params)
        },
        closeAddCustomerBtn() {
            this.dialogAddCustomer = false
            this.reloadItem()
        },
        closeEditCustomerBtn() {
            this.dialogEditCustomer = false
            this.reloadItem()
        },
        addNewCustomer() {
          if (this.hasPermission('create-customer')) {
            if (this.isValidData()) {
              let data = {
                name: this.name,
                phone: this.phone,
                email: this.email,
                address: this.address,
              }
              api.addNewCustomer(data).then(() => {
                this.$message({
                  message: 'Thêm mới khách hàng thành công!',
                  type: 'success'
                });
                this.reloadItem()
                this.getDataCustomer()
                this.dialogAddCustomer = false
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
          if (this.hasPermission('update-customer')) {
            this.dialogEditCustomer = true
            this.id = data._id
            this.name = data.name
            this.email = data.email
            this.phone = data.phone
            this.address = data.address
          }
        },
        editCustomer() {
          if (this.hasPermission('update-customer')) {
            if (this.isValidData()) {
              let data = {
                id: this.id,
                name: this.name,
                email: this.email,
                phone: this.phone,
                address: this.address,
              }
              api.editCustomer(data).then(() => {
                this.$message({
                  message: 'Sửa khách hàng thành công!',
                  type: 'success',
                  center:true
                });
                this.reloadItem()
                this.getDataCustomer()

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
        deleteCustomer(id) {
          if (this.hasPermission('delete-customer')) {
            this.$confirm('Bạn có chắc chắn muốn xóa không?', 'Cảnh báo', {
              confirmButtonText: 'Xóa',
              cancelButtonText: 'Hủy',
              confirmButtonClass: 'btn-delete-list',
              type: 'warning'
            }).then(() => {
              api.deleteCustomer(id).then(() => {
                this.$message({
                  message: 'Xóa khách hàng thành công!',
                  type: 'success',
                  center:true
                });
                this.getDataCustomer()
              })
            })
          }
        },
        isValidData () {
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
        reloadItem() {
        this.errorName = '';
        this.errorPhone = '';
        this.errorEmail = '';
        this.name = ''
        this.phone = ''
        this.address = ''
        this.email = ''
        this.id = ''
        },
        // lay ra data custom
        getDataCustomer(params = {}) {
            this.loading = true
            api.getDataCustomer(params).then((res) => {
                this.tableData = res.data.data.data
                this.total = res.data.data.total;

                this.page.currentPage = _.get(res, 'data.data.current_page')
                this.page.pageSize = _.get(res, 'data.data.per_page')
                this.page.total = _.get(res, 'data.data.total')
                let from = _.get(res, 'data.data.from', 0)
                let to = _.get(res, 'data.data.to', 0)
                this.page.from = from ? from : 0
                this.pagesearch.to = to ? to : 0

                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        fomatDate(dateString) {
            return moment(dateString).format('DD/MM/YYYY')
        }
    },
    mounted(){
      if (this.hasPermission('get-customer')) {
        this.changePageTitle()
        this.getDataCustomer()
        this.changeIndexSidebar()
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
      }
    }
  }
}
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
                font-size: .92857rem;
                margin: 10px 0;
            }
        }
    }
}
.text {
    font-size: 14px;
  }
.search-input{
    width: 25%;
}
.search-btn{
    margin-left:20px;
}
.show-card{
    float:right;
}
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .btn-edit-work {
        margin-left: 7px!important;
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
    background-color: #F8F9FA;
}
.pop-edit{
    cursor: pointer;
}
.label-add{
      margin-bottom: 5px;
      margin-top: 30px;
      font-weight: bold;
}
.star{
    color:red;
}
.error{
    color:red;
    font-size: 12px;
    width: 250px;
    margin-top: 3px;
}
.search-glass{
    display:none;
}
.dialog{
    width:60%;
    margin: auto;
}

@media only screen and (max-width: 767px){

    .dashboard {
    label {
        font-weight: bold;
        margin-bottom: 5px;
    }
    .paginationWarp {
        padding: 20px 0;
        margin-bottom: 10px;
        .textInfo {
            p {
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .pagi{
            display: flex;align-items: center;justify-content: center;
        }
    }
}
.text {
    font-size: 14px;
  }
.search-input{
    width: 75%;
}
.search-btn{
    display:none;
}
.search-glass{
    display: inline;
}
.show-card{
    float:left;
    margin-top: 10px;
    margin-bottom: 10px;
}
.el-button+.el-button{
    margin-left: 0;
    font-size: 12px;
}
  .btn-edit-work {
        margin-left: 7px!important;
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
.label-add{
      margin-bottom: 5px;
      margin-top: 15px;
      font-weight: bold;
      font-size:12px;
}
.error{
    color:red;
    font-size: 10px;
    width: 100px;
    margin-top: 3px;
}
.el-table{
    font-size: 12px;
}
.el-button{
    font-size:12px;
}
.dialog{
    width: 100% !important;
}
}
</style>
