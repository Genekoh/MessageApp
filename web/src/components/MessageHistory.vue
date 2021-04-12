<template>
    <ul>
        <li v-for="message in messageHistory" :key="message.date">
            <base-message :message="message.message"></base-message>
        </li>
    </ul>
    <message-input></message-input>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import BaseMessage from "./BaseMessage.vue";
import MessageInput from "./MesssageInput.vue";

export default {
    components: { BaseMessage, MessageInput },
    props: {
        contact: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const store = useStore();

        const messageHistory = computed(
            () => store.getters.messages[props.contact]
        );

        return { messageHistory };
    }
};
</script>

<style></style>
