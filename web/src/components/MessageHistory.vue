<template>
    <ul>
        <li v-for="message in messageHistory" :key="message">
            <base-message :message="message.text"></base-message>
        </li>
    </ul>
    <message-input :channel-id="channelId"></message-input>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import BaseMessage from "./BaseMessage.vue";
import MessageInput from "./MesssageInput.vue";

export default {
    components: { BaseMessage, MessageInput },
    props: {
        channelId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const store = useStore();

        const messageHistory = computed(
            () => store.getters.channels[props.channelId].messages,
        );

        return { messageHistory };
    },
};
</script>

<style></style>
