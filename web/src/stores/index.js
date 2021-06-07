import { createStore } from "vuex";

import mutations from "./mutations.js";
import getters from "./getters.js";
import actions from "./actions.js";

const store = createStore({
    state: {
        accessToken: null,
        username: null,
        id: null,
        channels: {},
        friends: [],
    },
    mutations,
    getters,
    actions,
});

export default store;
