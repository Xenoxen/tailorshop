const Registration = Vue.component('registration-choices', {
    template: `<v-container>
    <v-row>
    <v-col cols="12">
    <v-card elevation="0">
    <v-card-title class="font-weight-light display-1 mb-4"><v-spacer/>I want to sign up as a...<v-spacer/></v-card-title>
    <v-card-text>
    <v-row>
    <v-col cols="12" sm="6" md="6" align="center">
    <v-card elevation="0" color="transparent" to="/sign-up/customer">
    <v-card-text>
    <v-avatar class="ma-5" size="320"><v-img src="assets/img/customer.jpg"/></v-avatar>
    <div class="display-1 font-weight-light">Customer</div>
    </v-card-text>
    </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="6" align="center">
    <v-card elevation="0" color="transparent" to="/sign-up/seller">
    <v-card-text>
    <v-avatar class="ma-5" size="320"><v-img src="assets/img/seller.jpg"/></v-avatar>
    <div class="display-1 font-weight-light">Seller</div>
    </v-card-text>
    </v-card>
    </v-col>
    </v-row>
    </v-card-text>
    </v-card>
    </v-col>
    </v-row>
    </v-container>`
})