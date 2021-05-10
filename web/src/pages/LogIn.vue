<template>
    <router-link :to="{ name: 'HomeRoute' }">HOME</router-link>
    <h1>LogIn</h1>
    <form @submit.prevent="login">
        <div>
            <label for="username">Username</label>
            <input
                type="text"
                name="username"
                id="username"
                v-model="username"
            />
        </div>
        <div>
            <label for="password">Password</label>
            <input
                type="text"
                name="password"
                id="password"
                v-model="password"
            />
        </div>
        <button type="submit">Login</button>
    </form>
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
                console.log(error);
                return;
            }

            router.push({ name: "MessagesRoute" });
        };

        return { username, password, login };
    },
};
</script>

<style></style>
