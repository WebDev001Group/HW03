const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

function verifyJwtToken(req, res, next) {
    let authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send({
            message: "Unauthorized!"
        });
    }

    let token = authHeader.split(" ")[1];

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

