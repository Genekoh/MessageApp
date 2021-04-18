export default {
    setUsername(state, payload) {
        state.username = payload;
    },
    addMessage(state, { channelId, message }) {
        state.channels[channelId].messages.append(message);
    },
    setMessage(state, { channelId, messages }) {
        state.channels[channelId].messages = messages;
    }
};
