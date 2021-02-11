const Home = Vue.component('home-view', {
    data () {
        return {
            banner: './assets/img/banner.png',
            products: [],
            loading: {
              products: false
            }
        }
    },
    mounted () {
      // Gets all existing products
      axios.get('./sql/get_latest_products.php').then((res) => {
        const products = res.data
        this.products = products
      })
    },
    template: 
    `<div>
    <v-img height="600" :src="banner">
    </v-img>
    <v-sheet color="grey lighten-3" class="py-5">
    <v-container>
    <v-sheet color="grey lighten-3">
    <v-container>
    <v-row>
    <v-col cols="12" md="4">
    <v-card tile elevation="0"><v-img src="assets/img/shirts-1.jpg"/></v-card>
    <br>
    <v-card tile elevation="0"><v-img src="assets/img/dresses-1.jpg"/></v-card>
    </v-col>
    <v-col cols="12" md="4">
    <v-card tile elevation="0"><v-img src="assets/img/sweaters-1.jpg"/></v-card>
    </v-col>
    <v-col cols="12" md="4">
    <v-card tile elevation="0"><v-img src="assets/img/hats-1.jpg"/></v-card>
    <br>
    <v-card tile elevation="0"><v-img src="assets/img/jeans-1.jpg"/></v-card>
    </v-col>
    </v-row>
    </v-container>
    </v-sheet>
    <v-divider class="my-2"/>
    <v-row>
    <v-col cols="12">
    <div class="display-1 mt-3">Latest Products</div>
    </v-col>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in products" :key="'product-'+index">
    <v-skeleton-loader type="card, card, card, card" :loading="loading.products">
    <product-card :info="i"/>
    </v-skeleton-loader>
    </v-col>
    </v-row>
    </v-container>
    </v-sheet>
    </div>`
})