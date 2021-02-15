Vue.prototype.$provinces = ['Bataan', 'Batangas', 'NCR', 'Tarlac']
Vue.prototype.$categories = ['Hats', 'Shirts', 'Dresses', 'Jeans', 'Sweaters']
Vue.prototype.$statusColors = (status) => {
    let color = null
    switch(status) {
        case 'Processing':
            color = 'grey'
            break
        case 'Delivering':
            color = 'light-blue darken-1'
            break
        case 'Delivered':
            color = 'green darken-1'
            break
        case 'Cancelled':
            color = 'red darken-1'
            break
    }
    return color
}