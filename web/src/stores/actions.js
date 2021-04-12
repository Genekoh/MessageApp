// let timer;

export default {
    auth(context, payload) {
        localStorage.setItem("username", "amyy_emii");
        localStorage.setItem("token", "123");

        context.dispatch("setUser", {
            token: payload.token,
            username: payload.username
            // userId: payload.userId
        });
    }
    // tryLogin(context) {
    //     context.
    // }
};
