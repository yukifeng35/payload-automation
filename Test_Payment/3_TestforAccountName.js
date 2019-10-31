
const loginAPI = require('../lib/loginAPI');
const assert = require('assert');


describe('Testing for Account Name', () => {

    before('setting up', () => {
        // ANY SETUP
    });



    describe('Positive testing for Account Name', async () => {
        const payload_ANP = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Jo", account_number: "123", swift_code: "ICBCUSBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: " T*&y lt! ", account_number: "123456788", swift_code: "ICBKCNBJ", aba: "11122233A"}
    ];

        let Msg = 'Bank details saved';
        payload_ANP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.account_name}'`, async ()=>{
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log("Positive testing for the length of account_name: " + payload.account_name + " (" + payload.account_name.length + ")\n");
            });
        });



    });

    describe('Negative Testing for Account Name', async () => {

        const payload_nullAccountName = {payment_method: "SWIFT", bank_country_code: "CN", account_name: "", account_number: "123456788", swift_code: "ICBKCNBJ", aba: "11122233A"};
        let errMsg0 = "'account_name' is required";
        let pass0 = false;
        it('When without Account Name', async ()=>{
            await loginAPI.login(payload_nullAccountName).catch(err => {
                assert.strictEqual(err.response.status, 400);
                assert.strictEqual(err.response.data.error, errMsg0);
                pass0 = true;
            });
            assert.strictEqual(pass0, true);
            console.log("Negative testing without Account Name.\n");
        });

        const payload_ANN = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "1", account_number: "", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "12345678910", account_number: "", swift_code: "", aba: ""},
        ];
        let errMsg = "Length of account_name should be between 2 and 10";
        let pass = false;

        payload_ANN.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.account_name}'`, async ()=>{
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg);
                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for the length of account_name: " + payload.account_name + " (" + payload.account_name.length + ")\n");
            });
        });

    });


}); // Main describe
