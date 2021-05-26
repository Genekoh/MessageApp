<template>
    <div class="flex justify-center items-center mt-48">
        <div>
            <h1 class="hero text-8xl center font-semibold">
                A Simple, <br />Minimalistic Messaging App.
            </h1>
            <div class="mt-8 text-3xl font-medium text-ivory">
                <router-link
                    :to="{ name: 'SignupRoute' }"
                    v-if="!isAuthenticated"
                    class="px-4 py-1 rounded-full bg-blush"
                    >Signup Now</router-link
                >
                <router-link
                    :to="{ name: 'MessagesRoute' }"
                    v-else
                    class="px-4 py-1 rounded-full bg-blush"
                    >To Messages</router-link
                >
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
    setup() {
        const store = useStore();

        const isAuthenticated = computed(() => store.getters.isAuthenticated);

        return { isAuthenticated };
    },
};
</script>

<style></style>
