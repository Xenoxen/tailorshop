const Login = Vue.component('login-view', {
    data () {
        return {
            validate: {
                login: false,
                forgot: false
            },
            loading: {
                login: false
            },
            form: {
                email: null,
                password: null
            },
            showPassword: false
        }
    },
    computed: {
        passField () {
          var type = null
          if (this.showPassword) {
            type = 'text'
          } else {
            type = 'password'
          }
          return type
        }
    },
    methods: {
      signIn () {
        if (this.$refs.login.validate()) {
          this.loading.login = true
          axios.post('./sql/login.php', this.form)
          .then((res) => {
            const data = res.data
            console.log(data)
            if(data) {
              sessionStorage.setItem('uid', data.uid)
              sessionStorage.setItem('displayName', data.displayName)
              sessionStorage.setItem('email', data.email)
              sessionStorage.setItem('type', data.type)
              if (data.type === 'customer') { router.push('/') }
              else if (data.type === 'seller') { router.push('/seller') }
            }
            this.loading.login = false
           }).catch((error) => { console.error(error); this.$emit('snackbar', error); this.loading.login = false })
        }
      }
    },
    template :`
    <v-img :aspect-ratio="21/9" src="assets/img/loginbg.jpg">
    <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
          <transition appear name="slide-fade">
          <v-col cols="12" sm="8" md="6">
                <v-card elevation="0">
                  <v-card-title class="text-h5 my-5 text-uppercase font-weight-light"><v-spacer/>
                  Sign Into Your Account
                    <v-spacer/>
                    </v-card-title>
                <v-card-text>
                <v-row>
                <v-col cols="12" sm="6" md="7">
                <v-form ref="login" v-model="validate.login">
                    <v-text-field filled :rules="$rules.required" rounded placeholder="Email Address" v-model="form.email" prepend-inner-icon="mdi-email" type="email"></v-text-field>
                    <v-text-field filled :rules="$rules.required" rounded placeholder="Password" v-model="form.password" :type="passField" name="password"  prepend-inner-icon="mdi-lock">
                    <template v-slot:append>
                    <v-btn icon small @click="showPassword = !showPassword" >
                      <v-icon small color="grey">{{ showPassword ? "mdi-eye-off" : "mdi-eye" }}</v-icon>
                    </v-btn>
                  </template>
                    </v-text-field>
                  </v-form>
                </v-col>
                <v-col cols="12" sm="6" md="5">
                  <v-btn :loading="loading.login" block rounded depressed large class="mb-1" color="primary" @click="signIn">Sign In</v-btn>
                  <div class="caption my-3 text-center">Don't have an account yet?</div>
                  <v-btn :loading="loading.login" block rounded outlined large class="mb-1" to="/sign-up">Sign Up Now!</v-btn>
                </v-col>
                </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </transition>
          </v-row>
        </v-container>
    </v-img>`
})