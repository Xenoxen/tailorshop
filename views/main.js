const mainView = Vue.component('main-view', {
    name: 'MainView',
    data () {
      return {
        loggedIn: false,
        cart: [],
        snackbar: {
          message: null,
          show: false
        },
        dialog: {
          logout: false
        },
        cartMenu: false,
        links: [
          {text: 'Home', icon: 'mdi-home', link: '/'},
          {text: 'Shop', icon: 'mdi-store', link: '/shop'}
        ]
      }
    },
    mounted () {
      if (sessionStorage.uid) { this.loggedIn = true }
      this.getCart()
    },
    computed: {
      accountRoute () {
        let route = null
        if (sessionStorage.type === 'seller') { route = '/seller' } else { route = '/my-profile' }
        return route
      }
    },
    methods: {
      getCart () {
        if (sessionStorage.uid) {
          let formData = new FormData()
          formData.set('id', sessionStorage.uid)
          axios.post('./sql/get_cart.php', formData).then((res) => {
          const cart = res.data
          this.cart = cart
        })
        }
      },
      showSnackbar (event) {
        this.snackbar.message = event
        this.snackbar.show = true
      },
      removeFromCart (id, index) {
        let formData = new FormData()
        formData.set('id', id)
        axios.post('./sql/del_cart.php', formData).then(() => {
          const message = 'Item removed successfully.'
          this.showSnackbar(message)
          this.cart.splice(index, 1)
        })
      },
      goToCheckout () {
        this.cartMenu = false
        router.push('/checkout')
      },
      logOut () {
        sessionStorage.clear()
        location.reload()
      }
    },
    template: 
    `<div>
    <v-snackbar app v-model="snackbar.show" top>
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn dark icon v-bind="attrs" @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <v-system-bar app>
    <v-spacer/>
    <v-btn v-show="!loggedIn" text small class="font-weight-light px-5" to="/sign-in">Sign In</v-btn>
    <v-btn v-show="!loggedIn" text small class="font-weight-light px-5" to="/sign-up">Sign Up</v-btn>
    <v-btn v-show="loggedIn" text small class="font-weight-light px-5" :to="accountRoute">My Account</v-btn>
    <v-btn v-show="loggedIn" text small class="font-weight-light px-5" @click="dialog.logout = true">Logout</v-btn>
    </v-system-bar>
    <v-app-bar app elevate-on-scroll fade-on-scroll fixed color="grey lighten-4">
    <v-img height="48" width="100" src="assets/img/logo.png"/>
    <v-spacer/>
    <v-text-field dense hide-details filled rounded placeholder="Search"/>
    <v-spacer/>
    <v-btn v-for="(i, index) in links" :key="'link-'+index" active-class="secondary" icon exact :to="i.link"><v-icon>{{i.icon}}</v-icon></v-btn>
    <v-menu v-model="cartMenu" offset-y transition="slide-y-transition" :close-on-content-click="false">
    <template v-slot:activator="{on, attrs}">
    <v-btn icon v-on="on" :attrs="attrs" v-show="loggedIn">
    <v-badge :content="cart.length" :value="cart.length" dark overlap color="accent">
    <v-icon>mdi-cart-outline</v-icon>
    </v-badge>
    </v-btn>
    </template>
    <v-card width="360">
    <v-card-title class="font-weight-light">My Cart</v-card-title>
    <v-sheet width="100%" height="280" class="text-center" v-if="cart.length === 0">
        <v-row align="center" justify="center" class="fill-height">
          <v-col cols="12">
            <v-icon size="80">mdi-cart-off</v-icon>
                      <div class="title">Your Cart is Empty</div>
                      <div class="subtitle">Start adding items to your cart.</div>
          </v-col>
        </v-row>
      </v-sheet>
    <v-list two-line style="overflow-y: auto; max-height: 280px;" v-else>
    <v-list-item v-for="(i, index) in cart" :key="'cart-item-'+index">
              <v-list-item-avatar tile>
              <v-img :src="i.photo"/>
                </v-list-item-avatar>
              <v-list-item-content>
        <v-list-item-title>{{i.name}}</v-list-item-title>
        <v-list-item-subtitle>₱ {{i.price*i.qty}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>x{{i.qty}}</v-list-item-action-text>
        <v-btn icon small @click="removeFromCart(i.ci_id, index)"><v-icon small>mdi-delete</v-icon></v-btn>
        </v-list-item-action>
            </v-list-item>
    </v-list>
    <v-card-actions>
    <v-btn tile block depressed large color="primary" @click="goToCheckout">Checkout</v-btn>
    </v-card-actions>
    </v-card>
    </v-menu>
    </v-app-bar>
    <router-view
    @snackbar="showSnackbar($event)"
    @update-cart="getCart"
    />
    <v-footer block dark padless color="green darken-4">
    <v-container>
    <v-row>
    <v-col cols="12" sm="6" md="7" align="center" align-self="center">
    <v-img width="360" src="assets/img/logo-w.png"/>
    <div class="caption">Copyright {{ new Date().getFullYear() }} 4thwith Tailoring - All Rights Reserved.</div>
    </v-col>
    <v-col cols="12" sm="6" md="5">
    <v-list-item two-line>
    <v-list-item-avatar><v-icon>mdi-phone</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>+63 909 422-2900</v-list-item-title>
    <v-list-item-subtitle>Contact No.</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
    <v-list-item-avatar><v-icon>mdi-email</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>support@4thwithtailoring.com</v-list-item-title>
    <v-list-item-subtitle>Email</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    </v-row>
    </v-container>
  </v-footer>
  <v-dialog max-width="480" v-model="dialog.logout">
    <v-card>
    <v-card-title>Confirm Logout</v-card-title>
    <v-card-text>Are you sure you want to log out?</v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn rounded depressed color="red" dark @click="logOut">Confirm</v-btn>
    <v-btn text @click="dialog.logout = false">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    </div>`
})