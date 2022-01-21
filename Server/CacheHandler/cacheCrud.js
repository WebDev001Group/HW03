const client = require("./client");

async function getKey(key) {
    let value = await new Promise(function (resolve, reject) {
        client.getKey({ key }, (error, obj) => {
            if (!obj) {
                resolve({ status: false, value: undefined })
            }
            else resolve({ status: true, value: JSON.parse(obj.value) });
        });
    });
    return value;
}


async function setKey(key, value) {
    obj = { key, value: JSON.stringify(value) };
    await new Promise(function (resolve, reject) {
        client.setKey(obj, (error, caches) => {
            resolve();
        });;
    })
}

async function deleteKey(key) {
    await new Promise(function (resolve, reject) {
        client.deleteKey({ key }, (err, obj) => {
            resolve();
        });
    });
}


module.exports = {
    getKey,
    setKey,
    deleteKey
}

