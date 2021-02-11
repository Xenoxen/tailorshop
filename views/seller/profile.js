const BusinessProfile = Vue.component('business-profile', {
    data () {
        return {
            tab: null,
            categories: ['hats', 'shirts', 'dresses', 'sweaters', 'jeans'],
            info: {}
        }
    },
    computed: {
        hatsList () {
            if (this.info.products) {
                return this.info.products.filter((product) => {
                    if (product.category === 'Hats') {
                        return product
                    }
                })
            } else {
                return []
            }
        },
        shirtsList () {
            if (this.info.products) {
                return this.info.products.filter((product) => {
                    if (product.category === 'Shirts') {
                        return product
                    }
                })
            } else {
                return []
            }
        },
        dressesList () {
            if (this.info.products) {
                return this.info.products.filter((product) => {
                    if (product.category === 'Dresses') {
                        return product
                    }
                })
            } else {
                return []
            }
        },
        sweatersList () {
            if (this.info.products) {
                return this.info.products.filter((product) => {
                    if (product.category === 'Sweaters') {
                        return product
                    }
                })
            } else {
                return []
            }
        },
        jeansList () {
            if (this.info.products) {
                return this.info.products.filter((product) => {
                    if (product.category === 'Jeans') {
                        return product
                    }
                })
            } else {
                return []
            }
        }
    },
    mounted () {
        let formData = new FormData()
        if (this.$route.query.id) {
            formData.set('id', this.$route.query.id)
        } else {
            formData.set('uid', sessionStorage.uid)
        }
        axios.post('./sql/get_business_profile.php', formData).then((res) => {
            const profile = res.data
            console.log(profile)
            this.info = profile
        })
    },
    template: `<v-container>
    <v-row>
    <v-col cols="12">
    <v-card tile elevation="0">
    <v-container>
    <v-row>
    <v-col cols="12" md="4">
    <v-avatar tile size="280"><v-img :src="info.logo"/></v-avatar>
    </v-col>
    <v-col cols="12" md="8" align-self="center">
    <div class="display-1">{{info.name}}</div>
    <div class="text-h5 font-weight-light">Started {{$convertToLongDate(info.created)}}</div>
    <br>
    <v-list-item two-line>
    <v-list-item-avatar><v-icon>mdi-storefront</v-icon></v-list-item-avatar>
    <v-list-item-content>
    <v-list-item-title>{{info.products ? info.products.length : 0}} Products</v-list-item-title>
    <v-list-item-subtitle>Total Products</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
    </v-col>
    </v-row>
    </v-container>
    <v-card-actions>
    <v-tabs v-model="tab">
    <v-tab href="#home">Home</v-tab>
    <v-tab v-for="(i, index) in categories" :key="'tab-'+index" :href="'#' + i">{{i}}</v-tab>
    </v-tabs>
    </v-card-actions>
    </v-card>
    </v-col>
    <v-col cols="12">
    <v-tabs-items class="transparent" v-model="tab">
    <v-tab-item value="home">
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(f, ind) in info.products" :key="'product-all-'+ind">
    <product-card :info="f" :index="ind"/>
    </v-col>
    </v-row>
    </v-tab-item>
    <v-tab-item value="hats">
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in hatsList" :key="'product-hats-'+index">
    <product-card :info="i" :index="index"/>
    </v-col>
    </v-row>
    </v-tab-item>
    <v-tab-item value="shirts">
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in shirtsList" :key="'product-shirtss-'+index">
    <product-card :info="i" :index="index"/>
    </v-col>
    </v-row>
    </v-tab-item>
    <v-tab-item value="dresses">
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in dressesList" :key="'product-dresses-'+index">
    <product-card :info="i" :index="index"/>
    </v-col>
    </v-row>
    </v-tab-item>
    <v-tab-item value="sweaters">
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in sweatersList" :key="'product-sweaters-'+index">
    <product-card :info="i" :index="index"/>
    </v-col>
    </v-row>
    </v-tab-item>
    <v-tab-item value="jeans">
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in jeansList" :key="'product-jeans-'+index">
    <product-card :info="i" :index="index"/>
    </v-col>
    </v-row>
    </v-tab-item>
    </v-tabs-items>
    </v-col>
    </v-row>
    </v-container>`
})