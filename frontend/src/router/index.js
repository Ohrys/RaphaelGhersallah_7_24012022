import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Erreur from '../views/Error.vue'
import Login from '../views/Login.vue'
import Profil from '../views/Profil.vue'
import Publication from '../views/Publication.vue'
import EditPublication from '../views/EditPublication.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/login',
    name:'Login',
    component: Login
  },
  {
    path:'/register',
    name:'Register',
    component: Register
  },
  {
    path: '/my-profil',
    name: 'Profil',
    component: Profil,
    props:true
  },
  {
    path:'/publication/:idPublication',
    name:'Publication',
    component: Publication
  },
  {
    path:'/publication/:idPublication/edit',
    name:'EditPublication',
    component: EditPublication
  },
  {
    path: '/:catchAll(.*)*',
    Name:'Erreur',
    component: Erreur
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
