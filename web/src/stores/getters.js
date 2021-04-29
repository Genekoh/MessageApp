export default {
    channels(state) {
        return state.channels;
    },
    accessToken(state) {
        return state.accessToken;
    },
    isAuthenticated(state) {
        return !!state.accessToken;
    }
};
