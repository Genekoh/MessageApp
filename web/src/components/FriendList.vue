<template>
    <ul>
        <li v-for="friend in friendList" :key="friend.username">
            <div>
                <img
                    :src="`${apiUrl}/static/${friend.pathToProfilePic}`"
                    :alt="`${friend.username}'s Profile Pic`"
                />
                <h1>{{ friend.userName }}</h1>
            </div>
        </li>
    </ul>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
    setup() {
        const store = useStore();

        const friendList = computed(() => store.getters.friends);
        const apiUrl = process.env.VUE_APP_API_LINK;
        console.log(friendList);

        return { friendList, apiUrl };
    },
};
</script>

<style></style>
