<template>
    <h1>MESSAGES</h1>
    <contact-list></contact-list>
    <message-history
        v-if="$route.params.contact"
        :contact="$route.params.contact"
    ></message-history>
    <h1 v-else>hi</h1>
</template>

<script>
import ContactList from "../components/ContactList.vue";
import MessageHistory from "../components/MessageHistory.vue";

export default {
    components: { ContactList, MessageHistory },
    setup() {}
};
</script>

<style scoped></style>
