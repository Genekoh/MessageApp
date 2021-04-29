<template>
    <button>Logout</button>
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
import { onBeforeMount } from "vue";
import ChannelList from "../components/ChannelList.vue";
import MessageHistory from "../components/MessageHistory.vue";
import { useStore } from "vuex";

export default {
    components: { ChannelList, MessageHistory },
    setup() {
        const store = useStore();

        onBeforeMount(async () => {
            try {
                await store.dispatch("getUserChannels");
            } catch (error) {
                console.log(error);
            }
        });
    },
};
</script>

<style scoped></style>
