const web3 = new Web3(window.ethereum);
const contract_Address = "0xc6536a42a6C585e960785521e098A7311248Be08";
const contract_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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

var currentAccount = null;

$(document).ready(function () {

    check_Metamask();

    getETH(contract_Address).then((data) => {
        $("#total").html(data);
    });

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
