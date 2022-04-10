const {Server} = require('@chainlink/ccip-read-server');
const {ethers, BigNumber} = require('ethers');


const SIGNER_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const abi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "getSignedBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "sig",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const balances = {
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266": BigNumber.from("1000000000000000000000"),
};

function makeApp(privateKey, path) {
    let signer = new ethers.Wallet(privateKey);
    const server = new Server();
    server.add(abi, [
        {
            type: 'getSignedBalance',
            func: async (args) => {
                const [addr] = args;
                const balance = balances[addr.toLowerCase()] || 0;
                let messageHash = ethers.utils.solidityKeccak256(
                    ['uint256', 'address'],
                    [balance, addr]
                );
                let messageHashBinary = ethers.utils.arrayify(messageHash);
                const signature = await signer.signMessage(messageHashBinary);
                return [balance, signature];
            },
        },
    ]);
    return server.makeApp(path);
}

exports.default = () => {
    const httpApp = makeApp(SIGNER_PRIVATE_KEY, '/');

    httpApp.listen(8080);
    console.log('server running');
};


