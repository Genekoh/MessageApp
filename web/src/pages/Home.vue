<template>
    <router-link :to="{ name: 'LoginRoute' }">Login</router-link>
    <router-link :to="{ name: 'SignupRoute' }">Signup</router-link>
    WELCOME TO MSGAPP
</template>

<script>
export default {
    setup() {
        console.log("hi");
    }
};
</script>

<style></style>
