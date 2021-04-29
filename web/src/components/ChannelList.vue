<template>
    <div>
        <base-channel
            v-for="channel in channels"
            :key="channel.id"
            :channel-name="channel.name"
            @click="changeContact(channel.channelId)"
        ></base-channel>
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import BaseChannel from "./BaseChannel.vue";

export default {
    components: { BaseChannel },
    computed: {
        channelS() {
            return this.$store.getters.channels;
        },
    },
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
