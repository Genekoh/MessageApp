<template>
    <div
        class="max-w-5xl m-4 bg-timberwolf rounded-xl flex flex-col m-auto mt-40"
    >
        <h1 class="text-4xl font-semibold text-center my-4">Login</h1>
        <form
            @submit.prevent="login"
            class="flex flex-col text-2xl font-medium mx-6 my-4"
        >
            <div class="flex flex-row justify-around mb-6">
                <label for="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    class="rounded-lg w-9/12 bg-ivory px-4 text-gunmetal font-medium"
                    v-model="username"
                />
            </div>
            <div class="flex flex-row justify-around mb-6">
                <label for="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    class="rounded-lg w-9/12 bg-ivory px-4 text-blush font-medium"
                    v-model="password"
                />
            </div>
            <div class="grid place-items-center">
                <button
                    type="submit"
                    class="font-medium text-ivory rounded-full bg-blush px-4 py-1"
                >
                    Login
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
    setup() {
        const store = useStore();
        const router = useRouter();

        const username = ref("");
        const password = ref("");

        const login = async () => {
            const error = await store.dispatch("login", {
                username: username.value,
                password: password.value,
            });

            if (error !== null) {
                return console.log(error);
            }

            router.push({ name: "MessagesRoute" });
        };

        return { username, password, login };
    },
};
</script>

<style></style>
