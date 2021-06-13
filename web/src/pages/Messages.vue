<template>
    <div class="flex flex-row justify-evenly mt-16">
        <div class="flex flex-row">
            <div
                class="w-80 messages-height bg-laurelgreen overflow-y-scroll pt-4  rounded-l-2xl"
            >
                <channel-list></channel-list>
            </div>
            <div
                class="messages-width messages-height bg-timberwolf rounded-r-2xl overflow-hidden"
            >
                <div
                    v-if="$route.params.channel"
                    class="h-full w-full flex flex-col justify-between items-center"
                >
                    <div
                        class="flex flex-row w-full py-3 px-6 bg-gunmetal justify-between items-center text-ivory text-2xl"
                    >
                        <channel-header></channel-header>
                    </div>
                    <message-history
                        class="overflow-y-scroll flex-grow w-full"
                        :channel-id="$route.params.channel"
                    ></message-history>
                    <message-input
                        :channel-id="$route.params.channel"
                        class="w-full"
                    ></message-input>
                </div>
                <div v-else class="flex flex-col items-center">
                    <welcome-message></welcome-message>
                </div>
            </div>
        </div>
        <div class="grid place-items-center">
            <friend-list class="w-80 messages-height overflow-y-scroll">
            </friend-list>
        </div>
    </div>
</template>

<script>
import { io } from "socket.io-client";
import { onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import ChannelList from "../components/ChannelList.vue";
import FriendList from "../components/FriendList.vue";
import MessageHistory from "../components/MessageHistory.vue";
import MessageInput from "../components/MessageInput.vue";
import ChannelHeader from "../components/ChannelHeader.vue";
import WelcomeMessage from "../components/WelcomeMessage.vue";

export default {
    components: {
        ChannelList,
        MessageHistory,
        MessageInput,
        FriendList,
        ChannelHeader,
        WelcomeMessage,
    },
    setup() {
        const store = useStore();

        onBeforeMount(async () => {
            try {
                await store.dispatch("getUserChannels");

                const error = await store.dispatch("fetchFriendList");
                if (error !== null) {
                    return console.log(error);
                }
            } catch (error) {
                console.log(error);
            }
        });

        onMounted(() => {
            store.dispatch("setSocket", io(process.env.VUE_APP_API_LINK));
            const { socket } = store.getters;

            socket.on("new-message", message => {
                store.dispatch("addMessage", message);
            });
        });
    },
};
</script>

<style scoped>
.messages-height {
    height: 44rem;
}
.messages-width {
    width: 52rem;
}
</style>
