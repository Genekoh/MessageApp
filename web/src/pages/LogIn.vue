<template>
    <router-link :to="{ name: 'HomeRoute' }">HOME</router-link>
    <form @submit.prevent="login">
        <div>
            <label for="email">Email</label>
            <input type="text" name="email" id="email" v-model="email" />
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
        <h1>{{ email + password }}</h1>
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

        const email = ref("");
        const password = ref("");

        const login = async () => {
            await store.dispatch("login", {
                username: email.value,
                password: password.value,
            });

            router.push({ name: "MessagesRoute" });
        };

        return { email, password, login };
    },
};
</script>

<style></style>
