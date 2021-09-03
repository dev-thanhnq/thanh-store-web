<template>
  <div class="container">
    <el-col :md="17" class="left-detail">
      <div>
        <el-row class="order-detail">
          <el-row :gutter="20">
            <el-col :md="14">
              <span class="title-pending" v-if="order.status == 1"
                >Chi tiết đơn hàng #{{ order.code }} -
                <span class="box-pending">Chờ xử lý</span></span
              >
              <span class="title-approved" v-if="order.status == 2"
                >Chi tiết đơn hàng #{{ order.code }} -
                <span class="box-approved">Đã xử lý</span></span
              >
              <span class="title-delivered" v-if="order.status == 3"
                >Chi tiết đơn hàng #{{ order.code }} -
                <span class="box-delivered">Đang giao</span></span
              >
              <span class="title-shipped" v-if="order.status == 4"
                >Chi tiết đơn hàng #{{ order.code }} -
                <span class="box-shipped">Đã giao</span></span
              >
              <span class="title-canceled" v-if="order.status == 5"
                >Chi tiết đơn hàng #{{ order.code }} -
                <span class="box-canceled">Đã hủy</span></span
              >
              <span class="title-returned" v-if="order.status == 6"
                >Chi tiết đơn hàng #{{ order.code }} -
                <span class="box-returned">Trả hàng</span></span
              >
            </el-col>
            <el-col :md="10" class="title-money">
              Giá trị đơn hàng:<span>
                {{ formatMoney(order.total_value) }} VNĐ
              </span>
            </el-col>
          </el-row>
          <el-table
              height="35vh"
              :data="order.items"
              style="width: 100%; margin-top: 15px"
            >
              <el-table-column
                prop="image"
                label="Ảnh"
                width="75px"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    class="product-image"
                    v-if="scope.row.image"
                    :src="baseUrl + scope.row.image"
                    alt=""
                  />
                  <img
                    class="product-image"
                    v-else
                    src="../assets/images/product.jpg"
                    alt=""
                  />
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" label="Tên sản phẩm">
              </el-table-column>
              <el-table-column align="center" prop="sku" label="SKU">
              </el-table-column>
              <el-table-column align="center" prop="date" label="Số lượng">
                <template slot-scope="scope">
                  {{ scope.row.quantity }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="Giá bán">
                <template slot-scope="scope">
                  {{ formatMoney(scope.row.sale_price) }} VNĐ
                </template>
              </el-table-column>
              <el-table-column align="center" label="Tổng cộng">
                <template slot-scope="scope">
                  {{ formatMoney(scope.row.sale_price * scope.row.quantity) }}
                  VNĐ
                </template>
              </el-table-column>
            </el-table>
        </el-row>
        <el-row class="order-detail-status"
          ><div>
            <div class="title-status">
              <span
                ><i
                  style="color: #34d399; margin-botton: 5px; padding-right: 5px"
                  class="fa fa-truck"
                ></i>
                Trạng thái đơn hàng</span
              >
            </div>
            <div style="margin-right: 55px">
              <el-timeline>
                <el-timeline-item
                  v-for="history in order.histories"
                  :key="history._id"
                  size="large"
                  type="primary"
                  :color="generateColor(history)"
                  :timestamp="formatDate(history.updated_at)"
                >
                  <div v-if="history.status == 1">Chờ xử lý</div>
                  <div v-if="history.status == 2">Đã xử lý</div>
                  <div v-if="history.status == 3">Đang giao</div>
                  <div v-if="history.status == 4">Đã giao</div>
                  <div v-if="history.status == 5">Đã hủy</div>
                  <div v-if="history.status == 6">Trả hàng</div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-row>
      </div>
    </el-col>
    <el-col :md="7" class="right-detail">
      <el-row class="order-detail-note">
        <div>
          <div class="title-note">
            <span
              ><i
                style="color: #facc15; padding-right: 5px"
                class="fa fa-sticky-note"
              ></i>
              Ghi chú</span
            >
          </div>
          <div class="note" v-if="order.note">
            {{ order.note }}
          </div>
          <div class="note" v-else>Không có ghi chú</div>
        </div>
      </el-row>
      <el-row class="order-detail-info">
        <div>
          <div class="title-note">
            <span
              ><i
                style="color: #38bdf8; padding-right: 5px"
                class="fa fa-info-circle"
              ></i>
              Thông tin khách hàng</span
            >
          </div>
          <div class="info-customer">
            <span v-if="order.customer"
              >Mã khách hàng: {{ order.customer.code }}</span
            >
            <br />
            <br />
            <span v-if="order.customer">Họ tên: {{ order.customer.name }}</span>
            <br />
            <br />
            <span v-if="order.customer">SĐT: {{ order.customer.phone }}</span>
            <br />
            <br />
            <span v-if="order.customer.email"
              >Email: {{ order.customer.email }}</span
            >
            <br />
            <br />
            <el-divider></el-divider>
          </div>
          <div class="title-note">
            <span
              ><i
                style="color: #fb923c; padding-right: 5px"
                class="fa fa-map-marker"
              ></i>
              Thông tin người nhận</span
            >
          </div>
          <div class="address">
            <span v-if="order.receiver">Họ tên: {{ order.receiver }}</span>
            <br />
            <br />
            <span v-if="order.receiver_phone"
              >SĐT: {{ order.receiver_phone }}</span
            >
            <br />
            <br />
            <span v-if="order.receiver"
              >Địa chỉ nhận hàng: {{ order.delivery_address }}</span
            >
          </div>
        </div>
      </el-row>
    </el-col>
  </div>
</template>

<script>
import router from "@/router";
import api from "../api";
import _ from "lodash";
import moment from "moment";
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "orderDetail",
  data() {
    return {
      textarea: "",
      timeout: null,
      searchUsers: "",
      noteCart: "",
      dialogUser: false,
      checkUser: true,
      order: [],
      histories: [],
      baseUrl: process.env.VUE_APP_BASE_URL + "/storage/",
    };
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    formatMoney(data) {
      if (data) {
        return parseInt(data).toLocaleString("vi-VN");
      }
    },
    formatDate(dateString) {
      return moment(dateString).format("HH:mm DD/MM/YYYY");
    },
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("");
    },
    changeIndexSidebar() {
      this.updateSideBar("5");
    },
    generateColor(history) {
      let color = "#54657a";
      if (history && history.status) {
        switch (history.status) {
          case 2:
            color = "#0080dd";
            break;
          case 3:
            color = "#4bb6d8";
            break;
          case 4:
            color = "#22C55E";
            break;
          case 5:
            color = "#f54b5e";
            break;
          case 6:
            color = "#f2994a";
            break;
        }
      }
      return color;
    },
  },
  mounted() {
    if (this.hasPermission('get-detail-order')) {
      this.changePageTitle();
      this.changeIndexSidebar();
      if (!this.$route.query.id) {
        return router.push({ name: "Order" });
      } else {
        api
            .getOrder(this.$route.query.id)
            .then((response) => {
              this.order = _.get(response, "data.data");
            })
            .catch(() => {
              this.order = [];
            });
      }
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

<style lang="scss" scoped>
@import "../assets/styles/variables";
.left-detail {
  padding-right: 10px;
}
.right-detail {
  padding-left: 10px;
}
.title-money {
  font-size: 18px;
  font-weight: 600;
  span {
    color: #ef4444;
  }
}
.title-note {
  font-size: 18px;
  font-weight: bold;
}
.title-status {
  padding: 0 0px 15px 0;
  font-size: 18px;
}
.info-customer {
  padding: 24px;
}
.address {
  padding: 24px;
}
.note {
  padding: 10px 0px 0px 24px;
}
.order-detail {
  border-radius: 5px;
  min-height: 46vh;
  max-height: 46vh;
  background-color: white;
  box-shadow: 0 0 20px #d8e0ea;
  padding: 20px;
}
.order-detail-note {
  border-radius: 5px;
  min-height: 25vh;
  max-height: 25vh;
  background-color: white;
  box-shadow: 0 0 20px #d8e0ea;
  padding: 20px 0 0 20px;
  overflow: auto;
}
.order-detail-note::-webkit-scrollbar {
  width: 8px;
}
.order-detail-note::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 8px;
}
.order-detail-status {
  border-radius: 5px;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 0 20px #d8e0ea;
  min-height: 47.5vh;
  max-height: 47.5vh;
  overflow: auto;
  font-size: 16px;
  font-weight: bold;
  padding: 20px 0 0 20px;
}
.order-detail-status::-webkit-scrollbar {
  width: 8px;
}
.order-detail-status::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 8px;
}
.order-detail-info {
  border-radius: 5px;
  margin-top: 20px;
  min-height: 68.5vh;
  max-height: 68.5vh;
  background-color: white;
  box-shadow: 0 0 20px #d8e0ea;
  padding: 20px 0 0 20px;
  word-break: break-word;
}
.order-detail::-webkit-scrollbar {
  width: 8px;
}
.order-detail::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 8px;
}
.title-pending {
  font-size: 18px;
  font-weight: 600;
}
.box-pending {
  color: $colorSecond;
}
.title-approved {
  font-size: 18px;
  font-weight: 600;
}
.box-approved {
  color: $colorMain;
}
.title-delivered {
  font-size: 18px;
  font-weight: 600;
}
.box-delivered {
  color: $colorMellowGreen;
}
.title-shipped {
  font-size: 18px;
  font-weight: 600;
}
.box-shipped {
  color: $colorBrandText;
}
.title-canceled {
  font-size: 18px;
  font-weight: 600;
}
.box-canceled {
  color: $colorRed;
}
.title-returned {
  font-size: 18px;
  font-weight: 600;
}
.box-returned {
  color: $colorOrange;
}
.product-image {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-divider--horizontal {
  margin: 0px 0;
}
@media only screen and (max-width: 992px) {
  .order-detail {
    min-height: 50vh;
    max-height: 50vh;
  }
  .left-detail {
    padding: 0;
  }
  .right-detail {
    padding: 0;
    margin-top: 20px;
  }

  .title-pending {
    font-size: 16px;
  }
  .title-approved {
    font-size: 16px;
  }
  .title-delivered {
    font-size: 16px;
  }
  .title-shipped {
    font-size: 16px;
  }
  .title-canceled {
    font-size: 16px;
  }
  .title-returned {
    font-size: 16px;
  }
  .title-money {
    font-size: 16px;
  }
}
@media only screen and (max-width: 768px) {
  .order-detail {
    min-height: 52vh;
    max-height: 52vh;
  }
  .el-table {
    font-size: 12px;
  }
  .title-pending {
    font-size: 14px;
  }
  .title-approved {
    font-size: 14px;
  }
  .title-delivered {
    font-size: 14px;
  }
  .title-shipped {
    font-size: 14px;
  }
  .title-canceled {
    font-size: 14px;
  }
  .title-returned {
    font-size: 14px;
  }
  .title-money {
    font-size: 14px;
  }
}
</style>