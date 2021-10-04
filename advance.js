var express = require('express');
var app = express();

class rate_limit{
    constructor(url, time, limit, whitelist, blacklist, resText){
        // url, time of refresh bucket, limit number of requests, whitelist, blacklist, response text

        this.whitelist = new Set();
        this.blacklist = new Set();
        this.bucket = new Map();

        for(let i = 0; i < whitelist.length; i++){
            this.whitelist.add(whitelist[i]);
        }
        for(let i = 0; i < blacklist.length; i++){
            this.blacklist.add(blacklist[i]);
        }

        let that = this;  //之前踩過的坑

        setInterval(function(){
            that.bucket.clear();
        }, time);
        
        app.get(url, function(req, res){

            const ip = req.headers['x-forwarded-for'] || req.ip;
            console.log(ip); // ip address of the user

            if(that.whitelist.has(ip)){
                res.status(200).send(resText);
            }
            else if(that.blacklist.has(ip)){
                res.status(403).end();
            }
            else if(that.bucket.has(ip)){
                const ctr = that.bucket.get(ip) + 1;
                if(ctr > limit){
                    res.status(429).end();
                }
                else{
                    that.bucket.set(ip, ctr);
                    res.status(200).send(resText);
                }
            }
            else{
                that.bucket.set(ip, 1);
                res.status(200).send(resText);
            }
        });
    }
}

rate_limit1 = new rate_limit("/hello-world", 1000* 60* 60 *24, 100, [], [], "Hello World!");
rate_limit2 = new rate_limit("/hi-jack", 1000* 60* 60, 100, ["::ffff:127.0.0.1"], [], "Hi! Jack!");
rate_limit3 = new rate_limit("/listen-to-me", 1000* 60, 100, [], ["::ffff:127.0.0.1"], "Listen to me!");

app.listen(3000);