import { createStore } from "vuex";

import mutations from "./mutations.js";
import getters from "./getters.js";
import actions from "./actions.js";

const store = createStore({
    state: {
        username: null,
        accessToken: null
    },
    mutations,
    getters,
    actions
});

export default store;
