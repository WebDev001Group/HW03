const db = require("../models");
const User = db.users;


let checkUsernameDuplicate = (req, res, next) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (user) {
            res.status(400).send({ message: "username is already taken!" });
            return;
        }
        next();
    });
};



let checkInvalidPassword = (req, res, next) => {
    if (req.body.password.length < 6) {
        res.status(400).send({ message: "the password must at least 6 characters" })
    }
    next();
};



const verifySignUp = {
    checkUsernameDuplicate,
    checkInvalidPassword
};

module.exports = verifySignUp;
