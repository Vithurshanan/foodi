const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if (!req.headers.authorization) {
        console.error('No authorization header found');
        return res.status(401).send({ message: "Unauthorized access to MongoDB" });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).send({ message: "Token is invalid!" });
        }
        req.decoded = decoded;
        next();
    });
};

module.exports = verifyToken;
