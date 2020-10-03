import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import firstPage from './components/pages/myFirstVuePage'
import newRoutePage from './components/pages/newRoutePage'
import hooks from './components/pages/basic/hooks.vue'
import methods from './components/pages/basic/methods'

import home from './components/pages/home'
import tags from './admin/pages/tags'
import category from './admin/pages/category'
import adminusers from './admin/pages/adminusers'
import login from './admin/pages/login'
import role from './admin/pages/role'
import assignRole from './admin/pages/assignRole'


const routes = [
    //admin projectr pages
    {
        path: '/', 
        component: home,
        name: 'home'
    }, 
    {
        path: '/tags', 
        component: tags,
        name: 'tags'
    }, 
    {
        path: '/category', 
        component: category,
        name: 'category'
    }, 
    {
        path: '/admin-users', 
        component: adminusers,
        name: 'admin-users'
    }, 
    {
        path: '/login', 
        component: login,
        name: 'login'
    }, 
    {
        path: '/role', 
        component: role,
        name: 'role'
    }, 
    {
        path: '/assign-role', 
        component: assignRole,
        name: 'assign-role'
    }, 













    
    {
        path: '/my-new-vue-route', 
        component: firstPage
    },
    {
        path: '/new-route', 
        component: newRoutePage
    },

    //vue hooks
    {
        path: '/hooks', 
        component: hooks
    }, 
    
    //methods
    {
        path: '/methods', 
        component: methods
    }, 
]

export default new Router({
    mode: 'history',
    routes
})