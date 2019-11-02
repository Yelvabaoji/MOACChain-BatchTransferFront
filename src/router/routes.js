
import MyLayout from 'layouts/MyLayout.vue'
import SendMoac from 'pages/sendMoac.vue'
import SendErc20 from 'pages/sendErc20.vue'
import BatchTransferHelp from 'pages/help.vue'

const routes = [
  {
    path: '/',
    component: MyLayout,
    children: [
      { path: '/', component: SendMoac, name: 'sendMoac' },
      { path: 'sendMoac', component: SendMoac, name: 'sendMoac' },
      { path: 'sendErc20', component: SendErc20, name: 'sendErc20' },
      { path: 'batchTransferHelp', component: BatchTransferHelp, name: 'batchTransferHelp' }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
