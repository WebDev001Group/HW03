const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./cache.proto";
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

const cache = new Cache(parse(process.argv[3]))
const mutex = new Mutex()

server.addService(cacheProto.CacheService.service, {
    getKey: (_, callback) => {
        mutex.acquire()
            .then(function (release) {
                const key = _.request.key

                const value = cache.getKey(key)

                console.log(cache.all());

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
                const key = _.request.key
                const value = _.request.value

                cache.setKey(key, value)

                console.log(cache.all());

                callback(null, {
                    cache: cache.all()
                })

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
    `localhost:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log(`Server running at localhost:${port}`);
        server.start();
    }
);