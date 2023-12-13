"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerSendGit = void 0;
const axios = require("axios");
const fs = require('fs');
const redis = require('redis');
const redisClient = redis.createClient({
    url: "redis://:password@localhost:6379"
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
const controllerSendGit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        // console.log(username)
        const data = fs.readFileSync("../save.txt", { encoding: 'utf8', flag: 'r' });
        // console.log(data)
        if (!data) {
            console.log("No data");
            fs.writeFileSync("../save.txt", username);
            const reCreate = fs.readFileSync("../save.txt", { encoding: 'utf8', flag: 'r' });
            const getData = yield axios.get(`https://api.github.com/users/${reCreate}`);
            const stringData = JSON.stringify(getData.data);
            yield redisClient.set("gitUser", stringData);
            res.send(getData);
        }
        else if (data === username) {
            console.log("have data");
            const redisData = yield redisClient.get("gitUser");
            const jsonData = JSON.parse(redisData);
            res.send(jsonData);
        }
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
});
exports.controllerSendGit = controllerSendGit;
