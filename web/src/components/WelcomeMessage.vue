<template>
    <h1 class="text-4xl font-semibold mt-8">
        Welcome to the Messages Page
    </h1>
    <h1 class="text-2xl font-medium mt-8 text-center">
        Click on any of the channel in the<br />
        list of channels on the left side to start talking.
    </h1>
    <img
        :src="require(`../assets/${randomPicture}`)"
        alt="dog gifs"
        class=" mt-14 w-80 "
    />
</template>

<script>
export default {
    setup() {
        const gifPics = [
            "excited-dog.gif",
            "excited-dog2.gif",
            "impatient-dog.gif",
        ];

        const randomIndex = Math.floor(Math.random() * gifPics.length);
        const randomPicture = gifPics[randomIndex];

        return { randomPicture };
    },
};
</script>

<style></style>
