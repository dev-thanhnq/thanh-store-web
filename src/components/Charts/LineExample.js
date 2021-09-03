import { Line } from './BaseCharts'

export default {
  extends: Line,
  props: ['labels', 'data'],
  mounted() {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          label: 'Doanh thu theo ngày',
          backgroundColor: '#36a2eb',
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
            label: 'Doanh thu theo ngày',
            backgroundColor: '#36a2eb',
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