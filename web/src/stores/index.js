import { createStore } from "vuex";

import mutations from "./mutations.js";
import getters from "./getters.js";
import actions from "./actions.js";

const store = createStore({
    state: {
        token: true,
        userId: null,
        contactList: [
            {
                name: "Gene",
                userName: "geneee",
                lastMessage: "hello world",
                lastMessageDate: new Date(2020, 11, 25)
            },
            {
                name: "Bob",
                userName: "bobbb",
                lastMessage: "bruh wyd",
                lastMessageDate: new Date(2018, 3, 12)
            }
        ],
        messages: {
            geneee: [
                {
                    date: new Date(2020, 11, 25, 12, 43, 2, 1),
                    message: "hi",
                    from: "you"
                },
                {
                    date: new Date(2020, 11, 25, 12, 44, 58, 32),
                    message: "hello",
                    from: "geneee"
                },
                {
                    date: new Date(2020, 11, 25, 12, 45, 21, 15),
                    message: "hello world",
                    from: "you"
                }
            ],
            bobbb: [
                {
                    date: new Date(2018, 3, 12, 23, 43, 13),
                    message: "bruh wyd",
                    from: "bob"
                }
            ]
        }
    },
    mutations,
    getters,
    actions
});

export default store;
