<template>
    <div>
        <h1 class="text-4xl font-semibold text-center my-4">
            Add Member To Channel
        </h1>
        <form
            @submit.prevent="addMember"
            class="flex flex-col text-2xl font-medium mx-6 my-4"
        >
            <div class="flex flex-row justify-around mb-6">
                <label for="username" class="mr-8">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    class="rounded-lg w-9/12 bg-timberwolf px-4 text-blush font-medium"
                    v-model="friendUsername"
                />
            </div>
            <div class="grid place-items-center">
                <button
                    type="submit"
                    class="font-medium focus:outline-none text-ivory rounded-full bg-blush px-4 py-1"
                >
                    Add Member
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

export default {
    emits: ["member-added"],
    setup(_props, context) {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();

        const friendUsername = ref("");

        const addMember = async () => {
            try {
                const channelId = route.params.channel;

                await axios.post(
                    `${process.env.VUE_APP_API_LINK}/add-channel-member`,
                    {
                        channelId,
                        friendUsername: friendUsername.value,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters.accessToken}`,
                        },
                    },
                );

                await router.push({ name: "MessagesRoute" });
                context.emit("member-added");
            } catch (error) {
                console.log(error);
            }
        };

        return { addMember, friendUsername };
    },
};
</script>

<style></style>
