<template>
    <div>
        <nav class="flex flex-row justify-between items-center mx-8 mt-4 h-4/6">
            <div class="flex flex-row items-center" @click="logoRedirect">
                <svg
                    width="51"
                    height="51"
                    viewBox="0 0 51 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M48.235 25.5C48.235 38.0562 38.0562 48.235 25.5 48.235C12.9438 48.235 2.765 38.0562 2.765 25.5C2.765 12.9438 12.9438 2.765 25.5 2.765C38.0562 2.765 48.235 12.9438 48.235 25.5Z"
                        stroke="#E75A7C"
                        stroke-width="5.53"
                    />
                </svg>
                <h2 class="text-3xl font-bold ml-1">MsgApp</h2>
            </div>
            <ul class="flex flex-row text-2xl font-medium ">
                <div v-if="homeCondition" class="ml-8">
                    <li>
                        <router-link
                            :to="{ name: 'HomeRoute' }"
                            class="hover:text-blush"
                            >Home</router-link
                        >
                    </li>
                </div>
                <div v-if="loginCondition" class="ml-8">
                    <li>
                        <router-link
                            :to="{ name: 'LoginRoute' }"
                            class="hover:text-blush"
                            >Login</router-link
                        >
                    </li>
                </div>
                <div v-if="signupCondition" class="ml-8">
                    <li>
                        <router-link
                            :to="{ name: 'SignupRoute' }"
                            class="text-ivory rounded-full bg-blush px-3 py-1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            hover:bg-gunmetal"
                            >Signup</router-link
                        >
                    </li>
                </div>
                <div v-if="messagesCondition" class="ml-8">
                    <li>
                        <router-link
                            :to="{ name: 'MessagesRoute' }"
                            class="hover:text-blush"
                            >Messages</router-link
                        >
                    </li>
                </div>
                <div v-if="addFriendCondition" class="ml-8">
                    <li>
                        <button
                            @click="toggleAddFriend"
                            class="font-medium hover:text-blush"
                        >
                            Add Friend
                        </button>
                    </li>
                </div>
                <div v-if="friendCondition" class="ml-8">
                    <li>
                        <router-link
                            :to="{ name: 'FriendsRoute' }"
                            class="hover:text-blush"
                            >Friend List</router-link
                        >
                    </li>
                </div>
                <div v-if="logoutCondition" class="ml-8">
                    <li>
                        <button
                            @click="logout"
                            class="font-medium hover:text-blush"
                        >
                            Logout
                        </button>
                    </li>
                </div>
            </ul>
        </nav>
        <teleport to="body" dropzone="">
            <base-modal
                v-if="addFriendIsVisible"
                @close-modal="toggleAddFriend"
            >
                <add-friend> </add-friend>
            </base-modal>
        </teleport>
    </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import AddFriend from "./AddFriend.vue";

export default {
    components: { AddFriend },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const logoRedirect = () => {
            if (store.getters.isAuthenticated) {
                return router.push({ name: "MessagesRoute" });
            }
            router.push({ name: "HomeRoute" });
        };

        const homeCondition = computed(() => {
            if (route.name === "HomeRoute") {
                return false;
            }
            return true;
        });
        const loginCondition = computed(() => {
            if (route.name === "LoginRoute" || store.getters.isAuthenticated) {
                return false;
            }
            return true;
        });

        const signupCondition = computed(() => {
            if (route.name === "SignupRoute" || store.getters.isAuthenticated) {
                return false;
            }
            return true;
        });

        const messagesCondition = computed(() => {
            if (
                route.name === "MessagesRoute" ||
                !store.getters.isAuthenticated
            ) {
                return false;
            }

            return true;
        });

        const addFriendCondition = computed(
            () => store.getters.isAuthenticated,
        );

        const friendCondition = computed(() => {
            if (
                route.name === "FriendsRoute" ||
                !store.getters.isAuthenticated
            ) {
                return false;
            }

            return true;
        });

        const logoutCondition = computed(() => store.getters.isAuthenticated);

        const logout = async () => {
            const error = await store.dispatch("logout");
            if (error !== null) {
                return console.log("error loggin out");
            }

            router.push({ name: "HomeRoute" });
        };

        const addFriendIsVisible = ref(false);

        const toggleAddFriend = () => {
            addFriendIsVisible.value = !addFriendIsVisible.value;
        };

        return {
            logoRedirect,
            homeCondition,
            loginCondition,
            signupCondition,
            addFriendCondition,
            logoutCondition,
            logout,
            messagesCondition,
            addFriendIsVisible,
            friendCondition,
            toggleAddFriend,
        };
    },
};
</script>

<style></style>
