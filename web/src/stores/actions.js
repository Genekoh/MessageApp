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

            const { accessToken, id } = res.data;

            commit("setAccessToken", accessToken);
            commit("setUsername", username);
            commit("setUserId", id);

            return res.errorMessage || null;
        } catch (error) {
            console.dir(error);
            return error.response.data.errorMessage;
        }
    },
    async signup({ commit }, { username, password }) {
        try {
            const res = await axios.post(
                `${process.env.VUE_APP_API_LINK}/signup`,
                { username, password },
                { withCredentials: true },
            );

            const { accessToken, id } = res.data;

            commit("setAccessToken", accessToken);
            commit("setUsername", username);
            commit("setUserId", id);

            return res.errorMessage || null;
        } catch (error) {
            console.log(error);

            return error.response.data.errorMessage;
        }
    },
    async logout({ commit, getters }) {
        try {
            await axios.delete(`${process.env.VUE_APP_API_LINK}/logout`, {
                headers: {
                    Authorization: `Bearer ${getters.accessToken}`,
                },
            });

            const { socket } = getters;
            socket.disconnect();
            commit("setAccessToken", null);
            commit("setUsername", null);
            commit("setUserId", null);
            commit("setChannels", {});
            commit("setFriends", []);
            return null;
        } catch (error) {
            console.log(error);
            return error.response.data.errorMessage;
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

            const { accessToken, username, id } = res.data;
            commit("setAccessToken", accessToken);
            commit("setUsername", username);
            commit("setUserId", id);
            return res.errorMessage || null;
        } catch (error) {
            console.log("invalid refresh token");
            return error.response.data.errorMessage;
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
            return res.errorMessage || null;
        } catch (error) {
            console.log(error);
            return error.response.data.errorMessage;
        }
    },
    async getUserInfo({ commit, getters }) {
        try {
            const res = await axios.get(
                `${process.env.VUE_APP_API_LINK}/user-info`,
                {
                    headers: {
                        Authorization: `Bearer ${getters.accessToken}`,
                    },
                },
            );

            const { channels, username, id } = res.data;
            commit("setUsername", username);
            commit("setUserId", id);
            commit("setChannels", channels);
            return res.errorMessage || null;
        } catch (error) {
            console.log("invalid refresh token");
            return error.response.data.errorMessage;
        }
    },

    async sendMessage({ getters }, { channelId, text }) {
        let res;
        try {
            res = await axios.post(
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

            return res.errorMessage || null;
        } catch (error) {
            console.log(error);
            return error.response.data.errorMessage;
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
            const { friendList } = res.data;

            commit("setFriends", friendList);
            return res.errorMessage || null;
        } catch (error) {
            console.log(error);
            return error.response.data.errorMessage;
        }
    },
    setSocket({ commit }, socket) {
        commit("setSocket", socket);
    },
    async leaveChannel({ commit, getters }, channelId) {
        try {
            await axios.delete(
                `${process.env.VUE_APP_API_LINK}/channel-member-leave`,
                {
                    headers: { Authorization: `Bearer ${getters.accessToken}` },
                    data: {
                        channelId,
                        userId: getters.id,
                    },
                },
            );

            const { channels } = getters;
            delete channels[channelId];
            commit("setChannels", channels);
        } catch (error) {
            console.log(error);
            return error.response.data.errorMessage;
        }
    },
    setChannel({ commit }, { channelId, channel }) {
        commit("setChannel", { channelId, channel });
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
