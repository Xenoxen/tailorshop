const Product = Vue.component('view-product', {
    data () {
        return {
            ordered: false,
            loggedIn: false,
            loading: {
                add: false,
                product: true,
                questions: true,
                askQuestion: false
            },
            question: null,
            dialog: {
                question: false,
                review: false
            },
            form: {
                measurements: {},
                size: null,
                head: null,
                chest: null,
                waist: null,
                back: null,
                sleeve: null,
                bust: null,
                hip: null,
                variant: null,
                qty: 1
            },
            info: {},
            questions: [],
            reviews: [],
            review: {},
            validate: false
        }
    },
    mounted () {
        if (sessionStorage.uid) { this.loggedIn = true }
        const id = this.$route.query.id
        let formData = new FormData()
        formData.set('id', id)
        if (this.loggedIn) { formData.set('uid', sessionStorage.uid) }
        // Get product data
        axios.post('./sql/get_product.php', formData).then((res) => {
            const product = res.data
            if (product.uid === sessionStorage.uid) { this.ordered = true }
            this.info = product
            console.log(product)
        }).catch((error) => { console.error(error); this.$emit('snackbar', error)})
        // Get questions
        axios.post('./sql/get_questions.php', formData).then((res) => {
            const questions = res.data
            this.questions = questions
        }).catch((error) => { console.error(error); this.$emit('snackbar', error) })
        // Get reviews
        axios.post('./sql/get_reviews.php', formData).then((res) => {
            let reviews = res.data
            reviews = reviews.map((review) => {
                review.rating = parseFloat(review.rating)
                return review
            })
            console.log(reviews)
            this.reviews = reviews
        })
    },
    methods: {
        addToCart () {
            if (this.$refs.addProduct.validate()) {
                this.loading.add = true
                let formData = new FormData()
                formData.set('product', this.$route.query.id)
                formData.set('account', sessionStorage.uid)
                formData.set('seller', this.info.seller)
                formData.set('name', this.info.name)
                formData.set('size', this.form.size)
                formData.set('head', this.form.head)
                formData.set('chest', this.form.chest)
                formData.set('waist', this.form.waist)
                formData.set('back', this.form.back)
                formData.set('sleeve', this.form.sleeve)
                formData.set('bust', this.form.bust)
                formData.set('hip', this.form.hip)
                formData.set('variant', this.form.variant)
                formData.set('qty', this.form.qty)
                axios.post('./sql/add_cart.php', formData).then((res) => {
                    const cartItem = res.data
                    console.log(cartItem)
                    this.loading.add = false
                    this.$emit('update-cart')
                    this.$emit('snackbar', 'Added "' + this.info.name + '" to cart!')
                }).catch((error) => { console.error(error); this.$emit('snackbar', error); this.loading.add = false })
            }
        },
        addReview () {
            let formData = new FormData()
            formData.set('product', this.$route.query.id)
            formData.set('rating', this.review.rating)
            formData.set('message', this.review.message)
            formData.set('uid', sessionStorage.uid)
            axios.post('./sql/add_review.php', formData).then((res) => {
                console.log(res.data)
                this.dialog.review = false
                this.$refs.review.reset()
            })
        },
        addQuestion () {
            const id = this.$route.query.id
            let formData = new FormData()
            formData.set('product', id)
            formData.set('question', this.question)
            formData.set('author', sessionStorage.displayName)
            axios.post('./sql/add_question.php', formData).then((res) => {
                const question = res.data
                console.log(question)
                this.questions.push(question)
                this.dialog.question = false
            })
        },
        addQty() {
            this.form.qty++;
        },
        subQty() {
            if(this.form.qty>1)
            this.form.qty--;
        }
    },
    template: `<v-container>
    <v-row>
    <v-col cols="12">
    <v-card tile elevation="0">
    <v-container>
    <v-row>
    <v-col cols="12" md="5">
    <v-img :aspect-ratio="1/1" :src="info.photo"></v-img>
    </v-col>
    <v-col cols="12" md="7">
    <div class="display-1 mb-1">{{info.name}}</div>
    <div class="text-h5 font-weight-bold">₱ {{info.price*form.qty}}</div>
    <div class="text-body-2 my-4">{{info.description}}</div>
    <v-form v-show="loggedIn" ref="addProduct" v-model="validate">
    <v-radio-group v-if="info.variants && info.variants.length > 0" :rules="$rules.required" color="secondary" v-model="form.variant" label="Variants" row>
    <v-radio v-for="(i, index) in info.variants" :value="i" :label="i"/>
    </v-radio-group>
    <v-radio-group :rules="$rules.required" color="secondary" v-model="form.size" label="Available Sizes" row>
    <v-radio value="Small" label="Small"/>
    <v-radio value="Medium" label="Medium"/>
    <v-radio value="Large" label="Large"/>
    <v-radio value="Custom Fit" label="Custom Fit"/>
    </v-radio-group>
    <v-row v-show="form.size === 'Custom Fit' && info.category === 'Hats'">
    <v-col cols="12"><v-text-field type="number" v-model="form.head" rounded filled placeholder="Head Size (in.)"/></v-col>
    </v-row>
    <v-row v-show="form.size === 'Custom Fit' && info.category === 'Shirts' || form.size === 'Custom Fit' && info.category === 'Sweaters'"">
    <v-col cols="12" sm="3" md="3"><v-text-field type="number" v-model="form.chest" rounded filled placeholder="Chest (in.)"/></v-col>
    <v-col cols="12" sm="3" md="3"><v-text-field type="number" v-model="form.waist" rounded filled placeholder="Waist (in.)"/></v-col>
    <v-col cols="12" sm="3" md="3"><v-text-field type="number" v-model="form.back" rounded filled placeholder="Back (in.)"/></v-col>
    <v-col cols="12" sm="3" md="3"><v-text-field type="number" v-model="form.sleeve" rounded filled placeholder="Sleeve (in.)"/></v-col>
    </v-row>
    <v-row v-show="form.size === 'Custom Fit' && info.category === 'Dresses'">
    <v-col cols="12" sm="4" md="4"><v-text-field type="number" v-model="form.bust" rounded filled placeholder="Bust (in.)"/></v-col>
    <v-col cols="12" sm="4" md="4"><v-text-field type="number" v-model="form.waist" rounded filled placeholder="Waist (in.)"/></v-col>
    <v-col cols="12" sm="4" md="4"><v-text-field type="number" v-model="form.hip" rounded filled placeholder="Hips (in.)"/></v-col>
    </v-row>
    <v-row v-show="form.size === 'Custom Fit' && info.category === 'Jeans'">
    <v-col cols="12" sm="6" md="6"><v-text-field type="number" v-model="form.weight" rounded filled placeholder="Waist (in.)"/></v-col>
    <v-col cols="12" sm="6" md="6"><v-text-field type="number" v-model="form.hip" rounded filled placeholder="Hip (in.)"/></v-col>
    </v-row>
    </v-form>
    <v-row align="center" v-show="loggedIn">
                        <v-btn icon @click="subQty"><v-icon>mdi-minus-circle-outline</v-icon></v-btn>
                        <div justify="center" class="text-h6 mx-3">{{form.qty}}</div>
                        <v-btn icon @click="addQty"><v-icon>mdi-plus-circle-outline</v-icon></v-btn>
                    </v-row>
    <v-col align="end">
    <v-btn x-large :loading="loading.add" depressed rounded color="accent" v-show="loggedIn" @click="addToCart"><v-icon class="mr-1">mdi-cart-plus</v-icon>Add To Cart</v-btn>
    </v-col>
    </v-col>
    </v-row>   
    </v-container>
    </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="6">
    <v-card tile elevation="0">
    <v-card-title>Questions
    <v-spacer/><v-btn icon @click="dialog.question = true" v-show="loggedIn"><v-icon>mdi-plus</v-icon></v-btn>
    </v-card-title>
    <v-container style="max-height: 360px; overflow-y: auto">
    <v-row>
    <v-col cols="12" v-for="(i, index) in questions" :key="'question-'+index">
    <div class="caption">{{i.author}}</div>
    <div class="text-body-2">{{i.question}}</div>
    <div class="text-body-1 green--text text-darken-1" v-show="i.answer"><b>A:</b> {{i.answer}}</div>
    </v-col>
    </v-row>
    </v-container>
    </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="6">
    <v-card tile elevation="0">
    <v-card-title>Reviews<v-spacer/><v-btn icon v-show="info.ordered" @click="dialog.review = true"><v-icon>mdi-plus</v-icon></v-btn></v-card-title>
    <v-container style="max-height: 360px; overflow-y: auto">
    <v-row>
    <v-col cols="12" v-for="(i, index) in reviews" :key="'question-'+index">
    <div class="caption">{{i.author}}</div>
    <v-list-item three-line>
    <v-list-item-content>
    <v-rating dense readonly color="amber darken-2" background-color="amber darken-2" :value="i.rating"/>
    <div class="text-body-1">{{i.message}}</div>
    <v-list-item-subtitle>{{i.fname}} {{i.lname}}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
    <v-btn icon></v-btn>
    </v-list-item-action>
    </v-list-item>
    </v-col>
    </v-row>
    </v-container>
    </v-card>
    </v-col>
    </v-row>
    <v-dialog v-model="dialog.question" max-width="600">
    <v-card>
    <v-card-title>Ask a Question</v-card-title>
    <v-card-text>
    <v-textarea label="Ask Question" outlined row="3" v-model="question"/>
    </v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn color="primary" rounded depressed @click="addQuestion">Submit</v-btn>
    <v-btn text @click="dialog.question = false">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    <v-dialog v-model="dialog.review" max-width="480">
    <v-card>
    <v-card-title>Review Product</v-card-title>
    <v-card-text>
    <div class="caption mb-3">Rating</div>
    <v-form ref="review">
    <v-rating v-model="review.rating" :rules="$rules.required" dense background-color="amber darken-1" color="amber darken-2"/>
    <v-textarea v-model="review.message" :rules="$rules.required" rounded filled placeholder="Message"/>
    </v-form>
    </v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn rounded depressed color="primary" @click="addReview">Submit</v-btn>
    <v-btn text @click="dialog.review = false">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    </v-container>`
})