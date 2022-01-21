const cacheCrud = require('../CacheHandler/cacheCrud');
const rateConfig = require("../config/rateLimit.config");

async function rateLimitVerifier(req, res, next) {
    const ip = req.ip;
    let cachedReturned = await cacheCrud.getKey("ip:" + ip);
    if (cachedReturned.status === false) {
        let data = {
            ip,
            time: Date.now() / 1000,
            count: 1
        }
        await cacheCrud.setKey("ip:" + ip, data);
        next();
    }
    else {
        if ((Date.now() / 1000 - cachedReturned.value.time) > rateConfig.rateLimitWindow) {
            let data = {
                ip,
                time: Date.now() / 1000,
                count: 1
            }
            await cacheCrud.setKey("ip:" + ip, data);
            next();
        }
        else {
            if (rateConfig.rateCount > cachedReturned.value.count) {
                let data = {
                    ip,
                    time: cachedReturned.value.time,
                    count: cachedReturned.value.count + 1
                }
                await cacheCrud.setKey("ip:" + ip, data);
                next();
            }
            else {
                return res.status(429).send({ message: `you can only send ${rateConfig.rateCount} requests in 1 minute!` });
            }
        }

    }
}



module.exports = {
    rateLimitVerifier
}



