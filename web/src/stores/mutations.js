export default {
    setAccessToken(state, payload) {
        state.accessToken = payload;
    },
    setUsername(state, payload) {
        state.username = payload;
    },
    setUserId(state, payload) {
        state.id = payload;
    },
    setChannels(state, payload) {
        state.channels = payload;
    },
    addMessage(state, { channelId, message }) {
        state.channels[channelId].messages.push(message);
    },
    setMessage(state, { channelId, messages }) {
        state.channels[channelId].messages = messages;
    },
    setFriends(state, friends) {
        state.friends = friends;
    },
    addFriends(state, friend) {
        state.friends.push(friend);
    },
};
