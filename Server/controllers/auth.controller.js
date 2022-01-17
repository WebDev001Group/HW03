const db = require("../models");
const config = require("../config/auth.config");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const User = db.users;
const RefreshToken = db.refreshTokens;

function signUp(req, res) {
    User.Create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        role: "User"
    })
        .then(user => {
            res.status(201).send({ message: "the user was created" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}


function signIn(req, res) {

    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "Invalid Username or Password" });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Username or Password!"
            });
        }

        const payload = { uid: user.userId, role: user.role, jti: uuidv4() }
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.jwtExpiration
        })

        const refresh = await RefreshToken.createToken(user, payload.jti);

        res.status(200).send({
            message: "login successfully!",
            accessToken: token,
            refreshToken: refresh
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

}





