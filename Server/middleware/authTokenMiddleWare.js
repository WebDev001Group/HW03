const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

function verifyJwtToken(req, res, next) {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "Unauthorized!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.uid;
        req.role = decoded.role;
        next();
    });

}


module.exports = {
    verifyJwtToken
}

