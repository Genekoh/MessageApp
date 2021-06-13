export default {
    channels(state) {
        return state.channels;
    },
    accessToken(state) {
        return state.accessToken;
    },
    isAuthenticated(state) {
        return !!state.accessToken;
    },
    username(state) {
        return state.username;
    },
    id(state) {
        return state.id;
    },
    friends(state) {
        return state.friends;
    },
    socket(state) {
        return state.socket;
    },
};
