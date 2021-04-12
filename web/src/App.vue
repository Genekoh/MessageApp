<template>
    <router-view></router-view>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";
// import { useStore } from "vuex";
export default {
    async setup() {
        // const store = useStore();
        const socket = io("ws://localhost:3000");
        socket.onmessage = ({ data }) => {
            console.log("message from server", data);
        };
        const { data: userData } = await axios.get(
            "http://localhost:3000/setup"
        );
        console.log(userData);
    }
};
</script>

<style>
li {
    list-style: none;
}
</style>
