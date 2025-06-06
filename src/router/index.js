import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import Dashboard from "../views/Dashboard.vue"
import PageNotFound from "../views/error/PageNotFound.vue"
import Book from "../views/Book.vue"
import Plan from "../views/Plan.vue"

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            auth: true
        }
    },
    {
        path: '/book',
        name: 'book',
        component: Book,
        meta: {
            auth: true
        }
    },
    {
        path: '/plans',
        name: 'plans',
        component: Plan,
        meta: {
            auth: true
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            guest: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            guest: true
        }
    },
    {
        path: '/:pathMatch(.*)',
        name: 'page-not-found',
        component: PageNotFound,
        meta: {
            guest: true
        }
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.auth && !token) {
        next('/login')
    }

    if (to.meta.guest && token) {
        return next('/')
    }

    next()
})

export default router
