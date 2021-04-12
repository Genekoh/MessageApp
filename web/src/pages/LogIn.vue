<template>
    <router-link :to="{ name: 'HomeRoute' }">HOME</router-link>
    <form @submit.prevent="login">
        <div>
            <label for="email">Email</label>
            <input type="email" name="email" id="email" />
        </div>
        <div>
            <label for="password">Password</label>
            <input type="text" name="password" id="password" />
        </div>
    </form>
</template>

<script>
// import { useStore } from "vuex";
// export default {
//     setup() {
//         const store = useStore();
//     }
// };
</script>

<style></style>
