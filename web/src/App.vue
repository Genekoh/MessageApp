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

            const login = await axios.post(
                process.env.VUE_APP_API_LINK + "/login",
                {
                    username: "johnDOE",
                    password: "password123"
                },
                {
                    withCredentials: true
                }
            );

            const accessToken = login.data.accessToken;

            const messages = await axios.get(
                `${process.env.VUE_APP_API_LINK}/user-info`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            console.log(messages);

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
