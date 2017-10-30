import { assert } from 'chai';
import Web3 from '../packages/web3';
import Eth from '../packages/web3-eth';
import Shh from '../packages/web3-shh';
import Personal from '../packages/web3-eth-personal';
import Accounts from '../packages/web3-eth-accounts';
import Net from '../packages/web3-net';
import Bzz from '../packages/web3-bzz';
import FakeIpcProvider from './helpers/FakeIpcProvider';
import FakeHttpProvider from './helpers/FakeHttpProvider';

/* eslint max-len: ["error", 200] */

const tests = [
    {
        Lib: Web3
    },
    {
        Lib: Eth
    },
    {
        Lib: Shh
    },
    {
        Lib: Personal
    },
    {
        Lib: Net
    },
    {
        Lib: Accounts
    },
    {
        Lib: Bzz,
        swarm: true
    }
];

describe('lib/web3/setProvider', () => {
    it('Web3 submodules should set the provider using constructor', () => {
        const provider1 = new FakeHttpProvider();
        const provider2 = new FakeIpcProvider();
        provider1.bzz = 'http://localhost:8500';
        provider2.bzz = 'http://swarm-gateways.net';

        const lib = new Web3(provider1);

        assert.equal(lib.eth.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.net.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.personal.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.Contract.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.accounts.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.shh.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.bzz.currentProvider, provider1.bzz);

        assert.equal(lib.eth._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.net._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.personal._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.Contract._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.eth.accounts._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.shh._requestManager.provider.constructor.name, provider1.constructor.name);

        lib.setProvider(provider2);

        assert.equal(lib.eth.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.net.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.personal.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.Contract.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.accounts.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.shh.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.bzz.currentProvider, provider2.bzz);

        assert.equal(lib.eth._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.net._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.personal._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.Contract._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.eth.accounts._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.shh._requestManager.provider.constructor.name, provider2.constructor.name);
    });

    it('Bzz should set automatically to ethereumProvider', () => {
        const provider1 = new FakeHttpProvider();
        provider1.bzz = 'http://localhost:8500';
        const provider2 = new FakeIpcProvider();
        provider2.bzz = 'http://focalhost:8500';

        // was set in test/1_givenProvider-ethereumProvider.js
        const lib = new Bzz(provider1);

        assert.equal(lib.currentProvider, provider1.bzz);

        lib.setProvider(provider2);

        assert.equal(lib.currentProvider, provider2.bzz);
    });

    tests.forEach((test) => {
        it(`${test.Lib.name} should set the provider using constructor`, () => {
            const provider1 = new FakeHttpProvider();
            let lib;

            if (test.swarm) {
                lib = new test.Lib('http://localhost:8500');

                assert.equal(lib.currentProvider, 'http://localhost:8500');
            } else {
                lib = new test.Lib(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }
        });

        it(`${test.Lib.name} should set the provider using setProvider, after empty init`, () => {
            const provider1 = new FakeHttpProvider();
            const lib = new test.Lib();

            if (test.swarm) {
                assert.isNull(lib.currentProvider);

                lib.setProvider('http://localhost:8500');

                assert.equal(lib.currentProvider, 'http://localhost:8500');
            } else {
                assert.isNull(lib.currentProvider);
                assert.isNull(lib._requestManager.provider);

                lib.setProvider(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }
        });

        it(`${test.Lib.name} should set the provider using constructor, and change later using setProvider`, () => {
            const provider1 = new FakeHttpProvider();
            const provider2 = new FakeIpcProvider();
            const swarmProvider1 = 'http://localhost:8500';
            const swarmProvider2 = 'http://swarm-gateways.net';

            let lib;

            if (test.swarm) {
                lib = new test.Lib(swarmProvider1);

                assert.equal(lib.currentProvider, swarmProvider1);

                lib.setProvider(swarmProvider2);

                assert.equal(lib.currentProvider, swarmProvider2);

                lib.setProvider(swarmProvider1);

                assert.equal(lib.currentProvider, swarmProvider1);
            } else {
                lib = new test.Lib(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);

                lib.setProvider(provider2);

                assert.equal(lib.currentProvider.constructor.name, provider2.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider2.constructor.name);

                lib.setProvider(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }
        });
    });
});
