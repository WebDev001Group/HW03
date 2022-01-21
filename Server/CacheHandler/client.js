const grpc = require("@grpc/grpc-js");
const cacheConfig = require("../../common_configs/cache.config");
const PROTO_PATH = "../common_configs/cache.proto";
var protoLoader = require("@grpc/proto-loader");
const options = {
    keepCase: true,
    longs: String,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const CacheService = grpc.loadPackageDefinition(packageDefinition).CacheService;


const client = new CacheService(`localhost:${cacheConfig.port}`, grpc.credentials.createInsecure());

module.exports = client;