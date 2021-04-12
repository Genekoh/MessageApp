export default {
    setUser(state, payload) {
        state.user = payload;
    },
    addMessage(state, { contact, message }) {
        state.messages[contact]?.append(message);
    },
    setMessage(state, { contact, message }) {
        state.messages[contact] = message;
    },
    setContactList(state, payload) {
        state.contactList = payload;
    }
};
