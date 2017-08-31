const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

const csv = path.join(__dirname, 'log.csv');

console.log(__dirname);

console.log('log', csv);

app.use((req, res, next) => {
// write your logging code here
// Agent, Time, Method, Resource, Version, Status
    var date = new Date();
    var agent = req.headers['user-agent'];
    var time =  date.toISOString();
    var method = req.method;
    var resource = req.originalUrl;
    var version = "HTTP/" + req.httpVersion;
    var status = 200;

    console.log(agent.replace(/,/g, '') + "," + time + "," + method + "," + resource + ","+ version + "," + status);
    fs.appendFile("log.csv", "\n" + agent.replace(/,/g, '') + "," + time + "," + method + "," + resource + ","+ version + "," + status, (err) => {
        if (err) res.status(500).send(err.message);

        next();
        
    });
    
    
});


app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.status(200).send("ok");
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    fs.readFile("log.csv", 'utf8', function (err, data) {
        if (err) res.status(500).send(err.message);
        //console.log (err, data);

        var values = [];
        var lines = data.split('\n');
        //console.log (lines);

        lines.shift();

        lines.forEach (function (lines) {
            var lineSplit = lines.split(',');
            var pushData = {
                "Agent": lineSplit[0], 
                "Time": lineSplit[1], 
                "Method": lineSplit[2], 
                "Resource": lineSplit[3], 
                "Version": lineSplit[4], 
                "Status": lineSplit[5]
            };

            values.push(pushData);
            // console.log(pushData);
            
        });    
        
        res.json(values);
    });

    //organize log by the headers using a 2-dimensional array with forEach

    //

    //JSON.parse(agent + time + method + resource + version + status);

});

module.exports = app;
