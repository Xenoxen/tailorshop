const OrdersChart = Vue.component('orders-chart', {
    name: 'OrdersChart',
    data () {
      return {
        id: null,
        myChart: '',
        labels: ['Processing', 'Delivering', 'Delivered', 'Cancelled'],
        unsubscribe: null
      }
    },
    created () {
      let stats = []
      let formData = new FormData()
      let processing = 0, delivering = 0, delivered = 0, cancelled = 0
          formData.set('uid', sessionStorage.uid)
          axios.post('./sql/get_orders.php', formData).then((res) => {
              const orders = res.data
              orders.forEach((order) => {
                const status = order.status
                switch(status) {
                  case 'Processing':
                    processing++
                    break
                  case 'Delivering':
                    delivering++
                    break
                  case 'Delivered':
                    delivered++
                    break
                  case 'Cancelled':
                    cancelled++
                    break
                }
              })
              // Compile statistics.
        const ctx = document.getElementById('ordersChart')
        stats = [processing, delivering, delivered, cancelled]
        // Create Chart
        this.myChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.labels,
            datasets: [{
              label: 'User Accounts',
              data: stats,
              backgroundColor: [
                '#9E9E9E',
                '#039BE5',
                '#4CAF50',
                '#F44336'
              ]
            }]
          }
        })
          })
    },
    template: `<canvas id="ordersChart" width="100%" height="100"/>`
})
