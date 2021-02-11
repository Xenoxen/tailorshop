const Seller = Vue.component('seller-view', {
    data () {
        return {
            nav: [
                {text: 'Dashboard', icon: 'mdi-view-dashboard', link: '/seller'},
                {text: 'My Products', icon: 'mdi-home', link: '/seller/my-products'},
                {text: 'Questions', icon: 'mdi-information', link: '/seller/questions'},
                {text: 'My Business Profile', icon: 'mdi-avatar-circle', link: '/seller/my-profile'},
                {text: 'Orders', icon: 'mdi-home', link: '/seller/orders'},
                {text: 'Home', icon: 'mdi-home', link: '/'}
            ],
            dialog: {
                logout: false
            }
        }
    },
    methods: {
        logOut () {
            sessionStorage.clear()
            router.push('/')   
        }
    },
    template: `<div>
    <v-app-bar app color="white" elevate-on-scroll>
    <v-btn text exact v-for="(i, index) in nav" :key="'nav-'+index" :to="i.link">{{i.text}}</v-btn>
    <v-spacer/>
    <v-btn text @click="dialog.logout = true">Logout</v-btn>
    </v-app-bar>
    <router-view/>
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