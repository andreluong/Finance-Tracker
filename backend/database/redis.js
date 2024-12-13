require("dotenv").config({ path: [".env.local", ".env"] });
const hash = require("object-hash");
const redis = require('redis');

const DEFAULT_EXPIRATION = 300; // 5 mins in seconds

let redisClient = undefined;

async function initializeRedisClient() {
    redisClient = redis.createClient({ 
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            reconnectStrategy: function(retries) {
                if (retries > 3) {
                    console.log("Too many attempts to reconnect. Redis connection was terminated");
                    return new Error("Too many retries.");
                } else {
                    return retries * 500;
                }
            }
        }
    });

    redisClient.on("error", (error) => {
        console.error("Failed to create the Redis Client with error: ", error);
    });

    try {
        await redisClient.connect();
        console.log('Connected to Redis server successfully');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }    
}

// Check if the Redis client is active
function isRedisActive() {
    return redisClient && redisClient.isOpen;
}

// Generate a unique key for the request
function requestToKey(req) {
    let path = req.path.substring(5).replace(/\//g, ':');
    
    // No user ID for categories
    if (path.startsWith('categories')) {
        return `system:${path}:${hash.sha1(req.query).slice(0, 6)}`;
    }

    return `${req?.auth?.userId}:${path}:${hash.sha1(req.query).slice(0, 6)}`;
}

async function writeCache(key, data) {
    if (isRedisActive()) {
        console.log(`Writing data to Redis with key: ${key}`);

        // System keys
        if (key.startsWith('system:')) {
            await redisClient
                .set(key, JSON.stringify(data))
                .catch((error) => {
                    console.error("Failed to write data to Redis: ", error);
                });
        // User keys
        } else {
            await redisClient
                .set(key, JSON.stringify(data), { EX: DEFAULT_EXPIRATION })
                .catch((error) => {
                    console.error("Failed to write data to Redis: ", error);
                });
        }
    }
}

async function readCache(key) {
    if (isRedisActive()) {
        return await redisClient.get(key);
    }
    return undefined;
}

async function deleteCache(userId, ...paths) {
    if (isRedisActive()) {
        for (const path of paths) {
            console.log(`Deleting all keys for user ${userId} with path ${path}`);
            const pattern = `${userId}:${path}:*`
            let count = 0;

            // Scan all keys matching the pattern and delete them
            for await (const key of redisClient.scanIterator({
                MATCH: `${pattern}`
            })) {
                console.log('Deleting key:', key);
                await redisClient.DEL(key);
                count++;
            }
            console.log(`${count} matching keys were deleted successfully!\n`);
        }
    }
}

// Handle the request by checking the cache first
async function handleRequest(req, res, databaseRequest) {
    const key = requestToKey(req);
    const cachedData = await readCache(key);

    if (cachedData) {
        res.status(200).json(JSON.parse(cachedData));
    } else {
        const data = await databaseRequest;
        writeCache(key, data);
        res.status(200).json(data);
    }
}

module.exports = { initializeRedisClient, requestToKey, readCache, writeCache, deleteCache, handleRequest };
