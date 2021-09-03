<template>
  <div class="product-detail">
    <el-card class="product-info">
      <div class="first-session">
        <h2 class="product-name">
          {{product.name}}
        </h2>
        <div class="sub">
          <el-row :gutter="20">
            <el-col :sm="12" :md="7">
              <div class="product-image">
                <img
                    class="product-image"
                    v-if="product.image"
                    :src="baseUrl + product.image"
                    alt=""
                />
                <img
                    class="product-image"
                    v-else
                    src="../assets/images/product.jpg"
                    alt=""
                />
              </div>
            </el-col>
            <el-col :sm="12" :md="7">
              <div class="all-detail">
                <span>SKU:</span>
                <p class="detail">{{product.sku}}</p>
              </div>
              <div class="all-detail">
                <span>Giá nhập: </span>
                <p class="detail"> {{ formatMoney(product.original_price) }} VNĐ</p>
              </div>
              <div class="all-detail">
                <span>Giá bán: </span>
                <p class="detail">  {{ formatMoney(product.sale_price) }} VNĐ</p>
              </div>
              <div class="all-detail">
                <span>Tồn kho: </span>
                <p class="detail">{{Number(product.quantity_in_stock).toLocaleString("vi-VN")}}</p>
              </div>
              <div class="all-detail">
                <span>Khối lượng: </span>
                <p class="detail">{{Number(product.weight).toLocaleString("vi-VN")}} gam</p>
              </div>
              <div class="all-detail">
                <span>Danh mục: </span>
                <p class="detail" v-for="(category, index) in product.categories" :key="index">
                  <b>
                    {{ category.name }}<span v-if="index + 1 != product.categories.length">,</span>
                  </b>
                </p>
              </div>
            </el-col>
            <el-col :sm="24" :md="10">
              <div v-if="product.description" class="all-detail">
                <p class="title-note">Mô tả sản phẩm: </p>
                <p class="description">{{product.description}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="history">
        <h1>Lịch sử nhập hàng</h1>
        <el-table
            ref="multipleTable"
            style="width: 100%"
            height="calc(100vh - 435px)"
            :data="product.histories"
        >
          <el-table-column align="center" prop="created_at" label="Thời gian nhập hàng">
            <template slot-scope="scope">
              {{formatDate(scope.row.created_at)}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="quantity" label="Số lượng nhập">
            <template slot-scope= "scope">
              {{formatMoney(scope.row.quantity)}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="total_value" label="Tồn kho sau nhập">
            <template slot-scope="scope">
              {{formatMoney(scope.row.quantity_in_stock)}}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="creator_name" label="Người nhập hàng">
            <template slot-scope="scope" v-if="scope.row.user">
              {{scope.row.user.name}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import moment from "moment";
import router from "@/router";
import api from "@/api";
import _ from "lodash";
export default {
name: "ProductDetail",
  data () {
    return {
      product: [],
      histories: [],
      baseUrl: process.env.VUE_APP_BASE_URL + "/storage/",
    }
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("Chi tiết sản phẩm");
    },
    changeIndexSidebar() {
      this.updateSideBar("3");
    },
      formatDate(dateString) {
      return moment(dateString).format("HH:mm DD/MM/YYYY");
    },
     formatMoney(data) {
      if (data) {
        return parseInt(data).toLocaleString("vi-VN");
      }
    },
  },
  mounted() {
    if (this.hasPermission('get-detail-product')) {
      this.changePageTitle();
      this.changeIndexSidebar();
      if (!this.$route.query.id) {
        return router.push({ name: "Products" });
      } else {
        api.getProduct(this.$route.query.id).then((response) => {
          this.product = _.get(response, "data.data");
          console.log(_.get(response, "data.data"))
        }).catch(() => {
          this.product = [];
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
  }
}
</script>

<style lang="scss" scoped>
  .product-info {
    height: 100%;
    .first-session {
      .product-name {
        margin: 0;
        padding-bottom: 10px;
      }
      .sub {
        .product-image {
          width: 100%;
          img {
            width: 160px;
            height: 160px;
            object-fit: cover;
          }
        }
        .all-detail {
          margin-bottom: 10px;
          .detail {
            display: inline;
            font-weight: bold;
            margin-left: 7px;
          }
          .description {
            line-height: 2;
            text-align: justify;
            word-break: break-word;
          }
          .title-note {
            font-weight: bold;
          }
        }
        @media only screen and (max-width: 992px) {
          .all-detail {
            margin-top: 10px;
          }
        }
      }
    }
    .history {
      margin-top: 20px;
      padding-bottom: 10px;
    }
    @media only screen and (max-width: 768px) {
      .el-table {
        font-size: 12px;
      }
    }
  }
</style>
