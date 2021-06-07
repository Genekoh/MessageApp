<template>
    <div>
        <form
            @submit.prevent="sendMessage"
            class="text-xl flex flex-row justify-evenly my-3"
        >
            <input
                type="text"
                v-model="message"
                class="rounded-lg w-9/12 bg-ivory px-4 text-blush font-medium"
            />
            <button
                type="submit"
                class=" font-medium text-ivory rounded-full bg-blush px-4 py-1"
            >
                Send
            </button>
        </form>
    </div>
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
