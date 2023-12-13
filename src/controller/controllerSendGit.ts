const axios = require("axios");
const fs = require('fs');
const redis = require('redis');
const redisClient = redis.createClient({
    url: "redis://:password@localhost:6379"
});


redisClient.on('error', (err:any) => console.log('Redis Client Error', err));
redisClient.connect();


const controllerSendGit = async (req:any, res:any) => {
    try{
        const username: string = req.body.username;
        // console.log(username)
        const data = fs.readFileSync("../save.txt",{encoding: 'utf8', flag: 'r'});
        // console.log(data)
        if(!data){
            console.log("No data")
            fs.writeFileSync("../save.txt", username);
            const reCreate = fs.readFileSync("../save.txt",{encoding: 'utf8', flag: 'r'});
            const getData = await axios.get(`https://api.github.com/users/${reCreate}`);
            const stringData = JSON.stringify(getData.data)
            await redisClient.set("gitUser",stringData);
            res.send(getData.data);
        }else if(data === username){
            console.log("have data");   
            const redisData = await redisClient.get("gitUser");
            const jsonData = JSON.parse(redisData)
            res.send(jsonData);
        }
    }catch(err){
        console.log(err);
        res.send(err);
    }
    
}

export {controllerSendGit}