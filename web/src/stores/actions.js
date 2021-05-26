import "axios";
import axios from "axios";

export default {
    async login({ commit }, { username, password }) {
        try {
            const res = await axios.post(
                `${process.env.VUE_APP_API_LINK}/login`,
                {
                    username,
                    password,
                },
                { withCredentials: true },
            );

            const { accessToken } = res.data;

            commit("setAccessToken", accessToken);
            commit("setUsername", username);
            return null;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    },
    async signup({ commit }, { username, password }) {
        try {
            const res = await axios.post(
                `${process.env.VUE_APP_API_LINK}/signup`,
                { username, password },
                { withCredentials: true },
            );

            const { accessToken } = res.data;

            commit("setAccessToken", accessToken);
            commit("setUsername", username);

            return null;
        } catch (error) {
            console.log(error);

            return error;
        }
    },
    async logout({ commit, getters }) {
        try {
            await axios.delete(`${process.env.VUE_APP_API_LINK}/logout`, {
                headers: {
                    Authorization: `Bearer ${getters.accessToken}`,
                },
            });

            commit("setAccessToken", null);
            commit("setUsername", null);
            commit("setChannels", {});
            commit("setFriends", []);
            return null;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    },
    async tryRefreshToken({ commit }) {
        try {
            const res = await axios.get(
                `${process.env.VUE_APP_API_LINK}/refresh-token`,
                {
                    withCredentials: true,
                },
            );

            const { accessToken, username } = res.data;
            commit("setAccessToken", accessToken);
            commit("setUsername", username);
            return null;
        } catch (error) {
            console.log("invalid refresh token");
            return error.message;
        }
    },
    async getUserChannels({ commit, getters }) {
        try {
            const res = await axios.get(
                `${process.env.VUE_APP_API_LINK}/user-info`,
                {
                    headers: {
                        Authorization: `Bearer ${getters.accessToken}`,
                    },
                },
            );

            commit("setChannels", res.data.channels);
            return null;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    },

    async sendMessage({ getters }, { channelId, text }) {
        try {
            await axios.post(
                `${process.env.VUE_APP_API_LINK}/message`,
                {
                    channelId,
                    text,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getters.accessToken}`,
                    },
                },
            );

            return null;
        } catch (error) {
            console.log(error);
            return error.message;
        }
    },

    addMessage({ commit, getters }, { channelId, message }) {
        if (!getters.channels[channelId]) {
            throw new Error("channel not found");
        }

        commit("addMessage", { channelId, message });
    },
    async fetchFriendList({ commit, getters }) {
        try {
            const res = await axios.get(
                `${process.env.VUE_APP_API_LINK}/friend-list`,
                {
                    headers: { Authorization: `Bearer ${getters.accessToken}` },
                },
            );
            console.log(res);
            const { friendList } = res.data;

            commit("setFriends", friendList);
            return null;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
};

/*
const friend = await axios.post(
                    process.env.VUE_APP_API_LINK + "/add-friend",
                    {
                        friendUsername: "JANEdoe"
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${store.getters.accessToken}`
                        },
                        withCredentials: true
                    }
                );
*/
