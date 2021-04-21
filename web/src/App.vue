<template>
    <router-view></router-view>
</template>

<script>
// import io from "socket.io-client";
import axios from "axios";
import { useStore } from "vuex";
export default {
    async setup() {
        try {
            const store = useStore();

            const hi = await axios.post(
                `${process.env.VUE_APP_API_LINK}/login`,
                {
                    username: "johnDOE",
                    password: "password123"
                },
                {
                    withCredentials: true
                }
            );
            console.log(hi);

            const data = await axios.get(
                `${process.env.VUE_APP_API_LINK}/refresh-token`
            );
            console.log(data);

            store;
        } catch (error) {
            console.log(error);
        }
    }
};
</script>

<style>
li {
    list-style: none;
}
</style>
