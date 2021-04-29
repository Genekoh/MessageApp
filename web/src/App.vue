<template>
    <router-view></router-view>
</template>

<script>
import { computed, onBeforeMount } from "vue";
// import io from "socket.io-client";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        // const login = await axios.post(
        //     process.env.VUE_APP_API_LINK + "/login",
        //     {
        //         username: "johnDOE",
        //         password: "password123"
        //     },
        //     {
        //         withCredentials: true
        //     }
        // );
        // console.log(login);

        // const accessToken = login.data.accessToken;

        // const messages = await axios.get(
        //     `${process.env.VUE_APP_API_LINK}/user-info`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`
        //         }
        //     }
        // );
        // console.log(messages);

        const channels = computed(() => {
            return store.getters.channels;
        });

        onBeforeMount(async () => {
            try {
                await store.dispatch("tryRefreshToken");

                router.push({ name: "MessagesRoute" });
            } catch (error) {
                console.log(error);
            }
        });

        return { channels };
    },
};
</script>

<style>
li {
    list-style: none;
}
</style>
