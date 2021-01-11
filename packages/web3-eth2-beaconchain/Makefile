.PHONY: lodestar-docker lighthouse-docker

lodestar-docker:
	docker run --network host chainsafe/lodestar beacon --testnet medalla --api.rest.enabled true

lighthouse-docker:
	docker run -p 9000:9000 -p 127.0.0.1:5052:5052 -v ${HOME}/.lighthouse:/root/.lighthouse sigp/lighthouse lighthouse --network mainnet beacon --http --http-address 0.0.0.0
