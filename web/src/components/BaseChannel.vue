<template>
    <div>
        <h1>{{ channelName }}</h1>
    </div>
</template>

<script>
export default {
    props: {
        channelName: {
            type: String,
            required: true
        }
        // lastMessage: {
        //     type: String,
        //     required: true
        // }
    }
};
</script>

<style scoped>
div {
    background-color: #eee;
}
</style>
