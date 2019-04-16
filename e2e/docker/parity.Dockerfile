FROM parity/parity:stable
EXPOSE 8545
EXPOSE 8546
ENTRYPOINT ["parity", "--chain", "dev", "--jsonrpc-hosts",  "all", "--jsonrpc-interface", "all", "--jsonrpc-cors", "null", "--ws-interface", "all"]
