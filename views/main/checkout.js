const Checkout = Vue.component('checkout-view', {
    data () {
      return {
        info: {},
        loading: {
          info: true
        },
        dialog: {
          success: false
        },
        agreement: false,
        validate: false,
        orderNo: null
      }
    },
    methods: {
      checkoutOrder () {
        if(this.$refs.checkout.validate()) {
          let formData = new FormData()
          formData.set('uid', sessionStorage.uid)
          formData.set('name', this.info.fname + ' ' + this.info.lname)
          formData.set('email', this.info.email)
          formData.set('contact', this.info.contact)
          formData.set('address', this.info.address)
          formData.set('city', this.info.city)
          formData.set('province', this.info.province)
          formData.set('subTotal', this.subTotal)
          formData.set('deliveryFee', this.deliveryFee)
          formData.set('total', this.total)
          formData.set('cart', JSON.stringify(this.info.cart))
          axios.post('./sql/add_order.php', formData).then((res) => {
            console.log(res.data)
            this.orderNo = res.data
            this.dialog.success = true
          }).catch((error) => { console.error(error); this.$emit('snackbar', error) })
        }
      },
      addQty(index) {
        this.info.cart[index].qty++
      },
      subQty(index) {
          if(this.info.cart[index].qty>1)
        this.info.cart[index].qty--
      }
    },
    computed: {
      subTotal () {
        let subtotal = 0
        if (this.info.cart) {
          this.info.cart.forEach((item) => {
            subtotal += (item.price*item.qty)
          })
        }
        return subtotal
      },
      deliveryFee () {
        let fee = 50
        return fee
      },
      total () {
        let totalAmount = 0
        totalAmount = this.subTotal + this.deliveryFee
        return totalAmount
      }
    },
    mounted () {
      let formData = new FormData()
      formData.set('uid', sessionStorage.uid)
      axios.post('./sql/get_checkout.php', formData).then((res) => {
        const info = res.data
        info.cart = info.cart.map((item) => {
          item.price = parseFloat(item.price)
          item.qty = parseInt(item.qty)
          return item
        })
        console.log(info)
        this.info = info
        this.loading.info = false
      }).catch((error) => {console.error(error); this.$emit('snackbar', error); this.loading.info = false})
    },
    template: `<v-container>
    <v-card elevation="0" height="480">
    <v-container>
    <v-row>
    <v-col cols="12" sm="6" md="6">
    <div class="text-h5 font-weight-light mb-3">Order Information</div>
    <div class="title">{{info.fname}} {{info.lname}}</div>
    <div class="subtitle">{{info.email}}</div>
    <div class="subtitle">{{info.contact}}</div>
    <div class="subtitle">{{info.address}}, {{info.city}}, {{info.province}}, Philippines</div>
    <v-divider class="my-4"/>
    <v-list-item one-line>
    <v-list-item-content>
    <v-list-item-title class="subtitle">Sub Total:</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action-text class="subtitle">₱ {{subTotal}}</v-list-item-action-text>
    </v-list-item>
    <v-list-item one-line>
    <v-list-item-content>
    <v-list-item-title class="subtitle">Delivery Fee:</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action-text class="subtitle">₱ {{deliveryFee}}</v-list-item-action-text>
    </v-list-item>
    <v-list-item one-line>
    <v-list-item-content>
    <v-list-item-title class="title">Total:</v-list-item-title>
    </v-list-item-content>
    <v-list-item-action-text class="title">₱ {{total}}</v-list-item-action-text>
    </v-list-item>
    <v-form ref="checkout" v-model="validate">
    <v-checkbox :rules="$rules.required" v-model="agreement" label="I agree to the terms of use."/>
    </v-form>
    <v-btn class="font-weight-light" x-large block tile depressed color="primary" @click="checkoutOrder">Place Order</v-btn>
    </v-col>
    <v-col cols="12" sm="6" md="6">
    <div class="text-h5 font-weight-light mb-3">Cart Summary ({{info.cart ? info.cart.length : 0}})</div>
    <v-list two-line style="overflow-y: auto; max-height: 280px;">
    <v-list-item v-for="(i, index) in info.cart" :key="'cart-item-'+index">
              <v-list-item-avatar tile size="60"><v-img :src="i.photo"/></v-list-item-avatar>
              <v-list-item-content>
        <v-list-item-title>{{i.name}}{{ i.size === 'Custom Fit' ? '(Custom)' : null }}</v-list-item-title>
        <v-list-item-subtitle>₱ {{i.price}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <v-layout>
            <v-btn small icon @click="subQty(index)"><v-icon small>mdi-minus</v-icon></v-btn>
            <div class="text-body-1 align-self-center mx-1">x{{i.qty}}</div>
            <v-btn small icon @click="addQty(index)"><v-icon small>mdi-plus</v-icon></v-btn>
        </v-layout>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon small><v-icon small>mdi-delete</v-icon></v-btn>
        </v-list-item-action>
            </v-list-item>
    </v-list>
    </v-col>
    </v-row>
    </v-container>
    </v-card>
    <v-dialog max-width="480" v-model="dialog.success">
    <v-card>
    <v-card-title>Your Order has been placed!</v-card-title>
    <v-card-text>
    Your order number is {{orderNo}}.  You can view your order history in your profile.
    </v-card-text>
    <v-card-actions>
    <v-btn color="primary" tile depressed x-large block to="/">Okay</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    </v-container>`
})