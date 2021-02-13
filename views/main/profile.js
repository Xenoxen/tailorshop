const CustomerProfile = Vue.component('customer-profile', {
    data () {
        return {
            profile: {},
            view: {},
            viewItem: {},
            orders: {
                search: null,
                headers: [
                    {text: 'Order No.', sortable: true, align: 'start', value: 'id'},
                    {text: 'Items', sortable: true, align: 'start', value: 'items.length'},
                    {text: 'Time Placed', sortable: true, align: 'start', value: 'created'},
                    {text: 'Actions', sortable: false, align: 'end', value: 'actions'}
                ],
                items: []
            },
            dialog: {
                view: false,
                cancel: false,
                viewItem: false
            },
            cancel: {
                id: null,
                uid: null,
                index: null,
                orderId: null,
                reason: null
            }
        }
    },
    computed: {
        subTotal () {
            let subtotal = 0
            if (this.view.items) {
                this.view.items.forEach((item) => {
                    if (item.status !== 'Cancelled')
                    subtotal += parseFloat(item.price)
                })
            }
            return subtotal
        },
        total () {
            let total = 0
            if (this.view) {
                total = parseFloat(this.view.deliveryFee) + this.subTotal
            }
            return total
        }
    },
    mounted () {
        let formData = new FormData()
        formData.set('uid', sessionStorage.uid)
        axios.post('./sql/get_profile.php', formData).then((res) => {
            console.log(res.data)
            this.profile = res.data.info
            this.orders.items = res.data.orders
        })
    },
    methods: {
        viewOrder (item) {
            this.view = item
            this.dialog.view = true
        },
        viewOrderItem (item) {
            this.viewItem = item
            this.dialog.viewItem = true
        },
        cancelOrder () {
            let formData = new FormData()
            formData.set('id', this.cancel.id)
            formData.set('uid', sessionStorage.uid)
            formData.set('orderId', this.cancel.orderId)
            formData.set('reason', this.cancel.reason)
            axios.post('./sql/cancel_order.php', formData).then((res) => {
                console.log(res.data)
                this.$emit('snackbar', 'Order has been cancelled.')
                this.view.items[this.cancel.index].status = 'Cancelled'
                this.dialog.cancel = false
            })
        },
        cancelDialog (item, index) {
            console.log(item)
            this.cancel.id = item.id
            this.cancel.index = index
            this.cancel.orderId = item.orderId
            this.dialog.cancel = true
        }
    },
    template: `<v-container>
    <v-row>
    <v-col cols="12">
    <v-card tile elevation="0">
    <v-card-title>Personal Info</v-card-title>
    <v-container>
    <v-row>
    <v-col cols="12" md="6">
    <div class="title">{{profile.fname}} {{profile.lname}}</div>
    <div class="subtitle">{{profile.email}}</div>
    <div class="subtitle">{{profile.contact}}</div>
    </v-col>
    <v-col cols="12" md="6">
    <div class="title">Shipping Address</div>
    <div class="text-body-2">{{profile.address}}, {{profile.city}}, {{profile.province}}, Philippines</div>
    </v-col>
    </v-row>
    </v-container>
    </v-card>
    </v-col>
    <v-col cols="12">
    <v-card elevation="0">
    <v-card-title>My Orders History<v-spacer/>
    <v-text-field v-model="orders.search" hide-details rounded filled dense placeholder="Search"/>
    </v-card-title>
    <v-data-table :search="orders.search" :headers="orders.headers" :items="orders.items">
    <template v-slot:item.receiver="{item}" class="text-capitalize">{{item.receiver}}</template>
    <template v-slot:item.created="{item}">{{$convertToLongDate(item.created)}}</template>
    <template v-slot:item.updated="{item}">{{item.updated ? $convertToShortDateTime(item.updated) : 'N/A'}}</template>
    <template v-slot:item.status="{item}"><v-chip dark small :color="$statusColors(item.status)">{{item.status}}</v-chip></template>
    <template v-slot:item.actions="{item}">
    <v-btn small icon @click="viewOrder(item)"><v-icon small>mdi-eye</v-icon></v-btn>
    </template>
    </v-data-table>
    </v-card>
    </v-col>
    </v-row>
    <v-dialog max-width="800" v-model="dialog.view">
    <v-card>
    <v-card-title>Order Details - Order No. {{view.id}}</v-card-title>
    <v-container>
    <v-row>
    <v-col cols="12" md="6">
    <v-list two-line>
    <v-list-item>
    <v-list-item-avatar><v-icon>mdi-account</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{view.name}}</v-list-item-title>
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
    <div class="text-body-2">{{view.address}}, {{view.city}}, {{view.province}}, Philippines</div>
    <v-list-item-subtitle>Shipping Address</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-list>
    </v-col>
    <v-col cols="12" md="6">
    <div class="title">My Cart ({{view.items ? view.items.length : 0}})</div>
    <v-list one-line style="max-height: 280px; overflow-y: auto;">
    <v-list-item two-line v-for="(i, index) in view.items" :key="'order-item-'+index">
    <v-list-item-avatar tile><v-img :src="i.photo"/></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{i.name}}{{i.size === 'Custom Fit' ? '(Custom)' : null}}</v-list-item-title>
    <v-list-item-subtitle><v-chip @click="viewOrderItem(i)" small dark :color="$statusColors(i.status)">{{i.status}}</v-chip></v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content>
    <v-list-item-title>x{{i.qty}}</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
    <v-list-item-action-text>₱ {{i.price}}</v-list-item-action-text>
    <v-btn v-show="i.status === 'Processing'" @click="cancelDialog(i, index)" color="red" dark icon><v-icon>mdi-close</v-icon></v-btn>
    </v-list-item-action>
    </v-list-item>
    </v-list>
    <v-divider/>
    <v-list>
    <v-list-item>
    <v-list-item-content>
    <v-list-item-title class="text-subtitle-2">Sub Total:</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action-text class="text-subtitle-2">₱ {{subTotal}}</v-list-item-action-text>
    </v-list-item>
    <v-list-item>
    <v-list-item-content>
    <v-list-item-title class="text-subtitle-2">Delivery Fee:</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action-text class="text-subtitle-2">₱ {{view.deliveryFee}}</v-list-item-action-text>
    </v-list-item>
    <v-list-item>
    <v-list-item-content>
    <v-list-item-title class="font-weight-bold text-uppercase">Total:</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action-text class="title">₱ {{total}}</v-list-item-action-text>
    </v-list-item>
    </v-list>
    </v-col>
    </v-row>
    </v-container>
    <v-card-actions>
    <v-spacer/>
    </v-card-actions>
    </v-card>
    </v-dialog>
    <v-dialog max-width="480" v-model="dialog.cancel">
    <v-card>
    <v-card-title>Confirm Order Cancellation</v-card-title>
    <v-card-text>
    <v-form ref="cancelOrder">
    <v-textarea :rules="$rules.required" outlined v-model="cancel.reason" label="Reason"/>
    </v-form>
    </v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn rounded depressed color="red" dark @click="cancelOrder">Confirm</v-btn>
    <v-btn text @click="dialog.cancel = false">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    <v-dialog max-width="800" v-model="dialog.viewItem">
    <v-card>
    <v-card-title>Order Information - Order No. {{viewItem ? viewItem.id : 0}}</v-card-title>
    <v-card-text>
    <v-row>
    <v-col cols="12">
    <v-list-item two-line>
    <v-list-item-avatar tile size="120"><v-img :src="viewItem.photo"/></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title class="text-h5">{{viewItem.name}}</v-list-item-title>
    <v-list-item-subtitle class="text-h5 font-weight-light">₱ {{viewItem.price}}</v-list-item-subtitle>
    <v-list-item-subtitle class="text-h6 font-weight-light" v-show="viewItem.variant !== 'null'">Variant: {{viewItem.variant}}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
    <v-list-item-action-text class="title">x{{viewItem.qty}}</v-list-item-action-text>
    </v-list-item-action>
    </v-list-item>
    <v-row>
    <v-col cols="12">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.size}}</v-list-item-title>
    <v-list-item-subtitle>Size</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="viewItem.head > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.head}}</v-list-item-title>
    <v-list-item-subtitle>Head (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="viewItem.chest > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.chest}}</v-list-item-title>
    <v-list-item-subtitle>Chest (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="viewItem.bust > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.bust}}</v-list-item-title>
    <v-list-item-subtitle>Bust (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="viewItem.waist > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.waist}}</v-list-item-title>
    <v-list-item-subtitle>Waist (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="viewItem.back > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.back}}</v-list-item-title>
    <v-list-item-subtitle>Back (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    <v-col cols="12" md="3" v-if="viewItem.sleeve > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.sleeve}}</v-list-item-title>
    <v-list-item-subtitle>Sleeve (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    <v-col cols="12" md="3" v-if="viewItem.hip > 0">
    <v-list-item two-line>
    <v-list-item-content>
    <v-list-item-title>{{viewItem.hip}}</v-list-item-title>
    <v-list-item-subtitle>Hip (in.)</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    </v-col>
    </v-row>
    <div v-show="viewItem.cancelId">
    <v-divider class="my-2"/>
    <div class="caption">Cancellation Reason</div>
    <div class="text-body-2 black--text">{{viewItem.reason}}</div>
    </div>
    </v-col>
    </v-row>
    </v-card-text>
    </v-card>
    </v-dialog>
    </v-container>`
})