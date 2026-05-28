const { auth } = require("../config/firebase");

const verifyToken = async(req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const idToken = header.split("Bearer ")[1];
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying Firebase token:", error);
        return res.status(403).json({ error: "Unauthorized access" });
    }
};

module.exports = { verifyToken };