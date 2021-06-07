<template>
    <div>
        <h1
            class="text-2xl text-center font-medium hover:underline"
            :class="{ underline: isActive }"
        >
            {{ formattedChannelName }}
        </h1>
    </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

export default {
    props: {
        channelName: {
            type: String,
            required: true,
        },
        id: {
            type: Number,
            require: true,
        },
    },
    setup(props) {
        const route = useRoute();
        const formattedChannelName = ref(props.channelName);
        if (props.channelName.length > 18) {
            formattedChannelName.value = props.channelName.slice(0, 15) + "...";
        }

        const isActive = computed(
            () => Number(route.params.channel) === props.id,
        );

        return { formattedChannelName, isActive };
    },
};
</script>
