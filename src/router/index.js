import { createRouter, createWebHistory } from 'vue-router';
import AdminView from '../views/AdminView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'


const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView,  
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView,  
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminView,  
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})
  
export default router
  