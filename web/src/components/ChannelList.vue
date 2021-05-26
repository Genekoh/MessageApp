<template>
    <base-channel
        v-for="channel in channels"
        :key="channel.channelId"
        :id="channel.channelId"
        :channel-name="channel.name"
        @click="changeContact(channel.channelId)"
    ></base-channel>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import BaseChannel from "./BaseChannel.vue";

export default {
    components: { BaseChannel },
    setup() {
        const store = useStore();
        const router = useRouter();

        const channels = computed(() => store.getters.channels);
        const changeContact = username => {
            router.push({
                name: "MessagesRoute",
                params: { channel: username },
            });
        };

        return { channels, changeContact };
    },
};
</script>

<style scoped></style>
