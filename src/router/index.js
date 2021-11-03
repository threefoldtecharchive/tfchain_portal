import Vue from 'vue'
import VueRouter from 'vue-router'
import Accounts from '../views/Accounts.vue'
import Account from '../views/Account.vue'
import Explorer from '../views/Explorer.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Accounts',
    component: Accounts
  },
  {
    path: '/account/:accountID',
    name: 'Account',
    component: Account,
  },
  {
    path: '/explorer',
    name: 'Explorer',
    component: Explorer
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
