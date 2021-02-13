const routes = [
    {
        path: '/',
        component: mainView,
        children: [
            {
                path: '',
                component: Home
            },
            {
                path: 'checkout',
                component: Checkout,
                beforeEnter (to, from, next) {
                    if (sessionStorage.uid) { next(false) }
                    else { next() }
                }
            },
            {
                path: 'sign-in',
                component: Login,
                beforeEnter (to, from, next) {
                    if (sessionStorage.uid) { next(false) }
                    else { next() }
                }
            },
            {
                path: 'my-profile',
                component: CustomerProfile
            },
            {
                path: 'shop',
                component: Shop
            },
            {
                path: 'product',
                component: Product
            },
            {
                path: 'sign-up',
                component: Register,
                beforeEnter (to, from, next) {
                    if (sessionStorage.uid) { next(false) }
                    else { next() }
                },
                children: [
                    {
                        path: '',
                        component: Registration
                    },
                    {
                        path: 'customer',
                        component: CustomerRegistration
                    },
                    {
                        path: 'seller',
                        component: SellerRegistration
                    }
                ]
            }
        ]
    },
    {
        path: '/seller',
        component: Seller,
        children: [
            {
                path: '',
                component: SellerDashboard
            },
            {
                path: 'orders',
                component: SellerOrders
            },
            {
                path: 'questions',
                component: ProductQuestions
            },
            {
                path: 'my-products',
                component: MyProducts
            },
            {
                path: 'my-profile',
                component: BusinessProfile
            }
        ]
    }
]