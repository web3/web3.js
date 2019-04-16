FROM ethereum/client-go
EXPOSE 8545
EXPOSE 8546
ENTRYPOINT ["geth", "--dev", "--rpc", "--rpcaddr", "0.0.0.0", "--rpcport", "8545", "--rpccorsdomain", "*", "--rpcvhosts", "*", "--ws", "--wsorigins", "*", "--wsaddr", "geth"]

