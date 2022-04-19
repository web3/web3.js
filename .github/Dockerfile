# syntax=docker/dockerfile:1
FROM ethereum/client-go
RUN echo '{"config":{"chainId":4224,"homesteadBlock":1,"eip150Block":2,"eip155Block":3,"eip158Block":3,"byzantiumBlock":4},"alloc":{"0x0000000000000000000000000000000000000000":{"balance":"10000000000000000000000"},"0xdc6bad79dab7ea733098f66f6c6f9dd008da3258":{"balance":"100000000000000000000"},"0x962f9a9c2a6c092474d24def35eccb3d9363265e":{"balance":"100000000000000000000"}},"coinbase":"0x0000000000000000000000000000000000000000","difficulty":"0x1","gasLimit":"0x2fefd8","nonce":"0x0","mixhash":"0x0000000000000000000000000000000000000000000000000000000000000000","parentHash":"0x0000000000000000000000000000000000000000000000000000000000000000","timestamp":"0x00","number":"0x0","gasUsed":"0x0"}' > /genesis.json

RUN echo '123456' > /pass
RUN echo '4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e' > /k1

RUN geth --datadir data account import k1 --password /pass

RUN geth --datadir data init /genesis.json

