export default {
    setAccessToken(state, payload) {
        state.accessToken = payload;
    },
    setUsername(state, payload) {
        state.username = payload;
    },
    setChannels(state, payload) {
        state.channels = payload;
    },
    addMessage(state, { channelId, message }) {
        state.channels[channelId].messages?.append(message);
    },
    setMessage(state, { channelId, messages }) {
        state.channels[channelId].messages = messages;
    }
};
