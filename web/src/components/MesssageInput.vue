<template>
    <form @submit.prevent="submitMessage">
        <input type="text" v-model="message" />
        <button type="submit">Send</button>
    </form>
</template>

<script>
import { ref } from "vue";
export default {
    emits: ["messageSend"],
    setup(props, context) {
        const message = ref("");
        const submitMessage = () => context.emit("messageSend", message.value);

        return { message, submitMessage };
    }
};
</script>

<style></style>
