Vue.prototype.$convertToLongDate = (timestamp) => {
    return moment(timestamp, 'YYYY-MM-DD HH:mm:ss').format('MMMM DD, YYYY')
}
Vue.prototype.$convertToShortDateTime = (timestamp) => {
    return moment(timestamp, 'YYYY-MM-DD HH:mm:ss').format('MM/DD/YYYY h:mm A')
}