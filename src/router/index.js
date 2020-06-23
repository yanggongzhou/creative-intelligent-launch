import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: ()=>import ('@/components/login'),
    },
    {
      path: '/home',
      name: 'home',
      component: ()=>import ('@/components/common/home'),
      meta:{requiresAuth:true},
      children:[
        {
          path: '/creative/list',
          name: 'creative-list',
          component: ()=>import ('@/components/creative/creative-list'),
        },
        {
          path: '/creative/edit',
          name: 'creative-edit',
          component: ()=>import ('@/components/creative/creative-edit'),
        },
        {
          path: '/preview',
          name: 'preview',
          component: ()=>import ('@/components/preview/preview'),
        },
      ]
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   next()
//   if(to.path === '/login') {
//     window.sessionStorage.clear()
//     next()
//   }else {
//     let user_id = window.sessionStorage.getItem("user_profile");
//     if (to.matched.some(record => record.meta.requiresAuth)) {
//       if (!user_id) {
//         next({
//           path: '/login',
//           query: { redirect: to.fullPath }
//         })
//       }else {
//         next()
//       }
//     } else {
//       next()
//     }
//   }
// });
export default router;
