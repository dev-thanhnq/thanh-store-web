<template>
  <div class="categories">
    <el-card>
      <el-row class="head-category">
        <el-col class="search" :sm="16">
          <el-input
            class="search-input"
            placeholder="Nhập tên nhóm sản phẩm"
            v-model="search"
            clearable
            @clear="getData"
            @keydown.enter.native="handleSearch"
          >
          </el-input>
          <el-button class="btn-search" @click="handleSearch"
            >Tìm kiếm</el-button
          >
          <el-button
            @click="handleSearch"
            class="search-glass"
            ><i class="fa fa-search"></i
          ></el-button>
        </el-col>
        <el-col class="add-new" :sm="8">
          <el-button
              v-if="hasPermission('create-category')"
            class="show-card"
            type="primary"
            @click="dialogAddCategory = true"
            ><i class="fa fa-plus"></i> Thêm mới</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-card class="table-category">
      <el-table
        v-loading="loading"
        :data="categories"
        stripe
        style="width: 100%"
        height="calc(100vh - 345px)"
      >
        <el-table-column width="300px" prop="name" label="Tên nhóm sản phẩm">
        </el-table-column>
        <el-table-column prop="description" label="Mô tả"> </el-table-column>
        <el-table-column v-if="hasPermission('delete-category') || hasPermission('update-category')" width="100px" align="center" label="Hành động">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="100" trigger="click">
              <div v-if="hasPermission('update-category')" class="product-action" @click="editCategory(scope.row)">
                <i class="fa fa-pencil"></i> Chỉnh sửa
              </div>
              <div
                  v-if="hasPermission('delete-category')"
                class="product-action"
                @click="handleDeleteCategory(scope.row._id)"
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
        <el-col class="col" :sm="14">
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
    </el-card>

    <!-- add category -->
    <el-dialog
      class="dialog-add-category"
      id="add-category"
      title="Thêm nhóm sản phẩm"
      top="10vh"
      width="40%"
      :visible.sync="dialogAddCategory"
    >
      <el-row>
        <el-col :span="24">
          <el-form
            class="form-product"
            :model="form"
            :rules="rules"
            ref="formAddCategory"
            label-position="top"
            hide-required-asterisk
            label-width="130px"
            size="small"
          >
            <el-row>
              <el-col :span="24" class="margin-input">
                <el-form-item prop="name">
                  <label class="label-product"
                    >Tên nhóm sản phẩm <span class="required"> *</span></label
                  >
                  <el-input
                    size="medium"
                    v-model="form.name"
                    autocomplete="off"
                  ></el-input>
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
        <el-button @click="dialogAddCategory = false">Hủy</el-button>
        <el-button type="primary" @click="storeCategory('formAddCategory')"
          >Lưu</el-button
        >
      </span>
    </el-dialog>
    <!-- edit category -->
    <el-dialog
      class="dialog-add-category"
      id="edit-category"
      title="Sửa nhóm sản phẩm"
      top="10vh"
      width="40%"
      :visible.sync="dialogEditCategory"
    >
      <el-row>
        <el-col :span="24">
          <el-form
            class="form-product"
            :model="form"
            :rules="rules"
            ref="formEditCategory"
            label-position="top"
            hide-required-asterisk
            label-width="130px"
            size="small"
          >
            <el-row>
              <el-col :span="24" class="margin-input">
                <el-form-item prop="name">
                  <label class="label-product"
                    >Tên nhóm sản phẩm <span class="required"> *</span></label
                  >
                  <el-input
                    size="medium"
                    v-model="form.name"
                    autocomplete="off"
                  ></el-input>
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
        <el-button @click="dialogEditCategory = false">Hủy</el-button>
        <el-button
          type="primary"
          @click="handleUpdateCategory('formEditCategory')"
          >Lưu</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import api from "../api";
