FROM parity/parity:stable
EXPOSE 8545
EXPOSE 8546
ENTRYPOINT ["parity", "--chain", "dev"]
