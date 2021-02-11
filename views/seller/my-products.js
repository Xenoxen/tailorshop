const MyProducts = Vue.component('my-products', {
    data () {
        return {
            photo: './assets/img/image-placeholder.jpeg',
            photoFile: null,
            form: {
              name: null,
              category: null,
              price: null,
              small: false,
              medium: false,
              large: false,
              custom: false
            },
            loading: {
              products: true,
              add: false
            },
            products: [],
            dialog: {
              product: false,
              delete: false
            },
            validate: {
              product: false
            },
            sizes: ['Small', 'Medium', 'Large', 'Custom Fit'],
            remove: {
              id: null,
              index: null
            }
        }
    },
    mounted () {
      let formData = new FormData()
      formData.set('uid', sessionStorage.uid)
      // Get seller's products.
      axios.post('./sql/get_seller_products.php', formData).then((res) => {
        console.log(res.data)
        const products = res.data
        this.products = products
        this.loading.products = false
      }).catch((error) => { console.error(error); this.loading.products = false })
    },
    methods: {
      addProduct () {
        if (this.$refs.productDialog.validate()) {
          this.loading.add = true
          let formData = new FormData()
          formData.set('uid', sessionStorage.uid)
          formData.set('name', this.form.name)
          formData.set('description', this.form.description)
          formData.set('category', this.form.category)
          formData.set('small', this.form.small)
          formData.set('medium', this.form.medium)
          formData.set('large', this.form.large)
          formData.set('custom', this.form.custom)
          formData.set('price', this.form.price)
          formData.append('photo', this.photoFile)
          axios.post('./sql/add_product.php', formData, {headers: { 'Content-Type': 'multipart/form-data' }})
          .then((res) => {
            const product = res.data
            this.dialog.product = false
            this.loading.add = false
            console.log(product)
            this.products.push(product)
            this.$refs.productDialog.reset()
          })
          .catch((error) => { console.error(error); this.loading.add = false })
        }
      },
      editProduct () {
        if (this.$refs.productDialog.validate()) {
          this.loading.add = true
          let formData = new FormData()
          formData.set('id', this.form.id)
          formData.set('uid', sessionStorage.uid)
          formData.set('name', this.form.name)
          formData.set('description', this.form.description)
          formData.set('category', this.form.category)
          formData.set('sizes', this.form.sizes)
          formData.set('price', this.form.price)
          formData.append('photo', this.photoFile)
          axios.post('./sql/edit_product.php', formData, {headers: { 'Content-Type': 'multipart/form-data' }})
          .then((res) => {
            const product = res.data
            this.dialog.product = false
            this.loading.add = false
            console.log(product)
            this.products.splice(product, 1)
            this.$refs.productDialog.reset()
          })
          .catch((error) => { console.error(error); this.loading.add = false })
        }
      },
      cancelProductDialog () {
        if (this.$refs.productDialog) { this.$refs.productDialog.reset() }
        this.form = {
          name: null,
          category: null,
          price: null,
          sizes: []
        }
        this.dialog.product = false
      },
      editDialog (info) {
        console.log(info)
        // this.form = info
        this.form = info
        this.dialog.product = true
      },
      deleteDialog (data) {
        this.remove.id = data.id
        this.remove.index = data.index
        this.dialog.delete = true
      },
      onFileUpload(){
        if(this.photoFile) { this.photo = URL.createObjectURL(this.photoFile); }
      },
      deleteProduct () {
        let formData = new FormData()
        formData.set('id', this.remove.id)
        axios.post('./sql/del_product.php', formData, {headers: { 'Content-Type': 'multipart/form-data' }})
          .then(() => {
            this.products.splice(this.remove.index, 1)
            this.dialog.delete = false
            this.loading.delete = false
            this.remove = {
              id: null,
              index: null
            }
          }).catch((error) => { console.error(error); this.loading.add = false })
      }
    },
    template: `<v-container>
    <v-row>
    <v-col cols="12" sm="4" md="3" v-for="(i, index) in products" :key="'product-'+index">
    <transition appear name="pop" mode="out-in">
    <v-skeleton-loader type="card, card, card, card" :loading="loading.products">
    <product-card :info="i" :index="index" @edit-product="editDialog($event)" @delete-product="deleteDialog($event)"/>
    </v-skeleton-loader>
    </transition>
    </v-col>
    </v-row>
    <v-fab-transition>
      <v-btn exact color="white" fab large fixed bottom right @click="dialog.product = true">
        <v-icon color="primary">mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog max-width="920" v-model="dialog.product" @click:outside="cancelProductDialog">
    <v-card>
    <v-card-title>Add Product</v-card-title>
    <v-card-text>
    <v-form ref="productDialog" v-model="validate.product">
    <v-row>
    <v-col cols="12" sm="4" md="4">
    <v-img :aspect-ratio="1/1" :src="photo"/>
    <v-file-input @change="onFileUpload" :rules="$rules.required" v-model="photoFile" accept=".jpg, .jpeg, .png" rounded filled label="Product Photo"/>
    </v-col>
    <v-col cols="12" sm="8" md="8">
    <v-row>
    <v-col cols="12">
    <v-text-field :rules="$rules.required" rounded filled v-model="form.name" placeholder="Product Name"/>
    <v-textarea :rules="$rules.required" rounded rows="3" filled v-model="form.description" placeholder="Description"/>
    </v-col>
    <v-col cols="12" md="6">
    <v-select :rules="$rules.required" :items="$categories" rounded filled v-model="form.category" placeholder="Category"/>
    </v-col>
    <v-col cols="12" md="6">
    <v-text-field :rules="$rules.required" type="number" rounded filled v-model="form.price" placeholder="Price (PHP)"/>
    </v-col>
    <v-col cols="12">
    <div class="caption">Available Sizes</div>
    <v-row>
    <v-checkbox label="Small" v-model="form.small"/>
    <v-checkbox label="Medium" v-model="form.medium"/>
    <v-checkbox label="Large" v-model="form.large"/>
    <v-checkbox label="Custom Fit" v-model="form.custom"/>
    </v-row>
    </v-col>
    </v-row>
    </v-col>
    </v-row>
    </v-form>
    </v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn v-if="form.id" :loading="loading.add" rounded depressed color="primary" @click="editProduct">Add</v-btn>
    <v-btn v-else :loading="loading.add" rounded depressed color="primary" @click="addProduct">Add</v-btn>
    <v-btn text @click="cancelProductDialog">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    <v-dialog max-width="360" v-model="dialog.delete">
    <v-card>
    <v-card-title>Confirm Product Deletion</v-card-title>
    <v-card-text>Are you sure you want to delete this product?</v-card-text>
    <v-card-actions>
    <v-spacer/>
    <v-btn rounded depressed dark color="red" @click="deleteProduct">Delete</v-btn>
    <v-btn text @click="dialog.delete = false">Cancel</v-btn>
    </v-card-actions>
    </v-card>
    </v-dialog>
    </v-container>`
})