const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.log("Error: ", err);
        res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
    });
};

export default asyncHandler;
