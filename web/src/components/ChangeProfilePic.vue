<template>
    <div>
        <h1 class="text-4xl font-semibold text-center my-4">
            Change Your Profile Picture
        </h1>
        <form
            @submit.prevent="changeProfile"
            class="flex flex-col text-2xl font-medium mx-6 my-4"
        >
            <div
                class="flex flex-row justify-around mb-6 h-20 bg-timberwolf rounded-lg flex items-center"
            >
                <input
                    type="file"
                    id="profilePic"
                    name="profilePic"
                    @change="onChange"
                    class=" w-9/12  px-4 text-blush font-medium"
                />
            </div>
            <div class="grid place-items-center">
                <button
                    type="submit"
                    class="font-medium focus:outline-none text-ivory rounded-full bg-blush px-4 py-1"
                >
                    Change Profile Pic
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from "axios";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";

export default {
    emits: ["changedProfilepic"],
    setup(_props, context) {
        const store = useStore();
        const router = useRouter();

        const pictureFile = ref(null);

        const onChange = e => {
            const { files } = e.target;

            if (!files || !files[0]) return;

            pictureFile.value = files[0];
        };

        const changeProfile = async () => {
            try {
                if (!pictureFile.value) {
                    throw new Error("invalid file");
                }

                const formData = new FormData();
                formData.append("profilePic", pictureFile.value);
                const { id } = store.getters;

                await axios.post(
                    `${process.env.VUE_APP_API_LINK}/profile-pic/${id}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters.accessToken}`,
                            "Content-Type": "multipart/form-data",
                        },
                    },
                );

                await router.push({ name: "MessagesRoute" });
                context.emit("changedProfilepic");
            } catch (error) {
                console.log(error);
            }
        };

        return { changeProfile, onChange };
    },
};
</script>

<style></style>
