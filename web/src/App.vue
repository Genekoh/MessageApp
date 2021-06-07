<template>
    <nav-bar></nav-bar>
    <router-view class="h-full"></router-view>
</template>

<script>
import { computed, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import NavBar from "./components/NavBar.vue";
export default {
    components: {
        NavBar,
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const channels = computed(() => store.getters.channels);

        onBeforeMount(async () => {
            try {
                await store.dispatch("tryRefreshToken");

                const authRoutes = ["MessagesRoute", "FriendsRoute"];

                if (
                    !store.getters.isAuthenticated &&
                    authRoutes.some(r => route.name === r)
                ) {
                    return router.push({ name: "HomeRoute" });
                }
                router.push({ name: "MessagesRoute" });
            } catch (error) {
                console.log(error);
            }
        });

        return {
            channels,
        };
    },
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
    box-sizing: border-box;
}
</style>
