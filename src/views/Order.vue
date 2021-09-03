<template>
  <div class="dashboard">
    <el-card class="box-search-header">
      <el-row :gutter="20" class="box-search">
        <el-col :sm="12" :md="8" class="box-big-search">
          <el-input
            placeholder="Nhập mã, tên người nhận"
            class="search-name"
            type="text"
            prefix-icon="el-icon-search"
            v-model="search"
            @clear="handleSearch"
            @keydown.enter.native="handleSearch"
            clearable
          ></el-input>
          <div>
          <el-button class="btn-search" @click="handleSearch"
            >Tìm kiếm</el-button
          >
          <el-button
            @click="handleSearch"
            style="margin-left: 15px"
            class="search-glass"
            ><i class="fa fa-search"></i
          ></el-button>
          </div>
        </el-col>
        <el-col :sm="12" :md="7">
          <el-date-picker
            style="width: 100%"
            v-model="valueTime"
            type="daterange"
            start-placeholder="Từ ngày"
            end-placeholder="Đến ngày"
            format="dd/MM/yyyy"
            @change="handleSearch"
          >
          </el-date-picker>
        </el-col>
        <el-col :sm="12" :md="4">
          <el-select
            style="width: 100%"
            placeholder="Chọn trạng thái"
            v-model="statusFilter"
            @change="handleSearch"
            clearable
          >
            <el-option value="1" label="Chờ xử lý">Chờ xử lý</el-option>
            <el-option value="2" label="Đã xử lý">Đã xử lý</el-option>
            <el-option value="3" label="Đang giao">Đang giao</el-option>
            <el-option value="4" label="Đã giao">Đã giao</el-option>
            <el-option value="5" label="Đã hủy">Đã hủy</el-option>
            <el-option value="6" label="Trả hàng">Trả hàng</el-option>
          </el-select>
        </el-col>
        <el-col :sm="12" :md="5" class="bt-excel" v-if="hasPermission('export-excel-order')">
          <el-button type="success" @click="exportExcel"
            ><i class="el-icon-tickets"></i> Xuất Excel</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <div class="box-tabel">
        <el-col style="float: left; margin-bottom: 15px" :span="6">
          <div ref="statusSelect" id="change-status-multi">
            <el-dropdown @command="changeStatusMultipleOrders">
              <el-button type="primary">
                Chuyển trạng thái<i
                  class="el-icon-arrow-down el-icon--right"
                ></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="2">Đã xử lý</el-dropdown-item>
                <el-dropdown-item command="3">Đang giao</el-dropdown-item>
                <el-dropdown-item command="4">Đã giao</el-dropdown-item>
                <el-dropdown-item command="5">Đã hủy</el-dropdown-item>
                <el-dropdown-item command="6">Trả hàng</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
        <el-table
          ref="multipleTable"
          :data="orders"
          v-loading="loading"
          style="width: 100%"
          height="calc(100vh - 360px)"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="hasPermission('change-status-orders')" type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="code" label="Mã đơn hàng">
            <template slot-scope="scope">
              <el-link
                  v-if="hasPermission('get-detail-order')"
                type="primary"
                @click="orderDetail(scope.row._id)"
                class="table-code"
                >{{ scope.row.code }}</el-link
              >
              <a v-else>{{ scope.row.code }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="customer" label="Tên người nhận">
            <template slot-scope="scope">
              {{ scope.row.receiver }}
            </template>
          </el-table-column>
          <el-table-column prop="total_value" label="Tổng tiền">
            <template slot-scope="scope">
              {{ formatMoney(scope.row.total_value) }} VNĐ
            </template>
          </el-table-column>
          <el-table-column prop="status" label="Trạng thái">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 1" class="box-color box-pending">
                Chờ xử lý
              </div>
              <div
                v-if="scope.row.status === 2"
                class="box-color box-processed"
              >
                Đã xử lý
              </div>
              <div
                v-if="scope.row.status === 3"
                class="box-color box-are-delivered"
              >
                Đang giao
              </div>
              <div
                v-if="scope.row.status === 4"
                class="box-color box-delivered"
              >
                Đã giao
              </div>
              <div v-if="scope.row.status === 5" class="box-color box-cancel">
                Đã hủy
              </div>
              <div v-if="scope.row.status === 6" class="box-color box-return">
                Trả hàng
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="delivery_address" label="Địa chỉ nhận hàng">
            <template slot-scope="scope">
              {{ scope.row.delivery_address }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="Ngày tạo đơn">
            <template slot-scope="scope">
              {{ formatDateCreated(scope.row.created_at) }}
            </template>
          </el-table-column>
          <el-table-column
              v-if="hasPermission('get-detail-order') || hasPermission('change-status-order')"
            prop="status"
            align="center"
            label="Hành động"
            class="tabel-work"
          >
            <template slot-scope="scope">
              <el-popover placement="bottom" trigger="click" width="100">
                <div
                    v-if="hasPermission('get-detail-order')"
                  class="box-edit-dailog"
                  @click="orderDetail(scope.row._id)"
                >
                  <i class="fa fa-eye"></i> Xem chi tiết
                </div>
                <div

                  class="box-edit-dailog"
                  @click="changeStatus(scope.row._id, 2)"
                  v-if="scope.row.status === 1 && hasPermission('change-status-order')"
                >
                  <i class="fa fa-check"></i> Đã xử lý
                </div>
                <div
                  class="box-edit-dailog"
                  @click="changeStatus(scope.row._id, 3)"
                  v-if="scope.row.status === 2 && hasPermission('change-status-order')"
                >
                  <i class="fa fa-check"></i> Đang giao
                </div>
                <div
                  class="box-edit-dailog"
                  @click="changeStatus(scope.row._id, 4)"
                  v-if="scope.row.status === 3 && hasPermission('change-status-order')"
                >
                  <i class="fa fa-check"></i> Đã giao
                </div>
                <div
                  class="box-edit-dailog"
                  @click="changeStatus(scope.row._id, 6)"
                  v-if="(scope.row.status === 3 || scope.row.status === 4) && hasPermission('change-status-order')"
                >
                  <i class="fa fa-undo"></i> Trả hàng
                </div>
                <div
                  class="box-edit-dailog"
                  @click="changeStatus(scope.row._id, 5)"
                  v-if="(scope.row.status === 1 || scope.row.status === 2) && hasPermission('change-status-order')"
                >
                  <i class="fa fa-trash"></i> Hủy đơn
                </div>
                <div class="btn-edit" slot="reference">
                  <i class="fa fa-ellipsis-v"></i>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="paginationWarp">
          <el-col :sm="10">
            <div class="textInfo">
              <p>
                Số lượng kết quả: {{ page.from }} - {{ page.to }} của
                {{ page.total }}
              </p>
            </div>
          </el-col>
          <el-col :sm="14">
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
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import router from "@/router";
import api from "../api";
import moment from "moment";
import _ from "lodash";
import {mapMutations, mapGetters} from "vuex";
import { formatDate } from "@/utils/helper";
import { STATUS } from "@/utils/constants";

export default {
  name: "Customer",
  props: {
    msg: String,
  },
  components: {},
  data() {
    return {
      name: "",
      search: "",
      total_value: "",
      status: "",
      note: "",
      errorName: "",
      errorTotalValue: "",
      errorStatus: "",
      orders: [],
      valueTime: "",
      statusFilter: "",
      statusChange: "",
      selectedOrders: [],
      multipleSelection: [],

      loading: true,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0,
      },
    };
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    formatMoney(data) {
      return data.toLocaleString("vi-VN");
    },
    changeStatus(id, status) {
      let data = {
        status: status,
      };
      api
        .changeStatusOrders(id, data)
        .then(() => {
          let params = {
            page: this.currentPage,
            q: this.search,
          };
          api.getDataOrders(params).then((response) => {
            this.orders = _.get(response, "data.data.data");
          });
          this.$message({
            message: "Cập nhật thành công.",
            type: "success",
            center: true,
          });
        })
        .catch(() => {
          this.$message({
            message: "Cập nhật thất bại!",
            type: "error",
            center: true,
          });
        });
      let control = document.getElementsByClassName("el-popper");
      control.forEach((element) => {
        element.style.display = "none";
        element.style.position = "static";
      });
    },
    handleSelectionChange(orders) {
      this.multipleSelection = orders;
      if (orders && orders.length > 0) {
        if (this.$refs.statusSelect) {
          this.$refs.statusSelect.style.display = "block";
        }
      } else {
        if (this.$refs.statusSelect) {
          this.$refs.statusSelect.style.display = "none";
        }
      }
    },
    changeStatusMultipleOrders(status) {
      if (this.hasPermission('change-status-orders')) {
        let quantity = 0;
        let nextStatusText = "";
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          quantity = this.multipleSelection.length;
        }
        switch (parseInt(status)) {
          case 2:
            nextStatusText = "Đã xử lý";
            break;
          case 3:
            nextStatusText = "Đang giao";
            break;
          case 4:
            nextStatusText = "Đã giao";
            break;
          case 5:
            nextStatusText = "Đã Hủy";
            break;
          case 6:
            nextStatusText = "Trả hàng";
            break;
        }

        let message = `Chuyển trạng thái ${
            quantity ? quantity : ""
        } đơn hàng sang ${nextStatusText}. Những đơn không hợp lệ sẽ được bỏ qua`;
        this.$confirm(message, "Cảnh báo", {
          confirmButtonText: "Xác nhận",
          cancelButtonText: "Hủy",
          type: "warning",
        })
        .then(() => {
          let data = {
            order_id: _.map(this.multipleSelection, "_id"),
            status: status,
          };
          api
            .changeStatusMultiOrders(data)
            .then(() => {
              let params = {
                page: this.currentPage,
                q: this.search,
              };
              api.getDataOrders(params).then((response) => {
                this.orders = _.get(response, "data.data.data");
              });
              this.$message({
                message: "Đã cập nhật",
                type: "success",
                center: true,
              });
            })
            .catch(() => {
              this.$message({
                message: "Cập nhật thất bại!",
                type: "error",
                center: true,
              });
            });
        })
        .catch(() => {});
      }
    },
    orderDetail(id) {
      if (router.currentRoute.name !== "OrderDetail" && this.hasPermission('get-detail-order')) {
        return router.push({ name: "OrderDetail", query: { id: id } });
      }
    },
    handleCurrentChange(val) {
      let payload = {
        page: val,
      };
      if (this.search.length > 0) {
        payload.q = this.search;
      }
      if (this.valueTime && this.valueTime) {
        payload = {
          ...payload,
          ...{
            start_time: moment(this.valueTime[0]).unix(),
            end_time: moment(this.valueTime[1]).unix(),
          },
        };
      }
      if (this.statusFilter) {
        payload.status = this.statusFilter;
      }
      this.getDataOrder(payload);
    },
    handleSearch() {
      let payload = {
        page: 1,
      };
      if (this.search.length > 0) {
        payload.q = this.search;
      }
      if (this.valueTime) {
        payload = {
          ...payload,
          ...{
            start_time: moment(this.valueTime[0]).unix(),
            end_time: moment(this.valueTime[1]).unix(),
          },
        };
      }
      if (this.statusFilter) {
        payload.status = this.statusFilter;
      }
      this.getDataOrder(payload);
    },

    formatDateCreated(dateString) {
      return formatDate(dateString);
    },
    getName(row) {
      return `${_.get(row, "customer.name", "")}`;
    },
    ...mapMutations(["updateTitle", "updateSideBar"]),

    changePageTitle() {
      this.updateTitle("Đơn hàng");
    },
    changeIndexSidebar() {
      this.updateSideBar("5");
    },
    getDataOrder(params = {}) {
      this.loading = true;
      api
        .getDataOrders(params)
        .then((res) => {
          this.orders = _.get(res, "data.data.data");

          this.total = res.data.data.total;

          this.page.currentPage = _.get(res, "data.data.current_page");
          this.page.pageSize = _.get(res, "data.data.per_page");
          this.page.total = _.get(res, "data.data.total");
          let from = _.get(res, "data.data.from", 0);
          let to = _.get(res, "data.data.to", 0);
          this.page.from = from ? from : 0;
          this.page.to = to ? to : 0;

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    exportExcel() {
      let payload = {};
      if (this.search.length > 0) {
        payload.q = this.search;
      }
      if (this.valueTime) {
        payload = {
          ...payload,
          ...{
            start_time: moment(this.valueTime[0]).unix(),
            end_time: moment(this.valueTime[1]).unix(),
          },
        };
      }
      if (this.statusFilter) {
        payload.status = this.statusFilter;
      }
      let nameFile = "Danh sách đơn hàng.xlsx";
      if (this.statusFilter == STATUS.PENDING) {
        nameFile = "Danh sách đơn hàng chờ xử lý.xlsx";
      }
      if (this.statusFilter == STATUS.APPROVED) {
        nameFile = "Danh sách đơn hàng đã xử lý.xlsx";
      }
      if (this.statusFilter == STATUS.DELIVERED) {
        nameFile = "Danh sách đơn hàng đang giao.xlsx";
      }
      if (this.statusFilter == STATUS.SHIPPED) {
        nameFile = "Danh sách đơn hàng đã giao.xlsx";
      }
      if (this.statusFilter == STATUS.CANCELED) {
        nameFile = "Danh sách đơn hàng đã hủy.xlsx";
      }
      if (this.statusFilter == STATUS.RETURNED) {
        nameFile = "Danh sách đơn hoàn trả.xlsx";
      }
      api.exportExel(payload).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nameFile);
        document.body.appendChild(link);
        link.click();
      });
    },
  },
  mounted() {
    if (this.hasPermission('get-order')) {
      this.changePageTitle();
      this.getDataOrder();
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

<style scoped lang="scss">
@import "../assets/styles/variables";

.dashboard {
  .box-search-header {
    width: auto;
    .box-search {
      .box-big-search {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn-search {
          margin-left: 10px;
        }
        .search-glass {
          display: none;
        }
      }
      .bt-excel {
        display: flex;
        justify-content: flex-end;
      }
      @media only screen and (max-width: 767px) {
        .el-col {
          margin-bottom: 10px;
        }
        .bt-excel {
          justify-content: left;
          .el-button {
            font-size: 12px;
          }
        }
      }
      @media only screen and (max-width: 992px) {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
  label {
    font-weight: bold;
    margin-bottom: 10px;
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
  margin-top: 20px;
  width: 100%;
  height: 100%;
  .title {
    font-weight: bold;
    font-size: 25px;
    line-height: 40px;
  }
  .btn-add-user {
    height: 40px;
    width: 150px;
    border-radius: 21px !important;
    color: white;
    font-weight: bold;
    background-color: $colorBlue;
  }
  .box-search {
    max-width: 100%;
    label {
      margin-bottom: 10px !important;
    }
    .search-name,
    .search-code {
      margin-top: 10px;
    }
    .search-select {
      width: 100%;
    }
  }
  .box-tabel {
    .tabel-work {
      color: red;
    }
    .table-code {
      font-weight: bold !important;
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
      @media only screen and (max-width: 767px) {
        .textInfo {
          p {
            font-size: 12px;
            text-align: center;
          }
        }
        .el-pagination {
          float: none;
          display: flex;
          justify-content: center;
        }
      }
    }
    .btn-edit {
      cursor: pointer;
    }
    #change-status-multi {
      display: none;
    }
    @media only screen and (max-width: 767px) {
      .el-table {
        font-size: 12px;
      }
    }
  }
  .label-add {
    margin-top: 10px;
  }
  .input-add {
    margin-top: 5px;
    margin-bottom: 10px;
    width: 300px;
  }
  .select-add {
    margin-top: 5px;
    margin-bottom: 10px;
    width: 300px;
  }
  .error {
    color: $colorRed;
    font-size: 12px;
    margin-bottom: 15px;
  }
  .star {
    color: red;
    margin-left: 5px;
  }
}
.btn-edit-work {
  margin-left: 7px !important;
}
.box-edit-dailog {
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  margin: 5px 0;
  padding-left: 5px;
  height: 30px;
  line-height: 30px;
  i {
    margin-right: 5px;
  }
  cursor: pointer;
}
.box-color {
  width: 90px;
  font-weight: bold;
  border-radius: 5px;
  text-align: center;
}
@media only screen and (min-width: 768px) and (max-width: 992px) {
  .box-color {
    width: 75px !important;
    font-size: 12px;
  }
}
@media only screen and (max-width: 768px) {
  .box-color {
    width: 60px;
    font-size: 10px;
  }
  .btn-search {
    display: none !important;
  }
  .search-glass {
    display: inline !important;
  }
}
.box-pending {
  background-color: $colorSecond;
  color: $colorWhite;
}

.box-processed {
  background-color: $colorMain;
  color: $colorWhite;
}
.box-are-delivered {
  background-color: $colorMellowGreen;
  color: $colorWhite;
}
.box-delivered {
  background-color: $colorBrandText;
  color: $colorWhite;
}
.box-cancel {
  background-color: $colorRed;
  color: $colorWhite;
}
.box-return {
  background-color: $colorOrange;
  color: $colorWhite;
}
.dateFrom {
  margin-right: 18px;
}
.dateTo {
  margin-right: 10px;
}
</style>
