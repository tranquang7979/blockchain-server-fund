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
app.use(bodyParser.urlencoded({ extended: false }));

fs.readFile("./config.json", "utf8", function (err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    require("./routes/main")(app, obj);
});

// Infura
var Web3_ETH_Contract = require("web3-eth-contract");
const contract_Address = "0xd74CfFb093822DA8d7BcA0c5D222E8f9C4a148D5";
const contract_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "_address", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "_name", "type": "string" }], "name": "NewDepositCome", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "user", "type": "string" }], "name": "Deposit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "MembersCounter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "ordering", "type": "uint256" }], "name": "getMember", "outputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "masterAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

Web3_ETH_Contract.setProvider("wss://ropsten.infura.io/ws/v3/0e39064d59294010892ba999eeaac30f");
var contract = new Web3_ETH_Contract(contract_ABI, contract_Address);

contract.events.NewDepositCome({
    filter: {},
    fromBlock: "latest"
},
    function (error, data) {
        var eth = web3.utils.fromWei(web3.utils.hexToNumberString(data.returnValue[1], "eth"));
        console.log(data.returnValue[0]);
        console.log(data.returnValue[2]);
        console.log(eth);
    }
);