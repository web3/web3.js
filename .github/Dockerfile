# syntax=docker/dockerfile:1
FROM ethereum/client-go

RUN echo '{"config":{"chainId":15,"homesteadBlock":0,"eip150Block":0,"eip155Block":0,"eip158Block":0,"byzantiumBlock":0,"constantinopleBlock":0,"petersburgBlock":0,"istanbulBlock":0,"berlinBlock":0,"londonBlock":0},"alloc":{"0xdc6bad79dab7ea733098f66f6c6f9dd008da3258":{"balance":"100000000000000000000"},"0x962f9a9c2a6c092474d24def35eccb3d9363265e":{"balance":"100000000000000000000"}},"coinbase":"0x0000000000000000000000000000000000000000","difficulty":"0x20000","gasLimit":"0x2fefd8","nonce":"0x0000000000000042","mixhash":"0x0000000000000000000000000000000000000000000000000000000000000000","parentHash":"0x0000000000000000000000000000000000000000000000000000000000000000","timestamp":"0x00"}' > /genesis.json
RUN echo '123456' > /pass
RUN echo '4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e' > /k1
RUN echo '34aeb1f338c17e6b440c189655c89fcef148893a24a7f15c0cb666d9cf5eacb3' > /k2

RUN geth account import k1 --password /pass
RUN geth account import k2 --password /pass

RUN geth init --datadir data /genesis.json

expose 8545
