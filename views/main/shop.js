const Shop = Vue.component('shop-view', {
    data () {
        return {
            category: null,
            categories: ['All Items', 'Shirts', 'Dresses', 'Jeans', 'Sweaters'],
            breadcrumbs: [
                {
                  text: 'Shop',
                  disabled: false,
                },
                {
                  text: null,
                  disabled: false,
                }
            ],
            loading: {
                products: false
            },
            products: []
        }
    },
    computed: {
        filteredProducts () {
            return this.products.filter((product) => {
                if (this.category && this.category === product.category) {
                    return product
                } else if (!this.category) {
                    return product
                }
            })
        }
    },
    mounted () {
        // Sets default breadcrumb to "All Items"
        this.breadcrumbs[1].text = 'All Items'
        // Gets all existing products
        axios.get('./sql/get_products.php').then((res) => {
            const products = res.data
            this.products = products
        })
    },
    methods: {
        selectCategory(c) {
            if (c === 'All Items') { this.category = null; this.breadcrumbs[1].text = 'All Items' }
            else { this.category = c; this.breadcrumbs[1].text = c }
        }
    },
    template: `<div>
    <v-container>
    <v-row>
    <v-col cols="12" sm="4" md="3">
    <v-card tile elevation="0">
    <v-card-title>Categories</v-card-title>
    <v-list one-line>
    <v-list-item-group active-class="primary--text">
    <v-list-item link v-for="(i, index) in categories" :key="'category-'+index" @click="selectCategory(i)">
    <v-list-item-content>
    <v-list-item-title>{{i}}</v-list-item-title>
    </v-list-item-content>
    </v-list-item>
    </v-list-item-group>
    </v-list>
    </v-card>
    </v-col>
    <v-col cols="12" sm="8" md="9">
    <v-card tile elevation="0">
    <v-breadcrumbs :items="breadcrumbs" large></v-breadcrumbs>
    </v-card>
    <br>
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in filteredProducts" :key="'product-'+index">
    <v-skeleton-loader type="card, card, card, card" :loading="loading.products">
    <product-card :info="i" @edit-product="editDialog($event)" @delete-product="deleteDialog($event)"/>
    </v-skeleton-loader>
    </v-col>
    </v-row>
    </v-col>
    </v-row>
    </v-container>
    </div>`
})