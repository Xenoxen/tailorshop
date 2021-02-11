Vue.prototype.$rules = {
  agreement: [v => !!v || 'Please agree to the terms and conditions.'],
  required: [v => !!v || 'Field cannot be empty.'],
  gender: [v => !!v || 'Please define your gender.'],
  email: [v => !!v || 'Field cannot be empty.', v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email address must be valid.'],
  password: [
    v => !!v || 'Password field cannot be empty.',
    (v) => (v && v.length >= 8) || 'Password must be a minimum of 8 characters'
  ],
  phoneNumber: [v => !!v || 'Phone number is required.', v => v.length === 10 || 'Phone number is not formatted correctly.']
}
