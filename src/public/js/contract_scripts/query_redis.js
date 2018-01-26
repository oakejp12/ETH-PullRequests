const redis = require('redis');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);

const key = 'git-token';

client.on('error', function(err) {
    console.log(`Error: ${err}`);
})

// client.get(key, (err, data) => {
//     if (err) throw new Error(`Error retrieving contract address: ${err}`);

//     if (data != null) {
//         console.log(JSON.stringify(data));
//     } else {
//         console.log(`Data doesn't exist for ${key}`);
//     }

//     client.quit();
// });

client.flushdb((err, succeeded) => {
    if (err) console.error(err);

    console.log(succeeded);

    client.quit();
});