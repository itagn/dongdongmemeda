import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from  '../components/blog/home.vue'
import Create from '../components/blog/create.vue'
import User from  '../components/user/home.vue'
import Root from '../components/manager/home.vue'
import Blog from '../components/blog/blog.vue'

Vue.use(Router)

export default new Router({
  //  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/create',
      name: 'create',
      component: Create
    },
    {
      path: '/root',
      name: 'root',
      component: Root
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog
    },
    {
      path: '/logout',
      name: 'logout',
      component: Login
    }
  ]
})
