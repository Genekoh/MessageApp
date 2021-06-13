<template>
    <h1 class="font-medium">
        {{ currentChannelName }}
    </h1>
    <div class="flex flex-row items-center">
        <div class="bg-blush px-2 rounded-lg mr-4">
            <button
                class="focus:outline-none font-medium"
                @click="toggleAddMember"
            >
                Add Member
            </button>
        </div>

        <div>
            <button
                class="text-blush font-medium text-2xl"
                @click="leaveChannel"
            >
                Leave
            </button>
        </div>
    </div>
    <teleport to="body">
        <base-modal v-if="addMemberIsVisible" @close-modal="toggleAddMember">
            <add-member @member-added="toggleAddMember"></add-member>
        </base-modal>
    </teleport>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import AddMember from "./AddMember.vue";

export default {
    components: { AddMember },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const currentChannelName = computed(() => {
            if (!route.params.channel) return null;

            const c = store.getters.channels?.[route.params.channel];
            let cn = c?.name;
            if (cn > 18) {
                cn = cn.slice(0, 15) + "...";
            }
            return cn;
        });

        const addMemberIsVisible = ref(false);
        const toggleAddMember = () => {
            addMemberIsVisible.value = !addMemberIsVisible.value;
        };

        const leaveChannel = () => {
            store.dispatch("leaveChannel", route.params.channel);
            router.push({ name: "MessagesRoute" });
        };

        return {
            currentChannelName,
            toggleAddMember,
            addMemberIsVisible,
            leaveChannel,
        };
    },
};
</script>

<style></style>
