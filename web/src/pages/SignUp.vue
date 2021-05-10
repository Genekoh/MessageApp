<template>
    <router-link :to="{ name: 'HomeRoute' }">HOME</router-link>
    <h1>SIGNUP</h1>
    <form @submit.prevent="signup">
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
        <button type="submit">Signup</button>
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

        const signup = async () => {
            try {
                const error = await store.dispatch("signup", {
                    username,
                    password,
                });

                if (error !== null) {
                    return console.log("hi");
                }
                router.push({ name: "MessagesRoute" });
            } catch (error) {
                console.log(error.message);
            }
        };

        return { username, password, signup };
    },
};
</script>

<style></style>
