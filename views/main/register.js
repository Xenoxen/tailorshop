const Register = Vue.component('register-view', {
    name: 'RegisterView',
    template: `<div>
    <transition appear name="fade" mode="out-in">
    <router-view/>
    </transition>
    </div>`
})