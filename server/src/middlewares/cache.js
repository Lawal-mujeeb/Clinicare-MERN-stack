import NodeCache from "node-cache";

//create cache
export const cache = new NodeCache({
    stdTTL: 3600, //cache data for 1 hour
    checkperiod: 620, // check for expired keys every 620sec
    useClones: false, // better performance for caching system
})

//cache function to save data
export const cacheMiddleware = (key, ttl = 600) => async(req, res, next)=> {
    //create unique key based on our userId, api routes and query parameters
    const userId = req.user.id || "anonymous"
    const cacheKey = `user_${userId}_${key}_${req.originalUrl}_${JSON.stringify
        (req.query)}`
        try {
            const cachedData = cache.get(cacheKey); //tetrieve data associated with cached key
            if (cachedData) {
                console.log(`Cache key found for: ${cacheKey}`);
                return res.json(cachedData); //send saved response to client
                
            }
            // try to save data from our response
            const originalJSON = res.json
            //overide res.json to cache the response
            res.json = function(data) {
                cache.set(cacheKey, data,ttl); //takes the key , data to be saved , and how long to be saved in cache as args
                console.log(`Cache set for key: ${cacheKey}`);
                return originalJSON.call(this, data ); //originalJson is the res.json first saved , the call is used to invoke the method so that the original res.json is seen with the help of this keyword, ensuring the data can be properly passed down to the original json
            }
            next() //call the next event supposed to happen
        } catch (error) {
            console.error("Cache error ", error);
            next (error)
        }
}

// to invalidate or clear our cache
export const clearCache = (pattern = null, clearAll = false)=> (req, res, next)=> {
    // to ways of the clearing cache either by the pattern = null (which just clears )
    // get the array of cached keys
    const keys = cache.keys()
    if(clearAll) {
        keys.forEach((key) => cache.del(key));
        console.log("Cleared all cache entries");
        return next();
    }
    const userId = req.user.id || ""
    const userPrefix = userId ? `user_${userId}_` : "";
    // if we have a userId, only clear keys that match both pattern and userId
    const matchingKeys = pattern ? keys.filter((key)=> {
        if(userId) {
            return key.includes(userPrefix) && key.includes(pattern)
        }
        // if no userId, just match the pattern
        return key.includes(pattern)
    }) : keys;
    matchingKeys.forEach((key) => cache.del(key));
    console.log(
        `cleared ${matchingKeys.length} cache entries for ${userId  ? `user ${userId}` : "all users"  }`    
    );
    next()
};