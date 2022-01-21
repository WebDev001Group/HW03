const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "M:/web_hw3/HW03/Cache_Server/cache.proto";
var protoLoader = require("@grpc/proto-loader");
const options = {
    keepCase: true,
    longs: String,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const CacheService = grpc.loadPackageDefinition(packageDefinition).CacheService;


const client = new CacheService("localhost:9000", grpc.credentials.createInsecure());

module.exports = client;