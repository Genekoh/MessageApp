<template>
    <div class="grid place-items-center mt-16">
        <div class="flex flex-row">
            <div
                class="w-80 messages-height bg-laurelgreen overflow-y-scroll pl-6 pt-4 rounded-l-2xl"
            >
                <channel-list></channel-list>
            </div>
            <div
                class="messages-width messages-height bg-timberwolf overflow-y-scroll"
            >
                <message-history
                    v-if="$route.params.channel"
                    :channel-id="$route.params.channel"
                ></message-history>
                <div v-else class="flex flex-col items-center">
                    <h1 class="text-4xl font-semibold mt-8">
                        Welcome to the Messages Page
                    </h1>
                    <h1 class="text-2xl font-medium mt-8 text-center">
                        Click on any of the channel in the<br />
                        list of channels on the left side to start talking.
                    </h1>
                    <img
                        :src="require(`../assets/${randomPicture}`)"
                        alt="dog gifs"
                        class=" mt-14 w-80 "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { io } from "socket.io-client";
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
import ChannelList from "../components/ChannelList.vue";
import MessageHistory from "../components/MessageHistory.vue";

export default {
    components: { ChannelList, MessageHistory },
    setup() {
        const store = useStore();

        onBeforeMount(async () => {
            try {
                await store.dispatch("getUserChannels");

                const socket = io(process.env.VUE_APP_API_LINK);

                socket.on("new-message", ({ channelId, message }) => {
                    store.dispatch("addMessage", { channelId, message });
                });
            } catch (error) {
                console.log(error);
            }
        });

        const gifPics = [
            "excited-dog.gif",
            "excited-dog2.gif",
            "impatient-dog.gif",
        ];

        const randomIndex = Math.floor(Math.random() * gifPics.length);
        const randomPicture = gifPics[randomIndex];

        return { randomPicture };
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
