<template>
    <h1 class="text-4xl font-semibold text-center my-4">
        Create A Channel
    </h1>
    <form
        @submit.prevent="addFriend"
        class="flex flex-col text-2xl font-medium mx-6 my-4"
    >
        <div class="flex flex-row justify-around mb-6">
            <label for="channelName" class="mr-8">Name</label>
            <input
                type="text"
                id="channelName"
                name="channelName"
                class="rounded-lg w-9/12 bg-timberwolf px-4 text-blush font-medium"
                v-model="channelName"
            />
        </div>
        <div class="flex flex-row justify-around mb-6">
            <label for="members" class="mr-8">Members</label>
            <input
                type="text"
                id="members"
                name="members"
                class="rounded-lg w-9/12 bg-timberwolf px-4 text-blush font-medium"
                v-model="members"
            />
        </div>
        <div class="grid place-items-center">
            <button
                type="submit"
                class="font-medium focus:outline-none text-ivory rounded-full bg-blush px-4 py-1"
            >
                Create Channel
            </button>
        </div>
    </form>
</template>

<script>
import axios from "axios";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
    emits: ["channel-created"],
    setup(_props, context) {
        const store = useStore();
        const router = useRouter();

        const channelName = ref("");
        const members = ref("");

        const friends = computed(() => store.getters.friends);

        const addFriend = async () => {
            try {
                const membersArray = members.value
                    .trim()
                    .split(",")
                    .filter(v => v !== "");
                membersArray.push(store.getters.username);
                console.log(membersArray);
                const res = await axios.post(
                    `${process.env.VUE_APP_API_LINK}/create-channel`,
                    {
                        type: "group",
                        name: channelName.value,
                        members: membersArray,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters.accessToken}`,
                        },
                    },
                );

                const { channel } = res.data;
                store.dispatch("setChannel", {
                    channelId: channel.id,
                    channel,
                });
                store.dispatch("getUserChannels");
                await router.push({ name: "MessagesRoute" });
                context.emit("channel-created");
            } catch (error) {
                console.log(error);
            }
        };

        return { addFriend, channelName, friends, members };
    },
};
</script>

<style></style>
