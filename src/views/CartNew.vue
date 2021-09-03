<template>
  <div class="cart">
    <div class="cart-container">
      <el-row class="cart-row-1">
        <el-col class="layout-left" :sm="17">
          <div class="order-container">
            <div class="order">
              <el-table
                :show-header="false"
                :data="ListsCart"
                style="width: 100%"
                v-loading="loading"
              >
                <el-table-column width="100" align="center" label="Ảnh">
                  <template slot-scope="scope">
                    <img
                      v-if="scope.row.product.image"
                      :src="baseUrl + scope.row.product.image"
                      alt=""
                      class="img-product"
                    />
                    <img
                      v-else
                      src="../assets/images/default-image.png"
                      alt=""
                      class="img-product"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="SKU">
                  <template slot-scope="scope">
                    {{ scope.row.product.sku }}
                  </template>
                </el-table-column>
                <el-table-column label="Tên sản phẩm">
                  <template slot-scope="scope">
                    {{ scope.row.product.name }}
                  </template>
                </el-table-column>
                <el-table-column width="100px" prop="date" label="Số lượng">
                  <template slot-scope="scope">
                    <el-input-number
                        v-if="hasPermission('add-cart')"
                      size="small"
                      style="width: 90px"
                      v-model="scope.row.quantity"
                      @change="
                        changeQuantity(scope.row.product_id, scope.row.quantity)
                      "
                      controls-position="right"
                      :min="1"
                      :max="scope.row.product.quantity_in_stock"
                    ></el-input-number>
                    <el-input-number
                        v-else
                        size="small"
                        style="width: 90px"
                        v-model="scope.row.quantity"
                        @change="
                        changeQuantity(scope.row.product_id, scope.row.quantity)
                      "
                        controls-position="right"
                        :min="1"
                        :max="scope.row.product.quantity_in_stock"
                        :disabled="true"
                    ></el-input-number>
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="120px"
                  align="right"
                  label="Giá bán"
                >
                  <template slot-scope="scope">
                    {{ formatMoney(scope.row.product.sale_price) }} VNĐ
                  </template>
                </el-table-column>
                <el-table-column
                  min-width="120px"
                  align="right"
                  label="Tổng cộng"
                >
                  <template slot-scope="scope">
                    {{
                      formatMoney(
                        scope.row.product.sale_price * scope.row.quantity
                      )
                    }} VNĐ
                  </template>
                </el-table-column>
                <el-table-column v-if="hasPermission('add-cart')" label="Hành động" align="center" width="70px">
                  <template slot-scope="scope">
                    <el-button
                      @click="deleteCart(scope.row._id)"
                      size="mini"
                      type="danger"
                      plain
                      ><i class="fa fa-trash-o"></i
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-if="hasPermission('add-cart')" class="cart-row-container">
            <div class="cart-row">
              <div>
                <el-row class="header-product">
                  <el-col :md="12" class="search-product">
                    <el-input
                      size="small"
                      placeholder="Tìm mặt hàng"
                      clearable
                      @clear="handleSearch"
                      @keydown.enter.native="handleSearch"
                      prefix-icon="fa fa-search"
                      v-model="searchProduct"
                    >
                    </el-input>
                    <el-button size="small" @click="handleSearch"
                      >Tìm kiếm</el-button
                    >
                  </el-col>
                  <el-col :md="12" class="page">
                    <el-pagination
                      background
                      layout="prev, pager, next"
                      :page-size="20"
                      :total="total"
                      @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                  </el-col>
                </el-row>
                <div v-if="cartsData && cartsData.length" class="content-product">
                  <div
                    v-for="cartdt in cartsData"
                    :key="cartdt._id"
                    @click="addCart(cartdt._id)"
                    class="content-row"
                  >
                    <div class="product-image">
                      <img
                        v-if="cartdt.image"
                        style="width: 100%"
                        :src="baseUrl + cartdt.image"
                      />
                      <img
                        v-else
                        style="width: 100%"
                        src="../assets/images/default-image.png"
                        alt=""
                      />
                      <span class="product-money">{{
                        formatMoney(cartdt.sale_price)
                      }}</span>
                      <span
                        v-show="!cartdt.quantity_in_stock"
                        class="product-status"
                        >Hết hàng</span
                      >
                    </div>
                    <p class="text-sku">{{ cartdt.sku }}</p>
                    <p class="text-product">{{ cartdt.name }}</p>
                  </div>
                </div>
                <div v-else class="text-list-product">
                  <span>Không tìm thấy sản phẩm</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col class="layout-right" :sm="7">
          <div class="total-value">
            <div class="form-cart-container">
                <div class="form-cart-chill">
                    <el-autocomplete
                        v-if="checkUser"
                        class="user"
                        prefix-icon="fa fa-search"
                        v-model="searchUsers"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="Tìm kiếm khách hàng"
                        @select="handleSelect"
                        size="small"
                    >
                        <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                        </template>
                        <el-button v-if="hasPermission('create-customer')"
                        @click="dialogUser = true"
                        slot="append"
                        icon="fa fa-plus"
                        ></el-button>
                    </el-autocomplete>
                    <div v-else class="user">
                        <div class="user-name">
                        <div class="user-name-icon">
                            <i class="fa fa-user" aria-hidden="true"></i>
                            <span>{{ dataUser.name }}</span>
                        </div>
                        <i
                            @click="actionUserExit()"
                            class="fa fa-times-circle-o close-user"
                            aria-hidden="true"
                        ></i>
                        </div>
                    </div>
                    <div v-if="!checkUser">
                        <el-form
                        class="form-cart"
                        :model="formCart"
                        :rules="rulesCart"
                        ref="form"
                        >
                            <span class="input-label"
                            >Tên người nhận <span>*</span>
                            </span>
                        <el-form-item prop="nameCart">
                            <el-input
                            size="small"
                            placeholder="Nhập tên người nhận"
                            v-model="formCart.nameCart"
                            >
                            </el-input>
                        </el-form-item>
                        <span class="input-label">
                            Số điện thoại <span>*</span>
                            </span>
                        <el-form-item prop="phoneCart">
                            <el-input
                            size="small"
                            placeholder="Nhập số điện thoại"
                            v-model="formCart.phoneCart"
                            >
                            </el-input>
                        </el-form-item>
                        <span class="input-label">
                            Địa chỉ giao hàng <span>*</span>
                            </span>
                        <el-form-item prop="addressCart">
                            <el-input
                            placeholder="Nhập địa chỉ"
                            type="textarea"
                            :autosize="{ minRows: 1.5 }"
                            v-model="formCart.addressCart"
                            >
                            </el-input>
                        </el-form-item>
                        <span class="input-label"> Phí vận chuyển </span>
                        <el-form-item prop="payCart">
                            <el-input
                            size="small"
                            autocomplete="off"
                            type="text"
                            :min="0"
                            @input="formatPayCart"
                            @focus="$event.target.select()"
                            placeholder="Nhập phí vận chuyển"
                            v-model="formCart.payCart"
                            >
                            <template slot="append">VNĐ</template>
                            </el-input>
                        </el-form-item>
                        <span class="input-label"> Ghi chú </span>
                        <el-form-item prop="noteCart">
                            <el-input
                            type="textarea"
                            :autosize="{ minRows: 1.5 }"
                            placeholder="Ghi chú"
                            v-model="formCart.noteCart"
                            >
                            </el-input>
                        </el-form-item>
                        </el-form>
                    </div>
                </div>
            
            </div>
            <div class="order-bottom">
              <p class="sum-money">
                Tổng tiền: <span>{{ formatMoney(sumMoneyData) }} VNĐ</span>
              </p>
              <div class="order-add">
                <el-button
                    v-if="hasPermission('add-cart')"
                  style="width: 100%"
                  type="success"
                  @click="addOrder('form')"
                  ><i class="fa fa-plane"></i> Tạo đơn hàng</el-button
                >
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- add new user -->
    <el-dialog
      title="Thêm khách hàng"
      id="add-user-cart"
      top="5vh"
      :visible.sync="dialogUser"
      :before-close="closeAddUser"
    >
      <el-form
        class="form-user"
        :model="form"
        ref="form"
        label-position="top"
      >
        <el-form-item prop="name">
          <label class="label-user"
            >Tên khách hàng <span class="color-vali">*</span></label
          >
          <el-input v-model="form.name" autocomplete="off"></el-input>
          <div v-if="this.errorName !== ''" class="error">
            <span> {{ errorName }} </span>
          </div>
        </el-form-item>
        <el-form-item prop="phone">
          <label class="label-user"
            >Điện thoại <span class="color-vali">*</span></label
          >
          <el-input
            type="text"
            v-model="form.phone"
            autocomplete="off"
          ></el-input>
          <div v-if="this.errorPhone !== ''" class="error">
            <span> {{ errorPhone }} </span>
          </div>
        </el-form-item>
        <el-form-item prop="email">
          <label class="label-user">Email</label>
          <el-input v-model="form.email" autocomplete="off"></el-input>
          <div v-if="this.errorEmail !== ''" class="error">
            <span> {{ errorEmail }} </span>
          </div>
        </el-form-item>
        <el-form-item prop="address">
          <label class="label-user">Địa chỉ</label>
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddUser">Hủy</el-button>
        <el-button type="primary" @click="addUser()">Lưu</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api";
