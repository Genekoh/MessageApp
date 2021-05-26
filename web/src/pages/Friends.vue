<template>
    <friend-list> </friend-list>
</template>

<script>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
import FriendList from "../components/FriendList.vue";

export default {
    components: { FriendList },
    setup() {
        const store = useStore();

        onBeforeMount(async () => {
            const error = await store.dispatch("fetchFriendList");
            if (error !== null) {
                return console.log(error);
            }
        });
    },
};
</script>

<style></style>
