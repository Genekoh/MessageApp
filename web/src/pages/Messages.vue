<template>
    <button @click="logout">Logout</button>
    <div>
        <h1>MESSAGES</h1>
        <channel-list></channel-list>
        <message-history
            v-if="$route.params.channel"
            :channel-id="$route.params.channel"
        ></message-history>
        <h1 v-else>hi</h1>
    </div>
</template>

<script>
import { io } from "socket.io-client";
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ChannelList from "../components/ChannelList.vue";
import MessageHistory from "../components/MessageHistory.vue";

export default {
    components: { ChannelList, MessageHistory },
    setup() {
        const store = useStore();
        const router = useRouter();

        onBeforeMount(async () => {
            try {
                await store.dispatch("getUserChannels");

                const socket = io(process.env.VUE_APP_API_LINK);

                socket.on("new-message", ({ channelId, message }) => {
                    store.dispatch("addMessage", { channelId, message });
                });
            } catch (error) {
                console.log(error);
            }
        });

        const logout = async () => {
            try {
                await store.dispatch("logout");

                router.push({ name: "HomeRoute" });
            } catch (error) {
                console.log(error);
            }
        };

        return { logout };
    },
};
</script>

<style scoped></style>
