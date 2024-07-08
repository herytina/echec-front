// router/index.js

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: () => import('@/Pages/Login.vue')
    },
    {
      path: '/listOfParty',
      name: 'ListPartyChess',
      component: () => import('@/Pages/ListPartyPage.vue')
    },
    {
      path: '/party',
      name: 'PartyChess',
      component: () => import('@/Pages/GoToPartyPage.vue')
    },
    {
      path: '/waitPlayer',
      name: 'waitPlayer',
      component: () => import('@/Pages/waitForPlayer.vue')
    }
  ]
});

export default router;
