<template>
    <div>
        <h1>{{ name }}</h1>
        <h2>{{ userName }}</h2>
        <p>{{ lastMessage }}</p>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        lastMessage: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
div {
    background-color: #eee;
}
</style>
