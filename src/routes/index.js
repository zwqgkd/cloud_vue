import {createRouter, createWebHistory,} from "vue-router";
// import Register from "@/views/Register.vue";
// import UserManage from "@/views/UserManage.vue";

/**
 * @brief 路由配置文件
 * */
const router = createRouter({
    // 路由工作模式
    history: createWebHistory(),
    // history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "login",
            component: import("@/views/login/Login.vue")
        },
        {
            path: "/index",
            name: "Index",
            component: import("@/views/index/Index.vue"),
            children: [
                {
                    path: "/operator-manage",
                    component: import("@/components/OperatorManage.vue")
                },
                {
                    path: "/scheme-manage",
                    component: import("@/views/scheme/SchemeManage.vue")
                },
                {
                    path: "/role-manage",
                    component: import("@/views/role/RoleManage.vue")
                },
                {
                    path: "/user-manage",
                    component: import("@/views/user/UserManage.vue")
                },
                {
                    path: "/license-manage",
                    component: import("@/components/LicenseManage.vue")
                }

            ]
            // meta: { requireAuth: true },
        },


        // {
        //   path: "/Login",
        //   name: "Login",
        //   component: Login,
        //   meta: { requireAuth: true },
        // },
    ],
});

/**
 * @brief 判断用户是否登录
 * */
// const isAuthenticated = () => {
//   console.log(sessionStorage.getItem("userInfo"));
//
//   return sessionStorage.getItem("userInfo") !== null;
// };
//
// index.beforeEach((to, from, next) => {
//   if (to.matched.some((record) => record.meta.requireAuth)) {
//     if (!isAuthenticated()) {
//       next({
//         path: "/",
//         query: { redirect: to.fullPath },
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

export default router;
