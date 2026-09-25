import './base.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

// Same paths as the copy in rootvexoulznet, so the labs' links between versions keep working.
const routes = [
  { path: '/', redirect: '/design/deepfield/v4' },
  { path: '/design', component: () => import('./design/DesignLab.vue') },
  { path: '/design/deepfield', component: () => import('./design/deepfield/DFLab.vue') },
  { path: '/design/deepfield/v2', component: () => import('./design/deepfield/DF2Lab.vue') },
  { path: '/design/deepfield/v3', component: () => import('./design/deepfield/DF3Lab.vue') },
  { path: '/design/deepfield/v4', component: () => import('./design/deepfield/DF4Lab.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

createApp(App)
  .use(createRouter({ history: createWebHistory(), routes }))
  .mount('#app')
