const SellerDashboard = Vue.component('seller-dashboard', {
    data () {
        return {
            orders: []
        }
    },
    computed: {
        latestOrders () {
            return this.orders.sort((a,b) => {
                return new Date(b.created) - new Date(a.created)
            })
        }
    },
    mounted () {
        // Get all orders.
        let formData = new FormData()
        formData.set('uid', sessionStorage.uid)
        axios.post('./sql/get_orders.php', formData).then((res) => {
            const orders = res.data
            console.log(orders)
            this.orders = orders
        })
    },
    template: `<v-container>
    <v-row>
    <v-col cols="12" sm="6" md="6">
    <v-card tile elevation="0">
    <v-card-title>Latest Orders</v-card-title>
    <v-list two-line style="max-height: 75vh; overflow-y: auto;">
    <v-list-item v-for="(i, index) in latestOrders" :key="'order-'+index">
    <v-list-item-content>
    <v-list-item-title>{{i.itemName}}</v-list-item-title>
    <v-list-item-subtitle>Order No. {{i.id}}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
    <v-list-item-action-text>{{$convertToShortDateTime(i.created)}}</v-list-item-action-text>
    </v-list-item-action>
    </v-list-item>
    </v-list>
    </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="6">
    <v-card tile elevation="0">
    <v-card-title>Orders Analytics</v-card-title>
    <v-card-text>
    <orders-chart/>
    </v-card-text>
    </v-card>
    </v-col>
    </v-row>
    </v-container>`
})