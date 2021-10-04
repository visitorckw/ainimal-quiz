var express = require('express');
var app = express();

app.use(express.urlencoded());
app.use(express.json());

app.post('/login', function(req, res){
    res.set('Access-Control-Allow-Origin', '*');
    if(req.body.email === "" || req.body.password === ""){
        res.send("empty");
    }
    else if(req.body.email === "ainimal@ainimal.com" && req.body.password === "123123"){
        res.send("success")
    }
    else{
        res.send("fail");
    }
});
app.listen(8000, function(){
    // console.log('server is listening in port 8000');
});