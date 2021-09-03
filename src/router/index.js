import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from "../store";

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/customer',
        name: 'Customer',
        component: () =>
            import ('../views/Customer.vue')
    },
    {
        path: '/user',
        name: 'User',
        component: () =>
            import ('../views/User.vue')
    },
    {
        path: '/role',
        name: 'Role',
        component: () =>
            import ('../views/Role.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/products',
        name: 'Products',
        component: () =>
            import ('../views/Products')
    },
    {
        path: '/carts',
        name: 'Carts',
        component: () =>
            import ('../views/CartNew.vue')
    },
    {
        path: '/forgot',
        name: 'Forgot',
        component: () =>
            import ('../views/ForgotPassword.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () =>
            import ('../views/Profile.vue')
    },
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: () =>
            import ('../views/ChangePassword.vue')
    },
    {
        path: '/categories',
        name: 'Categories',
        component: () =>
            import ('../views/Category.vue')
    },
    {
        path: '/order',
        name: 'Order',
        component: () =>
            import ('../views/Order.vue')
    },
    {
        path: '/order-detail',
        name: 'OrderDetail',
        component: () =>
            import ('../views/OrderDetail.vue')
    },
    {
        path: '/product-detail',
        name: 'ProductDetail',
        component: () =>
            import ('../views/ProductDetail.vue')
    },
    {
        path: '/permissions',
        name: 'Permission',
        component: () =>
            import('../views/Permission.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.name !== 'Login' && !store.state.auth.isAuthenticated) {
        next({ name: 'Login'})
    } else {
        next()
    }
})

export default router