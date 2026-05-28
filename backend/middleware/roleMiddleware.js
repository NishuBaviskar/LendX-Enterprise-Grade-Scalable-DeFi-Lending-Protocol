const { auth } = require("../config/firebase");

const checkRole = (roles) => async(req, res, next) => {
    try {
        const token = req.headers.authorization ?.split(" ")[1];
        if (!token) return res.status(401).send("Unauthorized");

        const decodedToken = await auth.verifyIdToken(token);

        if (roles.includes(decodedToken.role)) {
            req.user = decodedToken;
            next();
        } else {
            res.status(403).send("Forbidden: Insufficient Permissions");
        }
    } catch (error) {
        res.status(401).send("Invalid Token");
    }
};

module.exports = { checkRole };