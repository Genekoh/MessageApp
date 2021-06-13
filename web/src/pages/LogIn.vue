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
            <div v-if="isError">
                <h1 class="text-blush text-center font-medium mb-6 text-xl">
                    **Something went wrong, please try again ({{
                        errorMessage
                    }})**
                </h1>
            </div>
            <div class="grid place-items-center">
                <button
                    type="submit"
                    class="focus:outline-none font-medium text-ivory rounded-full bg-blush px-4 py-1"
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
        const isError = ref(false);
        const errorMessage = ref("invalid username and/or password");

        const login = async () => {
            if (!username.value || !password.value) {
                isError.value = true;
                return;
            }

            const returnedErrorMessage = await store.dispatch("login", {
                username: username.value,
                password: password.value,
            });

            if (returnedErrorMessage !== null) {
                isError.value = true;
                errorMessage.value = returnedErrorMessage;
                username.value = "";
                password.value = "";
                return console.log(returnedErrorMessage);
            }

            router.push({ name: "MessagesRoute" });
        };

        return { username, password, login, isError, errorMessage };
    },
};
</script>

<style></style>
