import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import PageHome from '@/pages/PageHome'
import PageMeetupDetail from '@/pages/PageMeetupDetail'
import PageMeetupFinde from '@/pages/PageMeetupFinde'
import PageNotFound from '@/pages/PageNotFound'
import PageLogin from '@/pages/PageLogin'
import PageRegister from '@/pages/PageRegister'
import PageSecret from '@/pages/PageSecret'
import PageProfile from '@/pages/PageProfile'
import PageNotAuth from '@/pages/PageNotAuth'
import PageMeetupCreate from '@/pages/PageMeetupCreate'
import PageMeetupEdit from '@/pages/PageMeetupEdit'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'PageHome',
            component: PageHome
        },
        {
            path: '/me',
            name: 'PageProfile',
            component: PageProfile,
            meta: {onlyAuthUser: true}
        },
        {
            path: '/meetups/secret',
            name: 'PageSecret',
            component: PageSecret,
            meta: {onlyAuthUser: true}
        },
        {
            path: '/meetups/new',
            name: 'PageMeetupCreate',
            component: PageMeetupCreate,
            meta: {onlyAuthUser: true}
        },
        {
            path: '/meetups/:meetupId/edit',
            name: 'PageMeetupEdit',
            component: PageMeetupEdit,
            meta: {onlyAuthUser: true},
            props: true
        },
        {
            path: '/meetups/:id',
            name: 'PageMeetupDetail',
            component: PageMeetupDetail
        },
        {
            path: '/find',
            name: 'PageMeetupFinde',
            component: PageMeetupFinde
        },
        {
            path: '/find/:category',
            name: 'PageMeetupFindeCategory',
            component: PageMeetupFinde,
            props: true
        },
        {
            path: '/login',
            name: 'PageLogin',
            component: PageLogin,
            meta: {onlyGuestUser: true}
        },
        {
            path: '/register',
            name: 'PageRegister',
            component: PageRegister,
            meta: {onlyGuestUser: true}
        },
        {
            path: '/401',
            name: 'PageNotAuth',
            component: PageNotAuth
        },
        {
            path: '*',
            name: 'PageNotFound',
            component: PageNotFound
        }
    ],
    mode: 'history' 
})

router.beforeEach((to, from, next) => {
    store.dispatch('auth/getAuthUser')
        .then(() => {
            if(to.meta.onlyAuthUser) {
                if(store.getters['auth/isAuthenticated']) {
                    next()
                } else {
                    next({name: 'PageNotAuth'})
                }
            } else if(to.meta.onlyGuestUser) {
                if(store.getters['auth/isAuthenticated']) {
                    next({name: 'PageHome'})
                } else {
                    next()
                }
            } else {
                next()
            }
        })
})

export default router