import _ from "lodash";
import {mapGetters, mapMutations} from "vuex";
import { formatMoney } from "@/utils/helper";
import { isValidEmail, isValidPhone } from "../utils/helper";
import router from "@/router";

export default {
  name: "Cart",
  components: {},
  data() {
    return {
      cartsData: [],
      ListsCart: [],
      dataUser: [],
      timeout: null,
      sumMoneyData: 0,
      searchUsers: "",
      dialogUser: false,
      searchProduct: "",
      errorName: "",
      errorPhone: "",
      errorEmail: "",
      form: {
        name: "",
        email: "",
        phone: "",
        address: "",
      },
      checkUser: true,
      baseUrl: process.env.VUE_APP_BASE_URL + "/storage/",
      total: 0,
      currentPage: 1,
      item: [],
      formCart: {
        addressCart: "",
        nameCart: "",
        phoneCart: "",
        payCart: 0,
        noteCart: "",
      },
      rulesCart: {
        nameCart: [
          {
            required: true,
            message: "Tên người nhận không được để trống",
            trigger: "blur",
          },
        ],
        phoneCart: [
          {
            required: true,
            message: "Số điện thoại không được để trống",
            trigger: "blur",
          },
          {
            min: 10,
            max: 11,
            message: "Số điện thoại không đúng",
            trigger: "blur",
          },
        ],
        addressCart: [
          {
            required: true,
            message: "Địa chỉ giao hàng không được để trống",
            trigger: "blur",
          },
        ],
      },
      loading: false
    };
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    ...mapMutations(["updateTitle", "sumCart", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("Bán hàng");
    },
    changeIndexSidebar() {
      this.updateSideBar("0");
    },
    querySearchAsync(queryString, cb) {
      api.getDataCustomer({ q: queryString }).then((response) => {
        let newCustomers = _.get(response, "data.data.data");
        cb(newCustomers);
      });

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {}, 500);
    },
    handleSelect(item) {
      this.dataUser = item;
      this.checkUser = false;
      this.formCart.addressCart = item.address;
      this.formCart.nameCart = item.name;
      this.formCart.phoneCart = item.phone;
    },
    actionUserExit() {
      this.checkUser = true;
      this.dataUser = "";
      this.formCart.addressCart = "";
      this.formCart.nameCart = "";
      this.formCart.phoneCart = "";
    },
    formatPayCart() {
      if (this.formCart.payCart) {
        this.formCart.payCart = formatMoney(this.formCart.payCart);
      }
    },
    closeAddUser() {
      this.reload()
      this.dialogUser = false;
    },
    addUser() {
      if (this.isValidData()) {
        let data = {
          name: this.form.name,
          phone: this.form.phone,
          email: this.form.email,
          address: this.form.address,
        };
        api.addNewCustomer(data).then(() => {
          this.dialogUser = false;
          api.getDataCustomer().then((response) => {
            this.handleSelect(_.get(response, "data.data.data[0]"));
          });
          this.$message({
            message: "Thêm mới khách hàng thành công!",
            type: "success",
          });
        });
      }
    },
    formatMoney(data) {
      return data.toLocaleString("vi-VN");
    },
    deleteCart(id) {
      api
        .deleteCart(id)
        .then(() => {
          this.getCarts();
        })
        .catch(() => {
          this.$message({
            message: "Xóa sản phẩm thất bại!",
            type: "error",
          });
        });
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      let params = {
        page: page,
        q: this.searchProduct,
      };
      api.getDataProducts(params).then((response) => {
        this.cartsData = _.get(response, "data.data.data");
      });
    },
    handleSearch() {
      let params = {
        q: this.searchProduct,
      };
      api.getDataProducts(params).then((response) => {
        this.cartsData = _.get(response, "data.data.data");
        this.total = _.get(response, "data.data.total");
        this.currentPage = _.get(response, "data.data.current_page");
      });
    },
    changeQuantity(id, value) {
      let data = {
        quantity: value,
      };
      api.addUpdateCart(id, data).then(() => {
        this.getCarts();
      });
    },
    addCart(id) {
      api
        .addCart(id)
        .then(() => {
          this.getCarts();
        })
        .catch(() => {
          this.$message({
            message: "Số lượng trong kho không đủ",
            type: "error",
          });
        });
    },
    addOrder(formName) {
      if (this.ListsCart.length) {
        if (this.dataUser) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let data = {
                customer_id: this.dataUser._id,
                note: this.formCart.noteCart,
                delivery_address: this.formCart.addressCart,
                receiver: this.formCart.nameCart,
                receiver_phone: this.formCart.phoneCart,
                transport_fee: this.formCart.payCart,
              };
              api
                .storeOrder(data)
                .then(() => {
                  this.getCarts();
                  this.dataUser = "";
                  this.checkUser = true;
                  this.formCart.noteCart = "";
                  this.formCart.addressCart = "";
                  this.formCart.nameCart = "";
                  this.formCart.phoneCart = "";
                  this.formCart.payCart = "";
                  this.getProducts();
                  this.$message({
                    message: "Đặt hàng thành công!",
                    type: "success",
                  });
                })
                .catch((error) => {
                  this.$message({
                    message: "Lỗi: " + error,
                    type: "error",
                  });
                });
            } else {
              return false;
            }
          });
        } else {
          this.$message({
            message: "Vui lòng chọn khách hàng!",
            type: "error",
          });
        }
      } else {
        this.$message({
          message: "Bạn chưa thêm sản phẩm vào giỏ!",
          type: "error",
        });
      }
    },
    getCarts() {
        this.loading = true
      api.getDataCarts().then((response) => {
        this.ListsCart = _.get(response, "data.data");
        this.sumMoneyData = 0;
        _.get(response, "data.data").map(
          (x) => (this.sumMoneyData += x.quantity * x.product.sale_price)
        );
        this.sumCart(_.get(response, "data.data").length);
        this.loading = false
      });
    },
    getProducts() {
      api.getDataProducts().then((response) => {
        this.cartsData = _.get(response, "data.data.data");
        this.total = _.get(response, "data.data.total");
        this.currentPage = _.get(response, "data.data.current_page");
      });
    },
    isValidData() {
      let error = false;
      this.errorName = "";
      this.errorPhone = "";
      this.errorEmail = "";
      if (this.form.email) {
        if (!isValidEmail(this.form.email)) {
          error = true;
          this.errorEmail = "Email sai định dạng, vui lòng nhập lại";
        }
      }
      if (this.form.name.length === 0) {
        error = true;
        this.errorName = "Tên không được để trống";
      }
      if (!isValidPhone(this.form.phone)) {
        error = true;
        this.errorPhone = "Số điện thoại sai định dạng, vui lòng nhập lại";
      }

      return !error;
    },
    reload() {
      this.errorName = "";
      this.errorPhone = "";
      this.errorEmail = "";
    }
  },
  watch: {
    dialogUser(value) {
      if (!value) {
        this.$refs.form.resetFields();
      }
    },
  },
  mounted() {
    if (this.hasPermission('add-cart')) {
      this.dataUser = "";
      this.changePageTitle();
      this.getProducts();
      this.getCarts();
      this.updateSideBar();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../assets/styles/cart";
</style>
