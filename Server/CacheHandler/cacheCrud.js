const client = require("./client");

function getKey(key) {
    client.getKey({ key: key }, (error, value) => {

    });
}


function setKey(key, value) {
    obj = { key, value };
    console.log(obj);
    client.setKey(obj, (error, caches) => {

    });
}


module.exports = {
    getKey,
    setKey
}