import _ from "lodash";
import router from "@/router";
export default {
  name: "Products",
  data() {
    return {
      categories: [],
      search: "",
      dialogAddCategory: false,
      dialogEditCategory: false,
      form: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Tên nhóm sản phẩm không được bỏ trống!",
            trigger: "change",
          },
        ],
      },
      categoryEditId: "",
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
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("Quản lý nhóm sản phẩm");
    },
    changeIndexSidebar() {
      this.updateSideBar("2");
    },
    storeCategory(formAddCategory) {
      if (this.hasPermission('create-category')) {
        this.$refs[formAddCategory].validate((valid) => {
          if (valid) {
            let data = {
              name: this.form.name,
              description: this.form.description,
            };
            api.addNewCategory(data).then(() => {
              this.getData();
              this.dialogAddCategory = false;
              this.$message({
                message: "Thêm mới thành công!",
                type: "success",
              });
            });
          }
        });
      }
    },
    editCategory(category) {
      if (this.hasPermission('update-category')) {
        this.dialogEditCategory = true;
        if (category) {
          this.categoryEditId = category._id;
          this.form.name = category.name;
          this.form.description = category.description;
        }
      }
    },
    handleUpdateCategory(formEditCategory) {
      if (this.hasPermission('update-category')) {
        this.$refs[formEditCategory].validate((valid) => {
          if (valid) {
            let data = {
              name: this.form.name,
              description: this.form.description,
            };
            api
                .upadateCategory(this.categoryEditId, data)
                .then(() => {
                  this.dialogEditCategory = false;
                  let params = {
                    page: this.currentPage,
                    q: this.search,
                  };
                  api.getDataCategoriesPaginate(params).then((response) => {
                    this.categories = response.data.data.data;
                  });
                  this.$message({
                    message: "Cập nhật thành công!",
                    type: "success",
                  });
                })
                .catch(() => {
                  this.$message({
                    message: "Cập nhật thất bại!",
                    type: "error",
                  });
                });
          }
        });
      }
    },
    handleDeleteCategory(id) {
      if (this.hasPermission('delete-category')) {
        this.$confirm("Bạn có chắc chắn muốn xóa không?", "Cảnh báo", {
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          confirmButtonClass: "btn-delete-list",
          type: "warning",
        })
          .then(() => {
            api
                .deleteCategory(id)
                .then(() => {
                  let params = {
                    page: this.currentPage,
                    q: this.search,
                  };
                  api.getDataCategoriesPaginate(params).then((response) => {
                    this.categories = response.data.data.data;
                  });
                  this.$message({
                    message: "Xóa sản phẩm thành công!",
                    type: "success",
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "error",
                    message: "Xóa thất bại!",
                  });
                });
          })
          .catch(() => {});
      }
    },
    handleChangePage(page) {
      this.currentPage = page;
      let params = {
        page: page,
        q: this.search,
      };
      api.getDataCategoriesPaginate(params).then((response) => {
        this.categories = response.data.data.data;
        let from = _.get(response, "data.data.from", 0);
        let to = _.get(response, "data.data.to", 0);
        this.page.from = from ? from : 0;
        this.page.to = to ? to : 0;
        this.loading = false;
      });
    },
    handleSearch() {
      let params = {
        q: this.search,
      };
      this.getData(params);
    },
    getData(params = {}) {
      api
        .getDataCategoriesPaginate(params)
        .then((res) => {
          this.categories = res.data.data.data;

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
    handleCurrentChange(val) {
      let payload = {
        page: val,
        q: this.search,
      };
      this.getData(payload);
    },
  },
  watch: {
    dialogAddCategory(value) {
      if (!value) {
        this.$refs.formAddCategory.resetFields();
      } else {
        this.form.name = "";
        this.form.description = "";
      }
    },
    dialogEditCategory(value) {
      if (!value) {
        if (this.$refs.formAddCategory) {
          this.$refs.formAddCategory.resetFields();
        }
      }
    },
    search(value) {
      if (!value) {
        this.getData();
      }
    },
  },
  mounted() {
    if (this.hasPermission('get-category')) {
      this.changePageTitle();
      this.getData();
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

<style lang="scss" scoped>
@import "../assets/styles/variables";
@import "../assets/styles/categories.scss";
</style>
