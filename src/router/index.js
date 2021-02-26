import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/oColumn/:id',
    name: 'oColumn',
    component: () => import('../views/oColumn.vue')
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: () => import('../views/Article.vue')
  },
  {
    path: '/edit',
    name: 'myEdit',
    component: () => import('../views/myEdit.vue')
  },
  {
    path: '/createArticle',
    name: 'createArticle',
    component: () => import('../views/createArticle.vue')
  },
  {
    path: '/myCollect',
    name: 'myCollect',
    component: () => import('../views/myCollect.vue')
  },
  {
    path: '/editArticle/:id',
    name: 'editArticle',
    component: () => import('../views/editArticle.vue')
  },
  {
    path: '/createColumn',
    name: 'createColumn',
    component: () => import('../views/createColumn.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
