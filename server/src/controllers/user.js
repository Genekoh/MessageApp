exports.getUserInfo = (req, res, next) => {
    console.log(req.cookies);
    res.json({ username: req.params.username });
};
