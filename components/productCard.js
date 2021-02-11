const ProductCard = Vue.component('product-card', {
    props: ['info', 'index'],
    methods: {
        editProduct () { this.$emit('edit-product', this.info) },
        deleteProduct () {
            const payload = {
                id: this.info.id,
                index: this.index
            }
            this.$emit('delete-product', payload)
        }
    },
    mounted () {
        console.log(this.info)
    },
    template: `<v-card tile elevation="0">
    <v-img :aspect-ratio="1/1" :src="info.photo"/>
    <router-link :to="{path: '/product', query: { id: info.id }}">
    <v-card-title class="font-weight-light pt-1 pb-0"><v-spacer/>{{info.name}}<v-spacer/></v-card-title>
    </router-link>
    <v-card-subtitle class="font-weight-light text-center py-1">₱ {{info.price}}</v-card-subtitle>
    <v-card-actions v-show="$route.path === '/seller/my-products'">
    <v-spacer/>
    <!-- <v-btn icon small @click="editProduct"><v-icon small>mdi-pencil</v-icon></v-btn> -->
    <v-btn icon small @click="deleteProduct"><v-icon small>mdi-delete</v-icon></v-btn>
    </v-card-actions>
    </v-card>`
})