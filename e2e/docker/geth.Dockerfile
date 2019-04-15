FROM ethereum/client-go
EXPOSE 8545
EXPOSE 8546
ENTRYPOINT ["geth", "--dev", "--rpc", "--ws", "--rpcport", "8545", "--rpcaddr", "0.0.0.0", "--rpccorsdomain", "*", "--wsaddr", "0.0.0.0", "--wsorigins", "*"]
