FROM node
RUN npm install -g ganache-cli
ENTRYPOINT ["ganache-cli", "-d", "-h", "0.0.0.0"]
