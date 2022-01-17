const db = require("../models");
const config = require("../config/auth.config");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const { users: User, refreshTokens: RefreshToken } = db;

function signUp(req, res) {
    User.create({
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
    }).then(async (user) => {
        if (!user) {
            return res.status(404).send({ message: "Invalid Username or Password" });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(404).send({
                message: "Invalid Username or Password!"
            });
        }

        const payload = { uid: user.id, role: user.role, jti: uuidv4() }
        const token = jwt.sign(payload, config.secret, {
            expiresIn: config.jwtExpiration
        })
        let refresh = await RefreshToken.createToken(user.userId, payload.jti)

        res.status(200).send({
            message: "login successfully!",
            accessToken: token,
            refreshToken: refresh
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

}


async function refresh(req, res) {
    const accessToken = req.body.accessToken;
    const refreshToken = req.body.refreshToken;

    if (!accessToken || !refreshToken) {
        return res.status(400).send({ message: "access and refresh token must not empty!" });
    }

    try {
        let refresh_token_obj = await RefreshToken.findOne({ where: { token: refreshToken } });

        if (!refresh_token_obj) {
            return res.status(404).send({ message: "refresh token not found!" });
        }

        if (RefreshToken.verifyExpiration(refresh_token_obj)) {
            RefreshToken.destroy({ where: { token: refresh_token_obj.token } });
            res.status(401).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        const decodedJwt = jwt.decode(accessToken, { complete: true });
        let jti = decodedJwt.payload.jti;

        if (jti !== refresh_token_obj.jti) {
            return res.status(401).send({ message: "invalid access and refresh tokens!" });
        }
        var dateNow = new Date();

        if (decodedJwt.payload.exp > dateNow.getTime() / 1000) {
            return res.status(400).send({ message: "access token is not expired!" });
        }
        const payload = { uid: decodedJwt.payload.uid, role: decodedJwt.payload.role, jti: uuidv4() }
        const newAccessToken = jwt.sign(payload, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        RefreshToken.destroy({ where: { token: refresh_token_obj.token } });
        const newRefreshToken = await RefreshToken.createToken(decodedJwt.payload.uid, payload.jti);

        return res.status(200).send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            message: "successfull"
        });
    }
    catch (err) {
        return res.status(500).send({ message: err });
    }

}


module.exports = {
    signIn,
    signUp,
    refresh
}


