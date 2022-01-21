const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "../common_configs/cache.proto";
const cacheConfig = require('../common_configs/cache.config');
var protoLoader = require("@grpc/proto-loader");
const options = {
    keepCase: true,
    longs: String,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const cacheProto = grpc.loadPackageDefinition(packageDefinition);
const server = new grpc.Server();

const status = require('http-status');
const Mutex = require('async-mutex').Mutex
const Cache = require('./linked-list.js').Cache

const parse = (arg) => /^-?[0-9]+$/.test(arg) ? Number.parseInt(arg) : arg

const cache = new Cache(cacheConfig.max)
const mutex = new Mutex()

server.addService(cacheProto.CacheService.service, {
    getKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)

                const value = parse(cache.getKey(key))

                console.log(cache);

                if (value === null) {
                    callback({
                        code: 404,
                        message: "key not found",
                        status: grpc.status.INVALID_ARGUMENT
                    })
                } else
                    callback(null, {
                        value: value
                    })

                release()
            })
    },
    setKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)
                const value = parse(_.request.value)

                cache.setKey(key, value)

                console.log(cache);

                callback(null, {
                    cache: cache.all()
                })

                release()
            })
    },
    deleteKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = parse(_.request.key)

                if (cache.getKey(key) == null) {
                    callback({
                        code: 404,
                        message: "key not found",
                        status: grpc.status.INVALID_ARGUMENT
                    })
                } else {
                    cache.deleteKey(key)

                    console.log(cache);

                    callback(null, {})
                }

                release()
            })
    },
    clear: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                cache.clear()

                console.log(cache);

                callback(null, {})

                release()
            })
    }
})

let port = parse(process.argv[2])
server.bindAsync(
    `localhost:${cacheConfig.port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log(`Server running at localhost:${cacheConfig.port}`);
        server.start();
    }
);
