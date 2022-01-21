const client = require("./client");

async function getKey(key) {
    let value = await new Promise(function (resolve, reject) {
        client.getKey({ key }, (error, obj) => {
            if (error) {

            }
            else {
                resolve(JSON.parse(obj.value));
            }

        });
    });
    return value;
}


async function setKey(key, value) {
    obj = { key, value: JSON.stringify(value) };
    await new Promise(function (resolve, reject) {
        client.setKey(obj, (error, caches) => {
            if (error) {
                console.log("error in setting key value in cache!");
                reject();
            }
            else {
                resolve();
            }
        });;
    })
}


module.exports = {
    getKey,
    setKey
}

