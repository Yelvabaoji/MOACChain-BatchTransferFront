const CHAIN3_URL = 'http://localhost:8545'

import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

import Chain3 from 'chain3'
import global_ from './global'
Vue.prototype.GLOBAL = global_

global_.chain3 = new Chain3()
global_.chain3.setProvider(new Chain3.providers.HttpProvider(CHAIN3_URL))

if (!global_.chain3.isConnected()) {
  console.log('Chain3 RPC is not connected!')
} else {
  console.log('Chain3 connected')
}

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
