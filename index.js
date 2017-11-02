const id = require("short-id");
const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const bodyParser =  require("body-parser");
const methodOverride = require("method-override");

const ranId = function(req, res, next) {
   return id.generate();
   next();
}
 
let cData = "data.json";
let myData = path.join(__dirname, "data.json");

app
.disable('x-powered-by')
.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, UPDATE, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Content-Type', 'application/json');
    next();

  
})
.use(methodOverride('X-HTTP-Method-Override'))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }));;

app.route('/api/chirps')
    .get(function(req, res){
        fs.readFile(myData, "utf-8", function(err, cont){
            res.send(cont);
        });
    }).post(function(req, res){
        fs.readFile(myData, "utf-8", function(err, cont){
            var chirpParse = JSON.parse(cont);
            var chirp = req.body;
            var id = ranId();
            chirp.id = id;
            chirpParse.push(chirp);
            fs.writeFile(myData, JSON.stringify(chirpParse), function(err){
                if (err) throw err
                res.send(chirp)
            })
        })
    });
app.route('/api/chirps/:id')
    .put(function(req, res){
        fs.readFile(myData, "utf-8", function(err, cont){
            var chirpParse = JSON.parse(cont);
            var thisChirp = chirpParse.filter(function (chirp){
                return chirp.id === req.params.id;
            });
            var newChirp = req.body;
            var id = req.params.id;
            var index = '';
            chirpParse.map(function(chirp, i) {
                if (chirp.id === req.params.id) {
                    index = i;
                }
            });
            newChirp.id = id;
            chirpParse.splice(index, 1);
            chirpParse.push(newChirp);
            fs.writeFile(myData, JSON.stringify(chirpParse), function(err){
                if (err) throw err
                res.send(newChirp)
            })
        });      
    }).delete(function(req, res){
        fs.readFile(myData, "utf-8", function(err, cont){
            var chirpParse = JSON.parse(cont);
            var index = "";
            chirpParse.map(function(chirp, i) {
                if (chirp.id === req.params.id) {
                    index = i;
                }
            });
            if (index === "") {
                res.sendtSatus(404);
                return;
            }
            chirpParse.splice(index, 1);
            fs.writeFile(myData, JSON.stringify(chirpParse), "utf-8", function(err){
                if (err) throw err
                res.sendStatus(202);
            })
        });
    }).get(function(req, res){
        fs.readFile(myData, "utf-8", function(err, cont){
            var chirpParse = JSON.parse(cont);
            var thisChirp = chirpParse.filter(function (chirp){
                return chirp.id === req.params.id;
            });
            if (thisChirp.length !== 1) {
                res.sendStatus(404);
                return;
            }
            var chirp = JSON.stringify(thisChirp[0]);
            res.send(chirp);
        });
    });

app.listen(3000);{
    console.log("listening on 3000")
};
