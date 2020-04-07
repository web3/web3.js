const assert = require('assert');
const ganache = require('ganache-cli');
const pify = require('pify');
const { getWeb3, waitSeconds } = require('./helpers/test.utils');

describe('signTypedData (ganache-cli)', function () {
    let server;
    let web3;
    let accounts;
    let subscription;
    const Web3 = getWeb3();

    before(async function () {
        server = ganache.server({
          accounts: [{ balance: "0x0", secretKey: Web3.utils.sha3("cow")}]
        });

        await pify(server.listen)(8545);
        web3 = new Web3('http://localhost:8545');
        accounts = await web3.eth.getAccounts();
        accounts = accounts.map(function(val) {
          return val.toLowerCase();
        });
    });

    after(async function () {
        await pify(server.close)();
    });

    // Data sources:
    // TESTS: https://github.com/trufflesuite/ganache-core/blob/develop/test/requests.js
    // EIP 712: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md
    it('signs', async function () {
        const expectedSig = "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d" +
                            "07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b915621c";

        const expectedV = "0x1c";
        const expectedR = "0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d";
        const expectedS = "0x07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b91562";

        const typedData = {
          types: {
              EIP712Domain: [
                  { name: "name", type: "string" },
                  { name: "version", type: "string" },
                  { name: "chainId", type: "uint256" },
                  { name: "verifyingContract", type: "address" }
              ],
              Person: [
                  { name: "name", type: "string" },
                  { name: "wallet", type: "address" }
              ],
              Mail: [
                  { name: "from", type: "Person" },
                  { name: "to", type: "Person" },
                  { name: "contents", type: "string" }
              ]
          },
          primaryType: "Mail",
          domain: {
              name: "Ether Mail",
              version: "1",
              chainId: 1,
              verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
          },
          message: {
              from: { name: "Cow", wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826" },
              to: { name: "Bob", wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB" },
              contents: "Hello, Bob!"
          }
        };

        const result = await web3.eth.signTypedData(typedData, accounts[0]);
        assert.equal(result.signature, expectedSig);

        assert.equal(result.v, expectedV);
        assert.equal(result.r, expectedR);
        assert.equal(result.s, expectedS);
    });
});
