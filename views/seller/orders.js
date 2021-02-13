const SellerOrders = Vue.component('seller-orders', {
    data () {
        return {
            view: {},
            orders: {
                search: null,
                headers: [
                    {text: 'Order No.', sortable: true, align: 'start', value: 'id'},
                    {text: 'Name', sortable: true, align: 'start', value: 'receiver'},
                    {text: 'Email', sortable: true, align: 'start', value: 'email'},
                    {text: 'Contact No.', sortable: true, align: 'start', value: 'contact'},
                    {text: 'Time Placed', sortable: true, align: 'start', value: 'created'},
                    {text: 'Time Updated', sortable: true, align: 'start', value: 'updated'},
                    {text: 'Status', sortable: true, align: 'center', value: 'status'},
                    {text: 'Actions', sortable: false, align: 'end', value: 'actions'}
                ],
                items: []
            },
            dialog: {
                order: false
            }
        }
    },
    mounted () {
        let formData = new FormData()
        formData.set('uid', sessionStorage.uid)
        axios.post('./sql/get_orders.php', formData).then((res) => {
            const orders = res.data
            console.log(orders)
            this.orders.items = orders
        })
    },
    methods: {
        viewOrder (item) {
            this.view = item
            this.dialog.order = true
        },
        updateOrderStatus (status) {
            let formData = new FormData()
            formData.set('id', this.view.orderItemId)
            formData.set('status', status)
            axios.post('./sql/update_order_status.php', formData).then((res) => {
                console.log(res.data)
                this.view.status = status
            })
        }
    },
    template: `<v-container>
    <v-row>
    <v-col cols="12">
    <v-card tile elevation="0">
    <v-card-title>Orders List
    <v-spacer/>
    <v-text-field v-model="orders.search" hide-details rounded filled dense placeholder="Search"/>
    </v-card-title>
    <v-card-subtitle>Displays the items ordered by customers from your product lineup.</v-card-subtitle>
    <v-card-text>
    <v-data-table :search="orders.search" :headers="orders.headers" :items="orders.items">
    <template v-slot:item.receiver="{item}" class="text-capitalize">{{item.receiver}}</template>
    <template v-slot:item.created="{item}">{{$convertToLongDate(item.created)}}</template>
    <template v-slot:item.updated="{item}">{{item.updated ? $convertToShortDateTime(item.updated) : 'N/A'}}</template>
    <template v-slot:item.status="{item}"><v-chip dark small :color="$statusColors(item.status)">{{item.status}}</v-chip></template>
    <template v-slot:item.actions="{item}">
    <v-btn small icon @click="viewOrder(item)"><v-icon small>mdi-eye</v-icon></v-btn>
    </template>
    </v-data-table>
    </v-card-text>
    </v-card>
    </v-col>
    </v-row>
    <v-dialog max-width="800" v-model="dialog.order">
    <v-card>
    <v-card-title>Order Information - Order No. {{view ? view.id : 0}}
    <v-spacer/>
    <v-menu transition="slide-y-transition" offset-y>
    <template v-slot:activator="{on, attrs}">
    <v-chip v-on="on" :attrs="attrs" dark :disabled="view.status === 'Cancelled' || view.status === 'Delivered'" :color="$statusColors(view.status)">{{view ? view.status : null}}<v-icon class="ml-1">mdi-chevron-down</v-icon></v-chip>
    </template>
    <v-list one-line dense>
    <v-list-item link @click="updateOrderStatus('Processing')">
    <v-list-item-title>Processing</v-list-item-title>
    </v-list-item>
    <v-list-item link @click="updateOrderStatus('Delivering')">
    <v-list-item-title>Delivering</v-list-item-title>
    </v-list-item>
    <v-list-item link @click="updateOrderStatus('Delivered')">
    <v-list-item-title>Delivered</v-list-item-title>
    </v-list-item>
    </v-list>
    </v-menu>
    </v-card-title>
    <v-card-text>
    <v-row>
    <v-col cols="12">
    <v-list-item two-line>
    <v-list-item-avatar tile size="120"><v-img :src="view.photo"/></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title class="text-h5">{{view.itemName}}</v-list-item-title>
    <v-list-item-subtitle class="text-h6 font-weight-light">₱ {{view.price}}</v-list-item-subtitle>
    <v-list-item-subtitle class="text-h6 font-weight-light" v-show="view.variant !== 'null'">Variant: {{view.variant}}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
    <v-list-item-action-text class="title">x{{view.qty}}</v-list-item-action-text>
    </v-list-item-action>
    </v-list-item>
    <v-row>
    <v-col cols="12">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.size}}</v-list-item-title>
    <v-list-item-subtitle>Size</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="view.head > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.head}}</v-list-item-title>
    <v-list-item-subtitle>Head (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="view.chest > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.chest}}</v-list-item-title>
    <v-list-item-subtitle>Chest (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="view.bust > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.bust}}</v-list-item-title>
    <v-list-item-subtitle>Bust (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="view.waist > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.waist}}</v-list-item-title>
    <v-list-item-subtitle>Waist (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="view.back > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.back}}</v-list-item-title>
    <v-list-item-subtitle>Back (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="view.sleeve > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.sleeve}}</v-list-item-title>
    <v-list-item-subtitle>Sleeve (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    <v-col cols="12" md="3" v-if="view.hip > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{view.hip}}</v-list-item-title>
    <v-list-item-subtitle>Hip (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    </v-col>
    </v-row>
    <v-divider class="my-4"/>
    <v-list two-line>
    <v-list-item>
    <v-list-item-avatar><v-icon>mdi-account</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{view.receiver}}</v-list-item-title>
    <v-list-item-subtitle>Name of Receiver</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    <v-list-item>
    <v-list-item-avatar><v-icon>mdi-email</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{view.email}}</v-list-item-title>
    <v-list-item-subtitle>Email Address</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    <v-list-item>
    <v-list-item-avatar><v-icon>mdi-phone</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{view.contact}}</v-list-item-title>
    <v-list-item-subtitle>Contact No.</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    <v-list-item>
    <v-list-item-avatar><v-icon>mdi-truck</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{view.address}}, {{view.city}}, {{view.province}}, Philippines</v-list-item-title>
    <v-list-item-subtitle>Shipping Address</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-list>
    <div v-show="view.cancelId">
    <v-divider class="my-2"/>
    <div class="caption">Cancellation Reason</div>
    <div class="text-body-2 black--text">{{view.reason}}</div>
    </div>
    </v-col>
    </v-row>
    </v-card-text>
    </v-card>
    </v-dialog>
    </v-container>`
})