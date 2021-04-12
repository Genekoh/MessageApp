<template>
    <div>
        <base-contact
            v-for="contact in contactList"
            :key="contact.lastMessageDate"
            :name="contact.name"
            :userName="contact.userName"
            :lastMessage="contact.lastMessage"
            @click="changeContact(contact.userName)"
        ></base-contact>
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import BaseContact from "./BaseContact.vue";

export default {
    components: { BaseContact },
    setup() {
        const store = useStore();
        const router = useRouter();

        const contactList = computed(() => store.getters.contactList);

        const changeContact = userName => {
            router.push({
                name: "MessagesRoute",
                params: { contact: userName }
            });
        };

        return { contactList, changeContact };
    }
};
</script>

<style scoped></style>
