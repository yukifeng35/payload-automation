const loginAPI = require('../lib/loginAPI');
const assert = require('assert');


describe('Testing for Payment Method', () => {


    before('setting up', () => {
        // ANY SETUP
    });



    describe('Positive testing for Payment Method', async () => {
        const payload_PMP = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "John Smith", account_number: "123", swift_code: "ICBCUSBJ", aba: "11122233A"},
            {payment_method: "LOCAL", bank_country_code: "US", account_name: "John Smith", account_number: "123", swift_code: "ICBCUSBJ", aba: "11122233A"}
        ];
        let Msg = 'Bank details saved';
        payload_PMP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.payment_method}'`, async ()=>{
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log(`Successfully verified payment_method '${payload.payment_method}' \n`);
            });
        });


    });

    describe('Negative Testing for payment_method', async () => {

        const payload_PMN = [
            {payment_method: "SWIF", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: " ", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "swift", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "Local", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: " SWIFT", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "LOCAL ", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
        ];
        let errMsg = "'payment_method' field required, the value should be either 'LOCAL' or 'SWIFT'";
        let pass = false;

        payload_PMN.forEach(async (payload) => {
            it(`Should NOT be able to pay with payment_method'${payload.payment_method}'`, async ()=>{
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg);
                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log(`Payment rejected as expected with payment_method = '${payload.payment_method}'`);
            });
        });

    });


}); // Main describe
