<template>
    <div
        class="fixed grid place-items-center overflow-auto h-full w-full inset-0 bg-black bg-opacity-30"
        @click="handleClick($event)"
    >
        <div class="bg-ivory rounded-lg modal-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    emits: ["closeModal"],
    setup(_, context) {
        const handleKeydown = e => {
            if (e.code === "Escape") {
                context.emit("closeModal");
                document.removeEventListener("keydown", handleKeydown);
            }
        };

        const handleClick = e => {
            if (!e.target.closest(".modal-content")) {
                context.emit("closeModal");
                document.removeEventListener("keydown", handleKeydown);
            }
        };

        document.addEventListener("keydown", handleKeydown);
        return { handleClick };
    },
};
</script>
