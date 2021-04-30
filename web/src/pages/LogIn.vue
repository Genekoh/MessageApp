<template>
    <router-link :to="{ name: 'HomeRoute' }">HOME</router-link>
    <form @submit.prevent="login">
        <div>
            <label for="text">Username</label>
            <input type="text" name="text" id="text" v-model="username" />
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
            await store.dispatch("login", {
                username: username.value,
                password: password.value,
            });

            router.push({ name: "MessagesRoute" });
        };

        return { username, password, login };
    },
};
</script>

<style></style>
