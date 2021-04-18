export default {
    contactList(state) {
        return state.contactList;
    },

    messages(state) {
        return state.messages;
    },

    isAuthenticated(state) {
        return !!state.accessToken;
    }
};
