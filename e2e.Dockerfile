FROM node:8
WORKDIR /web3

COPY lerna.json ./
COPY package*.json ./

ADD ./packages/web3-bzz/package.json ./packages/web3-bzz/package.json
ADD ./packages/web3-core-helpers/package.json ./packages/web3-core-helpers/package.json
ADD ./packages/web3-core-method/package.json ./packages/web3-core-method/package.json
ADD ./packages/web3-core-promievent/package.json ./packages/web3-core-promievent/package.json
ADD ./packages/web3-core-requestmanager/package.json ./packages/web3-core-requestmanager/package.json
ADD ./packages/web3-core-subscriptions/package.json ./packages/web3-core-subscriptions/package.json
ADD ./packages/web3-core/package.json ./packages/web3-core/package.json
ADD ./packages/web3-eth-abi/package.json ./packages/web3-eth-abi/package.json
ADD ./packages/web3-eth-accounts/package.json ./packages/web3-eth-accounts/package.json
ADD ./packages/web3-eth-contract/package.json ./packages/web3-eth-contract/package.json
ADD ./packages/web3-eth-ens/package.json ./packages/web3-eth-ens/package.json
ADD ./packages/web3-eth-iban/package.json ./packages/web3-eth-iban/package.json
ADD ./packages/web3-eth-personal/package.json ./packages/web3-eth-personal/package.json
ADD ./packages/web3-eth/package.json ./packages/web3-eth/package.json
ADD ./packages/web3-net/package.json ./packages/web3-net/package.json
ADD ./packages/web3-providers-http/package.json ./packages/web3-providers-http/package.json
ADD ./packages/web3-providers-ipc/package.json ./packages/web3-providers-ipc/package.json
ADD ./packages/web3-providers-ws/package.json ./packages/web3-providers-ws/package.json
ADD ./packages/web3-shh/package.json ./packages/web3-shh/package.json
ADD ./packages/web3-utils/package.json ./packages/web3-utils/package.json
ADD ./packages/web3/package.json ./packages/web3/package.json


RUN npm install
RUN npm run postinstall
ADD . .

ENTRYPOINT ["npm", "run", "e2e"]
