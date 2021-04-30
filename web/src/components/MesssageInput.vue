<template>
    <form @submit.prevent="sendMessage">
        <input type="text" v-model="message" />
        <button type="submit">Send</button>
    </form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
export default {
    props: {
        channelId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const store = useStore();
        const message = ref("");

        const sendMessage = () => {
            if (message.value.trim() === "") return;

            store.dispatch("sendMessage", {
                channelId: props.channelId,
                text: message.value,
            });

            message.value = "";
        };

        return { message, sendMessage };
    },
};
</script>

<style></style>
