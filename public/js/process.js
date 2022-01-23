const web3 = new Web3(window.ethereum);
const contract_Address = "0x991a3f161a195572178bbd681bdd0e03f59c5561";
const contract_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "NewDepositCome",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "user",
				"type": "string"
			}
		],
		"name": "Deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ListDeposit",
		"outputs": [
			{
				"internalType": "address",
				"name": "_Address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_Money",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_Name",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MembersCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ordering",
				"type": "uint256"
			}
		],
		"name": "getMember",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "masterAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const contract_MM = web3.eth.Contract(contract_ABI, contract_Address);
console.log(contract_MM);

// Infura
var provider = new Web3.providers.WebsocketProvider("wss://ropsten.infura.io/ws/v3/0e39064d59294010892ba999eeaac30f");
var web3_infura = new Web3(provider);
const contract_Infura = web3_infura.eth.Contract(contract_ABI, contract_Address);
contract_Infura.events.NewDepositCome({
		filter:{},
		fromBlock: "latest"
	},
	function(error, data){	
		var eth = web3.utils.fromWei(web3.utils.hexToNumberString(data.returnValue[1], "eth"));	
		$("#list").append(`
							<tr>
								<td>`+data.returnValue[0]+`</td>
								<td>`+data.returnValue[2]+`</td>
								<td>`+eth+`</td>
							</tr>
		`);
	}
); // receive data from the emit function on the contract

var currentAccount = null;

$(document).ready(function () {

    check_Metamask();

    getETH(contract_Address).then((data) => {
        $("#total").html(data);
    });

	loadMembers();

    $("#btn_connect_MM").click(function () {
        connect_Metamask().then((data) => {
            updateAccount(data[0]);
        });
    });

	$("#btnDeposit").click(function() {
		if(currentAccount != null){ // check user logged in or not
			var txtName = $("#txtUsername").val();
			var txtAmount = $("#txtAmount").val();

			// send() => gọi hàm mất tiền, cần biết WHO đang chạy và HOW MUCH.
			// call() => gọi hàm ko mất tiền. (view returns...)
			contract_MM.methods.Deposit(txtName).send({
				from: currentAccount,
				value: web3.utils.toWei(txtAmount, "ether")
			})
			.then((data) => {console.log(data);})
			.catch((error) => {console.log(error);});
		}
		else{
			alert("Please login MetaMask. Thank you!");
		}
	});

});

function loadMembers(){
	contract_MM.methods.MembersCounter().call()
	.then((total) => {
		console.log(total);
		var number = web3.utils.hexToNumberString(total);
		if(number > 0){
			for(var count = 0; count < number; count++){
				contract_MM.methods.getMember(count).call()
				.then((member) => {
					var eth = web3.utils.fromWei(web3.utils.hexToNumberString(member[1], "eth"));
					$("#list").append(`
					<tr>
						<td>`+member[0]+`</td>
						<td>`+member[2]+`</td>
						<td>`+eth+`</td>
					</tr>
					`);
				});
			}
		}
	})
	.catch();
}

function updateAccount(data){
    currentAccount = data;
    $("#address").html(currentAccount);

    getETH(currentAccount).then((data) => {
        $("#balance").html(data);
    });
}

var getETH = function(address){
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address).then((data) => {
            resolve(parseFloat(web3.utils.fromWei(data, "ether")).toFixed(4));
        });
    });
}

window.ethereum.on("accountsChanged", function(accounts){
    updateAccount(accounts[0]);
})

async function connect_Metamask() {
    const accounts = ethereum.request({
        method: 'eth_requestAccounts'
    });
    return accounts;
}

function check_Metamask() {
    if (typeof window.ethereum !== 'undefined') {
        $("#header").show();
        $("#installMM").hide();
    }
    else {
        $("#header").hide();
        $("#installMM").show();
    }
}
