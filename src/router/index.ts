import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ClientesView from '../views/ClientesView.vue'
import HabitacionesView from '../views/HabitacionesView.vue'
import ReservasView from '../views/ReservasView.vue'
import CalendarioReservasView from '../views/CalendarioReservasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/clientes', name: 'clientes', component: ClientesView },
    { path: '/habitaciones', name: 'habitaciones', component: HabitacionesView },
    { path: '/reservas', name: 'reservas', component: ReservasView },
    { path: '/calendario', name: 'calendario', component: CalendarioReservasView }
  ]
})


export default router
