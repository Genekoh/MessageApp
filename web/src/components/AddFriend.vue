<template>
    <h1 class="text-4xl font-semibold text-center my-4">Add A Friend</h1>
    <form
        @submit.prevent="addFriend"
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
                class="font-medium text-ivory rounded-full bg-blush px-4 py-1"
            >
                Submit
            </button>
        </div>
    </form>
</template>

<script>
import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        const friendUsername = ref("");

        const addFriend = async () => {
            try {
                await axios.post(
                    `${process.env.VUE_APP_API_LINK}/add-friend`,
                    {
                        username: store.getters.username,
                        friendUsername: friendUsername.value,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters.accessToken}`,
                        },
                    },
                );

                router.push({ name: "MessagesRoute" });
            } catch (error) {
                console.log(error);
            }
        };

        return { addFriend, friendUsername };
    },
};
</script>

<style></style>
