if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	alert("You will need web3 for this Dapp to function. You can use the MetaMask extension for web3.")
	if (window.confirm('Clicking [Ok] will load the MetaMask website. Cancel will continue to load this website.')) {
		window.location.href='https://metamask.io/';
	};
	//fallback - this will function if you have an eth testrpc running
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
web3.eth.defaultAccount = web3.eth.accounts[0];

//the contract ABI (remix.ethereum.org can generate this for you)
var simpleContractCode = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"data","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"string"}],"name":"addData","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
//the contract's address
var simpleContract = simpleContractCode.at('0x1F1446a4a8665E942236BB4FFE3376d462c135fD');

function addData(){
	var value = document.getElementById("fAdd").value;
	//sending the addData function
	simpleContract.addData(value,function(err, res){
		document.getElementById("addConf").innerHTML = "Added Data:  \"" + value + "\"', with transaction:  " + res;
	});
}
function getData(){
	var address = document.getElementById("fGet").value;
	console.log(address);
	//calling the data variable
	simpleContract.data(address,function (err, res) {
		console.log(res);
		document.getElementById("dataIn").innerHTML = "Retreived data:  " + res;
	});
}