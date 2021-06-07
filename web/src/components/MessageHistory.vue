<template>
    <div>
        <ul>
            <div
                v-for="[index, messageGroup] in Object.entries(messageHistory)"
                :key="index"
                :class="{
                    'text-right': messageGroup[0]?.UserId === userId,
                    'text-left': messageGroup[0]?.UserId !== userId,
                }"
                class="mx-4 my-4"
            >
                <h1 class="text-blush font-medium text-base mt-2">
                    {{ messageGroup[0].User.userName }}
                </h1>
                <li
                    v-for="[i, message] in Object.entries(messageGroup)"
                    :key="i"
                    class="font-regular text-xl"
                >
                    <h2>
                        {{ message.text }}
                    </h2>
                </li>
            </div>
        </ul>
    </div>
</template>

<script>
import { computed } from "vue";
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

        const messageHistory = computed(() => {
            const messages = store.getters.channels[props.channelId].messages;
            const groupedMessages = [];
            messages.forEach((message, i, arr) => {
                if (i === 0 || arr[i - 1].UserId !== message.UserId) {
                    groupedMessages.push([message]);
                } else {
                    groupedMessages[groupedMessages.length - 1].push(message);
                }
            });
            console.log(groupedMessages);
            return groupedMessages;
        });

        const userId = computed(() => store.getters.id);
        console.log(userId.value);
        return { messageHistory, userId };
    },
};
</script>

<style></style>
