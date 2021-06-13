<template>
    <div class="bg-timberwolf rounded-2xl p-8">
        <h1 class="text-3xl font-medium text-center mb-4">Friends</h1>
        <ul>
            <li v-for="friend in friendList" :key="friend.username">
                <div class="flex justify-evenly items-center my-5 :after">
                    <img
                        :src="`${apiUrl}/static/${friend.pathToProfilePic}`"
                        :alt="`${friend.username}'s Profile Pic`"
                        class="rounded-full w-12 h-12"
                    />
                    <p class="text-xl font-medium">
                        {{ friend.userName }}
                    </p>
                    <button @click="openOrCreateDm(friend.userName)">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="ionicon w-8"
                            viewBox="0 0 512 512"
                        >
                            <title>Mail</title>
                            <rect
                                x="48"
                                y="96"
                                width="416"
                                height="320"
                                rx="40"
                                ry="40"
                                fill="#E75A7C"
                                stroke="#2C363F"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                            />
                            <path
                                fill="none"
                                stroke="#2C363F"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                                d="M112 160l144 112 144-112"
                            />
                        </svg>
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { useRouter } from "vue-router";

export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        const friendList = computed(() => store.getters.friends);
        const apiUrl = process.env.VUE_APP_API_LINK;
        const channels = computed(() => Object.values(store.getters.channels));

        const openOrCreateDm = async friendUsername => {
            console.log(friendUsername);
            let channel = channels.value.find(
                c => c.name === friendUsername && c.type === "dm",
            );

            if (!channel) {
                await axios.post(
                    `${process.env.VUE_APP_API_LINK}/create-dm`,
                    {
                        username: store.getters.username,
                        friendUsername,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters.accessToken}`,
                        },
                    },
                );
                await store.dispatch("getUserChannels");
                channel = channels.value.find(
                    c => c.name === friendUsername && c.type === "dm",
                );
            }
            console.log(store.getters.channels);
            router.push({
                name: "MessagesRoute",
                params: { channel: channel.channelId },
            });
        };

        return { friendList, apiUrl, openOrCreateDm };
    },
};
</script>

<style></style>
