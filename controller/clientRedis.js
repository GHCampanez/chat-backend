
const redis = require('redis')

// create and connect redis client to local instance.
let client
if (process.env.REDIS_URL)
    client = redis.createClient(process.env.REDIS_URL)
else
    client = redis.createClient(6379)

// echo redis errors to the console
client.on('error', (err) => {
    console.log("Error " + err)
});

module.exports = client
