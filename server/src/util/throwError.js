module.exports = (error, status) => {
    error.status = status;
    throw error;
};
