var express = require('express');
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.use("/scripts", express.static(__dirname + "/node_modules/web3.js-browser/build"));

var fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

fs.readFile("./config.json", "utf8", function(err, data){
    if(err) throw err;
    var obj = JSON.parse(data);
    require("./routes/main")(app, obj);
});