import { expect, assert, should } from "chai";
import web3 from "../../web3";
describe("tolar", function () {
    let _web3: any = new web3("https://tolar.dream-factory.hr");
    let tolar = _web3.tolar;
    it("listAddresses", async () => {
        let listAddresses = await tolar.accounts.listAddresses();
        expect(listAddresses).to.be.a("array");
    }).timeout(5000);
    it("verifyAddress", async () => {
        let validAddress = "5484c512b1cf3d45e7506a772b7358375acc571b2930d27deb";
        let invalidAddress =
            "5484c312b1ca3d45e7506a772b7358375acc571b2930d27deb";
        let testValid = await tolar.accounts.verifyAddress(validAddress);
        let testInvalid = await tolar.accounts.verifyAddress(invalidAddress);

        assert.throws(
            tolar.accounts.verifyAddress,
            'Invalid number of parameters for "verifyAddress". Got 0 expected 1!'
        );
        assert.throws(() => {
            tolar.accounts.verifyAddress("aa", "bb");
        }, 'Invalid number of parameters for "verifyAddress". Got 2 expected 1!');

        expect(testValid).to.be.true;
        expect(testInvalid).to.be.false;
    });
});
