<template>
  <div class="dashboard">
    <el-row :gutter="20" v-if="hasPermission('report')">
      <el-col :md="6" :sm="12">
        <div class="card">
          <div class="card-header">
            <div class="card-icon card-icon-success">
              <i class="fa fa-clock-o"></i>
            </div>
            <p class="card-category">Đơn chờ xử lý</p>
            <h3 class="card-title">
              <span v-if="dataOrder.orderWaiting">{{
                dataOrder.orderWaiting
              }}</span>
              <span v-if="!dataOrder.orderWaiting">0</span>
            </h3>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="card">
          <div class="card-header">
            <div class="card-icon card-icon-info">
              <i class="el-icon-check"></i>
            </div>
            <p class="card-category">Đơn đã giao</p>
            <h3 class="card-title">
              <span v-if="dataOrder.completedOrders">{{
                dataOrder.completedOrders
              }}</span>
              <span v-if="!dataOrder.completedOrders">0</span>
            </h3>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="card">
          <div class="card-header">
            <div class="card-icon card-icon-danger">
              <i class="el-icon-money"></i>
            </div>
            <p class="card-category">Doanh thu</p>
            <h3 style="" class="card-title">
              <span v-if="dataOrder.totalMoneys"
                >{{
                  Number(dataOrder.totalMoneys).toLocaleString("vi-VN")
                }}
                VNĐ</span
              >
              <span v-if="!dataOrder.totalMoneys">0</span>
            </h3>
          </div>
        </div>
      </el-col>
      <el-col :md="6" :sm="12">
        <div class="card card-center">
          <div class="card-header">
            <div class="card-icon card-icon-ship">
              <i class="fa fa-money"></i>
            </div>
            <p class="card-category">Lợi nhuận</p>
            <h3 class="card-title">
              <span v-if="dataOrder.totalProfit"
                >{{
                  Number(dataOrder.totalProfit).toLocaleString("vi-VN")
                }}
                VNĐ</span
              >
              <span v-if="!dataOrder.totalProfit">0</span>
            </h3>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row class="bar">
      <el-col class="bar-left" :md="12" v-if="hasPermission('revenue-daily-report')">
        <el-card>
          <BarExample :labels="reportDaily.labels" :data="reportDaily.data" />
        </el-card>
      </el-col>
      <el-col class="bar-right" :md="12" v-if="hasPermission('revenue-monthly-report')">
        <el-card>
          <LineExampleMonth
            :labels="reportMonth.labels"
            :data="reportMonth.data"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BarExample from "./Charts/LineExample";
import LineExampleMonth from "./Charts/BarExampleMonth";
import api from "../api";
import { mapMutations, mapState, mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "Dashboard",
  computed: {
    ...mapState(["pageTitle", "sidebarIndex"]),
    ...mapGetters('auth', [
      'hasPermission'
    ])
  },
  data() {
    return {
      dataOrder: [],
      reportDaily: {
        labels: [],
        data: [],
      },
      reportMonth: {
        labels: [],
        data: [],
      },
    };
  },
  methods: {
    ...mapMutations(["updateTitle", "updateSideBar"]),
    changePageTitle() {
      this.updateTitle("Tổng quát");
    },
    changeIndexSidebar() {
      this.updateSideBar("1");
    },
    getDataOrder() {
      if (this.hasPermission('report')) {
        api.getDataOrder().then((response) => {
          this.dataOrder = _.get(response, "data.data");
        });
      }
    },
    getTotalValue() {
      if (this.hasPermission('revenue-daily-report')) {
        api.getTotalValue().then((response) => {
          this.reportDaily = _.get(response, "data.data");
        });
      }
    },
    getTotalValueMonth() {
      if (this.hasPermission('revenue-monthly-report')) {
        api.getTotalValueMonth().then((response) => {
          this.reportMonth = _.get(response, "data.data");
        });
      }
    },
  },
  mounted() {
    this.getDataOrder();
    this.getTotalValue();
    this.getTotalValueMonth();
    this.changePageTitle();
    this.changeIndexSidebar();
  },
  props: {
    msg: String,
  },
  components: {
    BarExample,
    LineExampleMonth,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dashboard {
  .bar {
    margin-top: 1vh;
    .bar-left {
      padding-right: 5px;
    }
    .bar-right {
      padding-left: 5px;
    }
  }
  .card {
    border: 0;
    margin-bottom: 1vh;
    margin-top: 1vh;
    border-radius: 6px;
    color: #333;
    background: #fff;
    width: 100%;
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;

    .card-header {
      margin: 0 15px;
      padding: 0;
      position: relative;
      text-align: right;

      .card-icon {
        border-radius: 3px;
        background-color: #999;
        padding: 20px;
        margin-top: -15px;
        margin-right: 15px;
        float: left;
        color: #fff;
        font-size: 28px;

        &.card-icon-warning {
          background: linear-gradient(60deg, #ffa726, #fb8c00);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%),
            0 7px 10px -5px rgb(255 152 0 / 40%);
        }

        &.card-icon-success {
          background: linear-gradient(60deg, #ef5350, #e53935);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%),
            0 7px 10px -5px rgb(76 175 80 / 40%);
        }

        &.card-icon-ship {
          background: linear-gradient(60deg, #ffa726, #fb8c00);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%),
            0 7px 10px -5px rgb(76 175 80 / 40%);
        }

        &.card-icon-danger {
          background: linear-gradient(60deg, #26c6da, #00acc1);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%),
            0 7px 10px -5px rgb(244 67 54 / 40%);
        }

        &.card-icon-info {
          background: linear-gradient(60deg, #66bb6a, #43a047);
          box-shadow: 0 4px 20px 0 rgb(0 0 0 / 14%),
            0 7px 10px -5px rgb(0 188 212 / 40%);
        }
      }

      .card-category {
        color: #999;
        font-size: 14px;
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .card {
      margin-bottom: 20px;
    }
    .bar {
      margin: 0;
      .bar-left {
        padding: 0;
      }
      .bar-right {
        padding: 0;
        margin-top: 10px;
      }
    }
  }
  @media only screen and (max-width: 992px) {
    .card {
      margin-bottom: 20px;
    }
    .bar {
      margin: 0;
      .bar-left {
        padding: 0;
      }
      .bar-right {
        padding: 0;
        margin-top: 10px;
      }
    }
  }
}
</style>
