<template>
  <div class="products">
    <el-card>
      <el-row :gutter="20" class="head-product">
        <el-col :sm="12" :md="11" class="search">
          <el-input
            class="search-input"
            placeholder="Nhập tên sản phẩm hoặc SKU để tìm kiếm"
            v-model="search"
            prefix-icon="el-icon-search"
            clearable
            @clear="handleSearch"
            @keydown.enter.native="handleSearch"
          ></el-input>
          <el-button class="btn-search" @click="handleSearch">Tìm kiếm</el-button>
           <el-button
            @click="handleSearch"
            style="margin-left: 15px"
            class="search-glass"
            ><i class="fa fa-search"></i
          ></el-button>
        </el-col>
        <el-col :sm="12" :md="5">
          <el-select
            placeholder="Nhóm sản phẩm"
            class="search-select"
            v-model="categoryFilter"
            @change="handleSearch"
            clearable
            @clear="handleSearch"
          >
            <el-option
              v-for="category in categories"
              :key="category._id"
              :value="category._id"
              :label="category.name"
              >{{ category.name }}
            </el-option>
          </el-select>
        </el-col>
        <el-col :sm="24" :md="8" class="button-add">
          <el-button
              v-if="hasPermission('create-product')"
            class="show-card"
            type="primary"
            @click="dialogAddProduct = true"
            ><i class="fa fa-plus"></i> Thêm mới</el-button
          >
          <el-button class="show-card" v-if="hasPermission('import-excel-product')" type="success" @click="openDialogExcel"
            ><i class="fa fa-upload"></i> Nhập Excel</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-card class="table-product">
      <el-table
        :data="products"
        stripe
        style="width: 100%"
        v-loading="loading"
        height="calc(100vh - 345px)"
      >
        <el-table-column prop="image" label="Ảnh" width="100px" align="center">
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
        <el-table-column prop="sku" label="SKU">
          <template slot-scope="scope">
            <el-link v-if="hasPermission('get-detail-product')" type="primary" @click="productDetail(scope.row._id)">{{scope.row.sku}}</el-link>
            <a v-else>{{scope.row.sku}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Tên sản phẩm"> </el-table-column>
        <el-table-column prop="categories" label="Nhóm sản phẩm">
          <template slot-scope="scope">
            <a
              v-for="(category, index) in scope.row.categories"
              :key="category._id"
            >
              <b
                >{{ category.name
                }}<span v-if="index + 1 != scope.row.categories.length"
                  >,
                </span></b
              >
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity_in_stock"
          label="Tồn kho"
          align="center"
        >
          <template slot-scope="scope">
            {{ Number(scope.row.quantity_in_stock).toLocaleString("vi-VN") }}
          </template>
        </el-table-column>
        <el-table-column prop="sale_price" label="Giá bán">
          <template slot-scope="scope">
            {{ Number(scope.row.sale_price).toLocaleString("vi-VN") }} VNĐ
          </template>
        </el-table-column>
        <el-table-column prop="original_price" label="Giá nhập">
          <template slot-scope="scope">
            {{ Number(scope.row.original_price).toLocaleString("vi-VN") }} VNĐ
          </template>
        </el-table-column>

        <el-table-column label="Khối lượng" align="center">
          <template slot-scope="scope"> {{ scope.row.weight }} g </template>
        </el-table-column>

        <el-table-column prop="created_at" label="Ngày tạo" align="left">
          <template slot-scope="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column
            v-if="hasPermission('update-product') || hasPermission('get-detail-product') || hasPermission('delete-product') || hasPermission('import-product')"
            label="Hành động"
            align="center">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="100" trigger="click">
              <div v-if="hasPermission('update-product')" class="product-action" @click="editProduct(scope.row)">
                <i class="fa fa-pencil"></i> Chỉnh sửa
              </div>
              <div v-if="hasPermission('import-product')" class="product-action" @click="ImportProduct(scope.row)">
                <i class="fa fa-plus" aria-hidden="true"></i> Nhập hàng
              </div>
              <div v-if="hasPermission('get-detail-product')" class="product-action" @click="productDetail(scope.row._id)">
                <i class="fa fa-eye" aria-hidden="true"></i>Xem chi tiết
              </div>
              <div
                  v-if="hasPermission('delete-product')"
                class="product-action"
                @click="handleDeleteProduct(scope.row._id)"
              >
                <i class="fa fa-trash"></i> Xóa
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
        <el-col class="page-responsive" :sm="14">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.pageSize"
            :current-page="page.currentPage"
            @current-change="handleChangePage"
          >
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      id="add-product-dialog"
      class="dialog-add-product"
      title="Thêm sản phẩm"
      top="5vh"
      :visible.sync="dialogAddProduct"
    >
      <el-row>
        <el-col :md="12">
          <div class="add-product-image-title">Ảnh sản phẩm</div>
          <div class="add-product-image">
            <div class="product-image">
              <label
                for="product-input"
                @mouseover="hoverImage"
                @mouseleave="hoverLeaveImage"
              >
                <div class="productHover" ref="productHover">
                  <i class="fa fa-pencil"></i>
                </div>
                <img
                  v-if="newProductImageUrl"
                  :src="newProductImageUrl"
                  alt=""
                />
                <img v-else src="../assets/images/product.jpg" alt="" />
              </label>
              <input
                ref="productImage"
                type="file"
                accept="image/*"
                id="product-input"
                @change="handleChangeImage"
              />
              <center>
                <div
                  v-if="newProductImageUrl"
                  class="delete-product-image"
                  @click="deleteImage"
                >
                  Xóa ảnh
                </div>
              </center>
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <el-form
            class="form-product"
            :model="form"
            :rules="rules"
            ref="formAddProduct"
            label-position="top"
            hide-required-asterisk
            label-width="130px"
            size="small"
          >
            <el-row>
              <el-col :span="24" class="margin-input">
                <el-form-item prop="name">
                  <label class="label-product"
                    >Tên sản phẩm <span class="required"> *</span></label
                  >
                  <el-input
                    size="medium"
                    v-model="form.name"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="sku">
                  <label class="label-product"
                    >SKU <span class="required"> *</span></label
                  >
                  <el-input
                    size="medium"
                    v-model="form.sku"
                    autocomplete="off"
                    ref="inputSku"
                    class="input-sku"
                  ></el-input>
                  <div v-if="this.errorSku !== ''" class="error">
                    <span> {{ errorSku }} </span>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item prop="original_price">
                        <label class="label-product"
                          >Giá nhập <span class="required"> *</span></label
                        >
                        <el-input
                          size="medium"
                          v-model="form.original_price"
                          autocomplete="off"
                          type="text"
                          @input="formatOriginalPrice"
                        >
                          <template slot="append">VNĐ</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="40">
                      <el-form-item prop="sale_price">
                        <label class="label-product"
                          >Giá bán <span class="required"> *</span></label
                        >
                        <el-input
                          size="medium"
                          v-model="form.sale_price"
                          autocomplete="off"
                          type="text"
                          @input="formatSalePrice"
                        >
                          <template slot="append">VNĐ</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="quantity_in_stock">
                        <label class="label-product"
                          >Tồn kho <span class="required"> *</span></label
                        >
                        <el-input
                          type="text"
                          size="medium"
                          v-model="form.quantity_in_stock"
                          autocomplete="off"
                          @input="formatQuantity"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="weight">
                        <label class="label-product">Khối lượng</label>
                        <el-input
                          size="medium"
                          v-model="form.weight"
                          autocomplete="off"
                          type="text"
                          @input="formatWeight"
                        >
                          <template slot="append">gam</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item prop="category_ids">
                  <label class="label-product">Nhóm sản phẩm</label>
                  <el-select
                    class="select-categories"
                    v-model="form.category_ids"
                    placeholder=""
                    size="medium"
                    multiple
                    filterable
                  >
                    <el-option
                      v-for="category in categories"
                      :key="category._id"
                      :label="category.name"
                      :value="category._id"
                      >{{ category.name }}</el-option
                    >
                  </el-select>
                </el-form-item>
                <el-form-item prop="description">
                  <label class="label-product">Mô tả</label>
                  <el-input
                    size="medium"
                    v-model="form.description"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    autocomplete="off"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddProduct">Hủy</el-button>
        <el-button type="primary" @click="storeProduct('formAddProduct')"
          >Lưu</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      id="add-product-dialog"
      class="dialog-add-product"
      title="Chỉnh sửa sản phẩm"
      top="5vh"
      :visible.sync="dialogEditProduct"
    >
      <el-row>
        <el-col :md="12">
          <div class="add-product-image-title">Ảnh sản phẩm</div>
          <div class="add-product-image">
            <div class="product-image">
              <label for="product-edit-input">
                <img
                  v-if="newProductImageUrl"
                  :src="newProductImageUrl"
                  alt=""
                />
                <img v-else src="../assets/images/product.jpg" alt="" />
              </label>
              <input
                ref="productImage"
                type="file"
                accept="image/*"
                id="product-edit-input"
                @change="handleChangeImage"
              />
            </div>
          </div>
        </el-col>
        <el-col :md="12">
          <el-form
            class="form-product"
            :model="form"
            :rules="rules"
            ref="formEditProduct"
            label-position="top"
            hide-required-asterisk
            label-width="130px"
            size="small"
          >
            <el-row>
              <el-col :span="24" class="margin-input">
                <el-form-item prop="name">
                  <label class="label-product"
                    >Tên sản phẩm <span class="required"> *</span></label
                  >
                  <el-input
                    size="medium"
                    v-model="form.name"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="sku">
                  <label class="label-product"
                    >SKU <span class="required"> *</span></label
                  >
                  <el-input
                    size="medium"
                    v-model="form.sku"
                    autocomplete="off"
                  ></el-input>
                  <div v-if="this.errorSku !== ''" class="error">
                    <span> {{ errorSku }} </span>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item prop="original_price">
                        <label class="label-product"
                          >Giá nhập <span class="required"> *</span></label
                        >
                        <el-input
                          size="medium"
                          v-model="form.original_price"
                          autocomplete="off"
                          type="text"
                          @input="formatOriginalPrice"
                        >
                          <template slot="append">VNĐ</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" :gutter="40">
                      <el-form-item prop="sale_price">
                        <label class="label-product"
                          >Giá bán <span class="required"> *</span></label
                        >
                        <el-input
                          size="medium"
                          v-model="form.sale_price"
                          autocomplete="off"
                          type="text"
                          @input="formatSalePrice"
                        >
                          <template slot="append">VNĐ</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="quantity_in_stock">
                        <label class="label-product"
                          >Tồn kho <span class="required"> *</span></label
                        >
                        <el-input
                          type="text"
                          size="medium"
                          v-model="form.quantity_in_stock"
                          autocomplete="off"
                          @input="formatQuantity"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="weight">
                        <label class="label-product">Khối lượng</label>
                        <el-input
                          size="medium"
                          v-model="form.weight"
                          autocomplete="off"
                          type="text"
                          @input="formatWeight"
                        >
                          <template slot="append">gam</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item prop="category_ids">
                  <label class="label-product">Nhóm sản phẩm</label>
                  <el-select
                    class="select-categories"
                    v-model="form.category_ids"
                    placeholder=""
                    size="medium"
                    multiple
                    filterable
                  >
                    <el-option
                      v-for="category in categories"
                      :key="category._id"
                      :label="category.name"
                      :value="category._id"
                      >{{ category.name }}</el-option
                    >
                  </el-select>
                </el-form-item>
                <el-form-item prop="description">
                  <label class="label-product">Mô tả</label>
                  <el-input
                    size="medium"
                    v-model="form.description"
                    :autosize="{ minRows: 4, maxRows: 6 }"
                    autocomplete="off"
                    type="textarea"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeEditProduct">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleUpdateProduct('formEditProduct')"
          >Lưu</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      id="excel-product"
      title="Nhập Excel"
      :visible.sync="dialogExcel"
      @close="closeImport"
    >
      <div class="subDownload">
        <p>
          Vui lòng tải lên tệp theo mẫu sau:
          <a href="#" @click="downloadExelTemplate"
            ><i class="el-icon-download"></i> Tải xuống tệp mẫu</a
          >
        </p>
      </div>
      <div class="upload-excel">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text" v-html="uploadText"></div>
        <input type="file" @change="changeFile" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDailogExcel">Đóng</el-button>
        <el-button type="primary" @click="importExcel"
          ><i class="el-icon-upload2"></i> Tải lên</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
        id="add-quantini-product"
        title="Nhập hàng"
        :visible.sync="dialogImport"
        class="dialog-add-product"
    >
     <div class="import-info">
        <span>Tên sản phẩm: </span>
        <h1 class="import-sku">{{nameImport}}</h1>
      </div>
      <div class="import-info">
        <span>SKU: </span>
        <h1 class="import-sku">{{skuImport}}</h1>
      </div>
      <el-form
          class="form-product"
          :model="formImport"
          label-position="top"
          hide-required-asterisk
          label-width="130px"
          size="small"
          ref="formImportProduct"
      >
        <el-row>
          <el-col :span="24" class="margin-input">
            <el-form-item prop="quantity">
              <label class="label-product"
              >Số lượng nhập <span class="required"> *</span></label
              >
              <el-input
                  type="text"
                  size="medium"
                  v-model="formImport.quantity"
                  autocomplete="off"
                  @input="formatQuantityImport"
              ></el-input>
              <div v-if="this.errorQuantity !== ''" class="error-quantity">
                <span> {{ errorQuantity }} </span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogImport = false">Đóng</el-button>
        <el-button type="primary" @click="handleImportProduct()">Nhập hàng</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../api";
import {mapMutations, mapGetters} from "vuex";
import { formatMoney, formatStringtoNumber } from "@/utils/helper";
import moment from "moment";
import _ from "lodash";
import router from "@/router";
export default {
  name: "Products",
  data() {
    var validateSalePrice = (rule, value, callback) => {
      if (
        value &&
        this.form.original_price &&
        formatStringtoNumber(value) <
          formatStringtoNumber(this.form.original_price)
      ) {
        callback(new Error("Giá bán phải lớn hơn hoặc bằng giá nhập"));
      } else {
        callback();
      }
    };
    var validateOriginPrice = (rule, value, callback) => {
      if (
        value &&
        this.form.sale_price &&
        formatStringtoNumber(value) > formatStringtoNumber(this.form.sale_price)
      ) {
        callback(new Error("Giá nhập phải nhỏ hơn hoặc bằng giá bán"));
      } else {
        callback();
      }
    };
    return {
      uploadText: "",
      file: "",
      search: "",
      products: [],
      dialogAddProduct: false,
      dialogEditProduct: false,
      dialogExcel: false,
      form: {
        name: "",
        sku: "",
        image: "",
        description: "",
        category_ids: [],
        weight: "",
        sale_price: "",
        original_price: "",
        quantity_in_stock: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên sản phẩm không được bỏ trống!",
            trigger: "change",
          },
        ],
        sku: [
          {
            required: true,
            message: "Mã sản phẩm không được bỏ trống!",
            trigger: "change",
          },
        ],
        sale_price: [
          {
            required: true,
            message: "Giá bán không được bỏ trống!",
            trigger: "change",
          },
          {
            validator: validateSalePrice,
            trigger: "change",
          },
        ],
        original_price: [
          {
            required: true,
            message: "Giá nhập không được bỏ trống!",
            trigger: "change",
          },
          {
            validator: validateOriginPrice,
            trigger: "change",
          },
        ],
        quantity_in_stock: [
          {
            required: true,
            message: "Nhập số lượng sản phẩm",
            trigger: "change",
          },
        ],
      },
      newProductImageUrl: "",
      newProductUploadImage: "",
      baseUrl: process.env.VUE_APP_BASE_URL + "/storage/",
      productEditId: "",
      categories: [],

      loading: true,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        from: 0,
        to: 0,
      },
      categoryFilter: "",
      errorSku: "",
      errorQuantity: "",
      dialogImport: false,
      skuImport: '',
      nameImport: '',
      idImport: '',
      formImport: {
        quantity: ''
      },
    };
  },
  computed: {
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  methods: {
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("Danh sách sản phẩm");
    },
    changeIndexSidebar() {
      this.updateSideBar("3");
    },
    openDialogExcel() {
      this.dialogExcel = true;
      this.uploadText =
        "Thả tệp vào đây hoặc <em style='color: #409EFF; font-style: normal;'>bấm đê tải tệp lên</em>";
    },
    closeDailogExcel() {
      this.dialogExcel = false;
    },
    //download file excel mau
    downloadExelTemplate() {
      api.dowloadExcelTemplate().then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Danh sách sản phẩm mẫu.xlsx");
        document.body.appendChild(link);
        link.click();
      });
    },
    //upload file excel
    importExcel() {
      const frmData = new FormData();
      frmData.append("file", this.file);
      api.importProductExcel(frmData).then(() => {
        this.dialogExcel = false;
        this.$message({
          type: "success",
          message: "Nhập thành công",
          center: true,
        });
      });
      this.getData();
    },
    changeFile(e) {
      this.file = e.target.files[0];
      this.uploadText = "Đã chọn 1 file: " + this.file.name;
    },
    closeImport() {
      this.file = null;
    },
    hoverImage() {
      this.$refs.productHover.style.display = "flex";
    },
    hoverLeaveImage() {
      this.$refs.productHover.style.display = "none";
    },
    handleChangeImage(e) {
      if (e.target.files.length) {
        this.newProductUploadImage = e.target.files[0];
        this.newProductImageUrl = URL.createObjectURL(e.target.files[0]);
      }
    },
    deleteImage() {
      this.newProductUploadImage = "";
      this.newProductImageUrl = "";
    },
    storeProduct(formAddProduct) {
      if (this.hasPermission('create-product')) {
        this.$refs[formAddProduct].validate((valid) => {
          if (valid) {
            const frmData = new FormData();
            frmData.append("name", this.form.name);
            frmData.append("sku", this.form.sku);
            frmData.append("category_ids", this.form.category_ids);
            frmData.append(
                "original_price",
                formatStringtoNumber(this.form.original_price)
            );
            frmData.append(
                "sale_price",
                formatStringtoNumber(this.form.sale_price)
            );
            if (this.form.weight) {
              frmData.append("weight", formatStringtoNumber(this.form.weight));
            } else {
              frmData.append("weight", 0);
            }
            frmData.append(
                "quantity_in_stock",
                formatStringtoNumber(this.form.quantity_in_stock)
            );
            frmData.append("description", this.form.description);
            if (this.newProductUploadImage) {
              frmData.append("image", this.newProductUploadImage);
            }
            this.loading = true;
            api
                .addProduct(frmData)
                .then(() => {
                  this.newProductUploadImage = "";
                  this.newProductImageUrl = "";
                  this.$message({
                    message: "Thêm mới thành công!",
                    type: "success",
                  });
                  this.errorSku = ""
                  this.dialogAddProduct = false;
                  this.getData();
                }).catch((error) => {
              let errors = _.get(error.response, "data.error", {});
              if (Object.keys(errors).length === 0) {
                this.$message.error({
                  type: "error",
                  message: _.get(error.response, "data.message", ""),
                });
              }
              if (Object.keys(errors).length > 0) {
                this.errorSku = _.get(errors, "sku[0]", "");
              }
              this.loading = false;
            });
          }
        });
      }
    },
    closeAddProduct() {
      this.dialogAddProduct = false;
      this.errorSku = "";
    },
    editProduct(product) {
      if (this.hasPermission('update-product')) {
        this.dialogEditProduct = true;
        this.productEditId = product._id;
        this.form.name = product.name;
        this.form.sku = product.sku;
        if (product.category_ids) {
          this.form.category_ids = product.category_ids;
        }
        this.form.original_price = formatMoney(product.original_price.toString());
        this.form.sale_price = formatMoney(product.sale_price.toString());
        this.form.weight = formatMoney(product.weight.toString());
        this.form.quantity_in_stock = formatMoney(
            product.quantity_in_stock.toString()
        );
        if (product.description != null) {
          this.form.description = product.description;
        }
        if (product.image) {
          this.newProductImageUrl = this.baseUrl + product.image;
        }
      }
    },
    handleUpdateProduct(formEditProduct) {
      if (this.hasPermission('update-product')) {
        this.$refs[formEditProduct].validate((valid) => {
          if (valid) {
            this.loading = true;
            const frmData = new FormData();
            frmData.append("name", this.form.name);
            frmData.append("sku", this.form.sku);
            frmData.append("category_ids", this.form.category_ids);
            frmData.append(
                "original_price",
                formatStringtoNumber(this.form.original_price)
            );
            frmData.append(
                "sale_price",
                formatStringtoNumber(this.form.sale_price)
            );
            if (this.form.weight) {
              frmData.append("weight", formatStringtoNumber(this.form.weight));
            } else {
              frmData.append("weight", 0);
            }
            frmData.append(
                "quantity_in_stock",
                formatStringtoNumber(this.form.quantity_in_stock)
            );
            frmData.append("description", this.form.description);
            if (this.newProductUploadImage) {
              frmData.append("image", this.newProductUploadImage);
            }
            api.updateProduct(this.productEditId, frmData).then(() => {
              this.newProductUploadImage = "";
              this.newProductImageUrl = "";
              this.$message({
                message: "Cập nhật thành công.",
                type: "success",
                center: true,
              });
              this.errorSku = ""
              this.dialogEditProduct = false;
              let params = {
                page: this.page.currentPage,
                q: this.search,
                category_id: this.categoryFilter,
              };
              api.getDataProducts(params)
                  .then((response) => {
                    this.products = response.data.data.data;
                    this.loading = false;
                  })
                  .catch(() => {
                    this.loading = false;
                  });
            }).catch((error) => {
              let errors = _.get(error.response, "data.error", {});
              if (Object.keys(errors).length === 0) {
                this.$message.error({
                  type: "error",
                  message: _.get(error.response, "data.message", ""),
                });
              }
              if (Object.keys(errors).length > 0) {
                this.errorSku = _.get(errors, "sku[0]", "");
              }
              this.loading = false;
            });
          }
        });
      }
    },
    closeEditProduct() {
      this.errorSku = ""
      this.dialogEditProduct = false;
    },
    handleDeleteProduct(id) {
      if (this.hasPermission('delete-product')) {
        this.$confirm("Bạn có chắc chắn muốn xóa sản phẩm này?", "Cảnh báo", {
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          confirmButtonClass: "btn-delete-list",
          type: "warning",
        }).then(() => {
          this.loading = true;
          api
              .deleteProduct(id)
              .then(() => {
                this.$message({
                  message: "Xóa sản phẩm thành công!",
                  type: "success",
                  center: true,
                });
                let params = {
                  page: this.page.currentPage,
                  q: this.search,
                  category_id: this.categoryFilter,
                };
                api
                    .getDataProducts(params)
                    .then((response) => {
                      this.products = response.data.data.data;
                      this.page.total = response.data.data.total;
                      let from = _.get(response, "data.data.from", 0);
                      let to = _.get(response, "data.data.to", 0);
                      this.page.from = from ? from : 0;
                      this.page.to = to ? to : 0;
                      this.loading = false;
                    })
                    .catch(() => {
                      this.loading = false;
                    });
              })
              .catch(() => {
                this.$message({
                  message: "Xóa sản phẩm thất bại!",
                  type: "error",
                  center: true,
                });
                this.loading = false;
              });
        });
      }
    },
    handleChangePage(val) {
      let payload = {
        page: val,
        q: this.search,
        category_id: this.categoryFilter,
      };
      this.getData(payload);
    },
    handleSearch() {
      let params = {
        q: this.search,
        category_id: this.categoryFilter,
      };
      this.getData(params);
    },
    getData(params = {}) {
      this.loading = true;
      api
        .getDataProducts(params)
        .then((res) => {
          this.products = res.data.data.data;

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
    formatOriginalPrice() {
      this.form.original_price = formatMoney(this.form.original_price);
    },
    formatSalePrice() {
      this.form.sale_price = formatMoney(this.form.sale_price);
    },
    formatWeight() {
      this.form.weight = formatMoney(this.form.weight);
    },
    formatQuantity() {
      this.form.quantity_in_stock = formatMoney(this.form.quantity_in_stock);
    },
    formatDate(dateString) {
      return moment(dateString).format("HH:mm DD/MM/YYYY");
    },
    formatQuantityImport() {
      this.formImport.quantity = formatMoney(this.formImport.quantity);
    },
    ImportProduct(product) {
      if (this.hasPermission('import-product')) {
        this.dialogImport = true
        this.skuImport = product.sku
        this.nameImport = product.name
        this.idImport = product._id
      }
    },
    handleImportProduct() {
      if (this.hasPermission('import-product')) {
        if (this.isValidQuantity()) {
          let data = {
            quantity: formatStringtoNumber(this.formImport.quantity)
          }
          api.importProduct(this.idImport, data)
              .then(() => {
                this.handleSearch()
                this.dialogImport = false
                this.$message({
                  message: "Nhập hàng thành công!",
                  type: "success",
                  center: true,
                });
              }).catch((errors) => {
            this.errorQuantity = errors.response.data.error.quantity[0]
          })
        }
      }
    },
    isValidQuantity () {
      let error = false;
      this.errorQuantity = '';
      if (this.formImport.quantity.length === 0) {
        error = true;
        this.errorQuantity = 'Số lượng sản phẩm không được bỏ trống';
      }
      return !error
    },
    productDetail(id) {
      if (router.currentRoute.name !== "ProductDetail") {
        return router.push({ name: "ProductDetail", query: {id: id} });
      }
    }
  },
  watch: {
    dialogAddProduct(value) {
      if (!value) {
        this.newProductUploadImage = "";
        this.newProductImageUrl = "";
        this.$refs.formAddProduct.resetFields();
      } else {
        this.form.name = "";
        this.form.sku = "";
        this.form.category_ids = [];
        this.form.original_price = "";
        this.form.sale_price = "";
        this.form.weight = "";
        this.form.quantity_in_stock = "";
        this.form.description = "";
      }
    },
    dialogEditProduct(value) {
      if (!value) {
        this.newProductUploadImage = "";
        this.newProductImageUrl = "";
        if (this.$refs.formAddProduct) {
          this.$refs.formAddProduct.resetFields();
        }
      }
    },
    dialogImport(value) {
      this.errorQuantity = ''
      if (value) {
        if (this.$refs.formImportProduct) {
          this.$refs.formImportProduct.resetFields();
          this.errorQuantity = ""
        }
      }
    }
  },
  mounted() {
    if (this.hasPermission('get-product')) {
      this.changePageTitle();
      this.changeIndexSidebar();
      this.getData();
      api.getDataCategories().then((response) => {
        this.categories = response.data.data;
      });
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
@import "../assets/styles/products";
</style>
