import { createRouter, createWebHistory } from "vue-router";

import store from "./stores";

const Home = () => import("./pages/Home.vue");
const LogIn = () => import("./pages/LogIn.vue");
const SignUp = () => import("./pages/SignUp.vue");
const Messages = () => import("./pages/Messages.vue");

const redirectIfNotAuth = () => {
    if (!store.getters.isAuthenticated) return { name: "HomeRoute" };
};
const redirectIfAuth = () => {
    if (store.getters.isAuthenticated) return { name: "MessagesRoute" };
};

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: { name: "HomeRoute" }
        },
        {
            path: "/home",
            name: "HomeRoute",
            component: Home,
            beforeEnter: redirectIfAuth
        },
        {
            path: "/login",
            name: "LoginRoute",
            component: LogIn,
            beforeEnter: redirectIfAuth
        },
        {
            path: "/signup",
            name: "SignupRoute",
            component: SignUp,
            beforeEnter: redirectIfAuth
        },
        {
            path: "/messages/:channel?",
            name: "MessagesRoute",
            component: Messages,
            beforeEnter: redirectIfNotAuth
        }
    ]
});

export default router;
