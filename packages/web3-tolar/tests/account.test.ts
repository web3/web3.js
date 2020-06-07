import { assert, expect, should } from 'chai';
import web3 from 'web3';

describe("Tolar account", function () {
    let _web3: any = new web3("https://tolar.dream-factory.hr");
    let tolar = _web3.tolar;
    // it("openRemote", async () => {
    //     let openRemote = await tolar.account.openRemote("newPassword123");
    // }).timeout(10000);
    // it("listAddresses", async () => {
    //     let listAddresses = await tolar.account.listAddresses();
    //     expect(listAddresses).to.be.a("array");
    // }).timeout(10000);
    // it("verifyAddress", async () => {
    //     let validAddress = "5484c512b1cf3d45e7506a772b7358375acc571b2930d27deb";
    //     let invalidAddress =
    //         "5484c312b1ca3d45e7506a772b7358375acc571b2930d27deb";
    //     let testValid = await tolar.account.verifyAddress(validAddress);
    //     let testInvalid = await tolar.account.verifyAddress(invalidAddress);

    //     assert.throws(
    //         tolar.account.verifyAddress,
    //         'Invalid number of parameters for "verifyAddress". Got 0 expected 1!'
    //     );
    //     assert.throws(() => {
    //         tolar.account.verifyAddress("aa", "bb");
    //     }, 'Invalid number of parameters for "verifyAddress". Got 2 expected 1!');

    //     expect(testValid).to.be.true;
    //     expect(testInvalid).to.be.false;
    // });
    // it("createNewAddress", async () => {
    //     let createNewAddress = await tolar.account.createNewAddress(
    //         "aaa",
    //         "myPwd",
    //         "whose pwd?"
    //     );
    //     expect(createNewAddress).to.have.lengthOf(50);
    //     expect(createNewAddress).to.be.a("string").and.match(/^54*/);
    // }).timeout(30000);
    it("create wallet", async () => {
        let acc = tolar.account;
        //let newAcc = acc.create();
        //console.log(newAcc.address);
        //let isValid = await acc.verifyAddress(newAcc.address);
        //console.log(newAcc);
        // let addressRecoveres = acc.recover(
        //     "0xe22e9eac97cfa74c9c00951ccf1b6168e885638e94016a64e709224de18f7af7",
        //     "0xb053fcbd9e4720f4a6e431af9d4ec4efc123f60ccd0a3ad2ab06c2e48c5dabad7cb01fa6b4a2be5b23474469710a295b3740d735a11c01feadc24e138721e1fb1",
        //     false
        // );
        // console.log(addressRecoveres);
        //expect(isValid).to.be.true;

        //let wallet = tolar.account.wallet;
        // let receiver = wallet.create(1)[0];
        // console.log("wallet keys", Object.keys(wallet));
        // wallet.save("testPassword");
        // wallet = wallet.load("testPassword");
        let receiver = acc.privateKeyToAccount(
            "0xff3120706853637455b8a379492bb8d5f94afb94e9746c0d83afee9e688c6686"
        );
        console.log(receiver);
        let sender = acc.privateKeyToAccount(
            "0x08bfa59c42886aa4d62376ddc41eacc84b2a8308f4e16c162cca9ca8b4d35c2b"
        );
        // let sender = acc.decrypt(
        //     {
        //         address: "84c512b1cf3d45e7506a772b7358375acc571b29",
        //         crypto: {
        //             cipher: "aes-128-ctr",
        //             cipherparams: {
        //                 iv: "26cdcb58f5057c4f3f04468ae9d9b7b1",
        //             },
        //             ciphertext:
        //                 "9177eba69ff70349d52a4c96b6e98eec2717e5e0218d5f4da143b894111681a9",
        //             kdf: "scrypt",
        //             kdfparams: {
        //                 dklen: 32,
        //                 n: 262144,
        //                 p: 1,
        //                 r: 8,
        //                 salt:
        //                     "21f0d2c7eb0cf00d96461bacd023a741ebacfd446fba01b9849399ce32d9a416",
        //             },
        //             mac:
        //                 "963d2541fc26e05b5ff80272632e62060e5394e980b6a31affbaa6f6d09683c4",
        //         },
        //         id: "d90f9e3d-9b1c-cd85-99b7-5161379c97b1",
        //         version: 3,
        //     },
        //     "supersifra"
        // );
        console.log(sender);
        // sender = acc.privateKeyToAccount(
        //     "0x08bfa59c42886aa4d62376ddc41eacc84b2a8308f4e16c162cca9ca8b4d35c2b"
        // );
        // console.log(sender, "\n<---- sender/ receiver---->\n", receiver);
        // let res = wallet.add({
        //     privateKey:
        //         "0xd7ce009203c5d16d6b5daafa1efb1167a9e4558e88dff0bc14ebd65f3f0fc116",
        //     address: "5484c512b1cf3d45e7506a772b7358375acc571b2930d27deb",
        // });
        // console.log(res, wallet);
        // let newAddresses = wallet.create(
        //     2,
        //     "0xd7ce009203c5d16d6b5daafa1efb1167a9e4558e88dff0bc14ebd65f3f0fc116"
        // );
        // newAddresses[0] = acc.privateKeyToAccount(
        //     "0xd7ce009203c5d16d6b5daafa1efb1167a9e4558e88dff0bc14ebd65f3f0fc116"
        // );
        let acc2 = tolar.account.privateKeyToAccount(
            "0xd7ce009203c5d16d6b5daafa1efb1167a9e4558e88dff0bc14ebd65f3f0fc116"
        );
        console.log(acc2);

        let nonce = await tolar.getNonce(sender.address);
        console.log("nonce:\n", nonce, "sender address: \n", sender.address);
        let tx = {
            sender_address: sender.address, //"540dc971237be2361e04c1643d57b572709db15e449a870fef",
            receiver_address: receiver.address, //"5472de4346f7a78fd5e719a00ab03c0aba3e1c5b6113273bde", //receiver.address, //"5484c512b1cf3d45e7506a772b7358375acc571b2930d27deb",
            amount: 10,
            gas: 24000,
            gas_price: 1,
            data: "datata blabla",
            nonce,
        };
        console.log(tx);

        // let tx2 = {
        //     sender_address:
        //         "547ec363f4d32b1fb3c67b8bf91aacf689943e6e87ae4ae600", //"540dc971237be2361e04c1643d57b572709db15e449a870fef",
        //     receiver_address:
        //         "5456a09d5c06e23ec6a71a7db606549ec4bde1788c71a9552b", //"5484c512b1cf3d45e7506a772b7358375acc571b2930d27deb",
        //     amount: 0,
        //     gas: 21463,
        //     gas_price: 1,
        //     data: "",
        //     nonce: 0,
        // };
        // //let sha3 = acc.hashMessage(Buffer.from(JSON.stringify(tx)));
        // let txHash = await tolar.getHashHex(tx);
        // //console.log("sha3 =>", sha3);
        // console.log("txHash->", txHash);
        // let signature = sender.sign("0x" + txHash, sender.privateKey);
        // let toFixedHexPlaces = (hex: string, places: number) => {
        //     hex = hex.replace(/^0x/, "");
        //     while (hex.length < places) {
        //         hex = "0" + hex;
        //     }
        //     console.log(hex);
        //     return hex;
        // };
        // //console.log(signature);
        // let signedTx = {
        //     body: tx,
        //     sig_data: {
        //         hash: txHash,
        //         signature:
        //             signature.r.substr(2) +
        //             signature.s.substr(2) +
        //             toFixedHexPlaces(signature.v, 2),
        //         signer_id: signature.signer_id,
        //     },
        // };

        // console.log({
        //     transaction: signedTx,
        // });
        let signedTx = await sender.signTransaction(tx, sender.privateKey);
        console.log(signedTx);
        let sentSignedTx = await tolar.sendSignedTransaction(signedTx);
        console.log("signed remote tx\n", sentSignedTx);
        // //console.log(newAddresses[0].sign);
        // console.log(receiver);

        let blockcount = await tolar.getBlockCount();
        console.log(await tolar.getBalance(receiver.address, blockcount - 1));
    }).timeout(30000);
    // it("test import export", async () => {
    //     let acc = tolar.account;
    //     let listAddresses = await tolar.account.listAddresses();
    //     let pk = await acc.exportKeyFile(listAddresses[0]);
    //     let res = await acc.importKeyFile(pk);
    //     expect(res).to.be.true;
    // });
    // it("list balance per addresses", async () => {
    //     let acc = tolar.account;
    //     //let listAddresses = await tolar.account.listAddresses();
    //     let result = await acc.listBalancePerAddress();
    //     console.log(
    //         "addresses with ballance",
    //         result.filter((address: any) => address.balance)
    //         // result
    //     );
    // }).timeout(10000);
});
