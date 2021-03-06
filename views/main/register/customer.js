const CustomerRegistration = Vue.component('customer-registration', {
    data () {
        return {
            validate: false,
            loading: false,
            cpass: null,
            dialog: {
                success: false
            },
            rules: {
                password: [v => v === this.form.pass || 'Passwords do not match.',
                v => !!v || 'This field cannot be blank.']
            },
            form: {}
        }
    },
    methods: {
        submitRegistration () {
            if (this.$refs.registration.validate()) {
                let formData = new FormData()
                formData.set('type', 'customer')
                formData.set('email', this.form.email);
                formData.set('pass', this.form.pass);
                formData.set('fname', this.form.fname);
                formData.set('lname', this.form.lname);
                formData.set('address', this.form.address);
                formData.set('city', this.form.city);
                formData.set('province', this.form.province);
                formData.set('contact', this.form.contact);
                axios.post('./sql/registration.php', formData)
                .then((res) => {
                    console.log(res.data)
                    if (res.data === '') {
                        this.dialog.success = true
                    }
                 }).catch((error) => { console.error(error) })
            }
        }
    },
    template: `<v-container>
    <v-card elevation="0">
    <v-card-title class="display-1 font-weight-light">Customer Registration</v-card-title>
    <v-divider class="mx-4"/>
    <v-card-text>
    <v-row>
    <v-col cols="12" sm="6" md="8">
    <v-form ref="registration" v-model="validate">
    <v-row>
    <v-col cols="12" md="4"><v-text-field :rules="$rules.required" type="email" v-model="form.email" rounded filled placeholder="Email Address"/></v-col>
    <v-col cols="12" md="4"><v-text-field :rules="$rules.required" v-model="form.pass" type="password" rounded filled placeholder="Password"/></v-col>
    <v-col cols="12" md="4"><v-text-field :rules="rules.password"  v-model="cpass" type="password" rounded filled placeholder="Confirm Password"/></v-col>
    <v-col cols="12" md="6"><v-text-field :rules="$rules.required" v-model="form.fname" rounded filled placeholder="First Name"/></v-col>
    <v-col cols="12" md="6"><v-text-field :rules="$rules.required" v-model="form.lname" rounded filled placeholder="Last Name"/></v-col>
    <v-col cols="12"><v-text-field :rules="$rules.required" v-model="form.address" rounded filled placeholder="Home Address"/></v-col>
    <v-col cols="12" md="4"><v-text-field :rules="$rules.required" v-model="form.city" rounded filled placeholder="City"/></v-col>
    <v-col cols="12" md="4"><v-select :rules="$rules.required" :items="$provinces" v-model="form.province" rounded filled placeholder="Province"/></v-col>
    <v-col cols="12" md="4"><v-text-field v-model="form.contact" maxlength="11" rounded filled placeholder="Contact No." hint="e.g. 09021231234"/></v-col>
    <v-col cols="12" align="end"><v-btn :loading="loading" @click="submitRegistration" large depressed rounded color="primary">Sign Up Now</v-btn></v-col>
    </v-row>
    </v-form>
    </v-col>
    <v-col cols="12" sm="6" md="4">
    <transition appear name="slide-fade">
    <v-img height="100%" src="assets/img/customer-reg.jpg" style="border-radius: 25px;"/>
    </transition>
    </v-col>
    </v-row>
    </v-card-text>
    </v-card>
    <v-dialog v-model="dialog.success" max-width="480">
    <v-card>
    <v-card-title>Registration Complete!</v-card-title>
    <v-card-text>Welcome!  Thank you for registering an account at our shop.  You can now order apparel from any of our sellers.</v-card-text>
    <v-card-actions>
    <v-btn x-large tile depressed block color="primary" to="/sign-in">Get Started</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    </v-container>`
})