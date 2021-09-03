import { Bar } from './BaseCharts'

export default {
  extends: Bar,
  props: ['labels', 'data'],
  mounted() {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: 'Doanh thu theo tháng',
          backgroundColor: '#27AE60',
          data: this.data
        }
      ]
    }, {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            userCallback: function (value) {
              value = value.toString();
              value = value.split(/(?=(?:...)*$)/);
              value = value.join(',');
              return value + ' đ';
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: (value) => {
            let money = value.yLabel;
            money = money.toString();
            money = money.split(/(?=(?:...)*$)/);
            money = money.join(',');
            return 'Doanh thu: ' + money + ' đ';
          }
        }
      }
    })
  },
  watch: {
    data() {
      this.renderChart({
        labels: this.labels,
        datasets: [
          {
            label: 'Doanh thu theo tháng',
            backgroundColor: '#27AE60',
            data: this.data
          }
        ]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: function (value) {
                value = value.toString();
                value = value.split(/(?=(?:...)*$)/);
                value = value.join(',');
                return value + ' đ';
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (value) => {
              let money = value.yLabel;
              money = money.toString();
              money = money.split(/(?=(?:...)*$)/);
              money = money.join(',');
              return 'Doanh thu: ' + money + ' đ';
            }
          }
        }
      })
    }
  }
}