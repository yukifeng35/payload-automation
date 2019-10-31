const loginAPI = require('../lib/loginAPI');
const assert = require('assert');


describe('Testing for Bank Country Code', () => {

    before('setting up', () => {
        // ANY SETUP
    });


    describe('Positive testing for Bank Country Code', async () => {
        const payload_BCCP = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "John Smith", account_number: "123", swift_code: "ICBCUSBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "John Smith", account_number: "123456788", swift_code: "ICBKCNBJ", aba: "11122233A"},
            {payment_method: "LOCAL", bank_country_code: "AU", account_name: "John Smith", account_number: "12345678", swift_code: "ICBKAUBJ", aba: "11122233A", bsb: "SJIF12"}
        ];
        let Msg = 'Bank details saved';
        payload_BCCP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.bank_country_code}'`, async ()=>{
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log("Positive testing for bank_country_code: " + payload.bank_country_code +"\n");
            });
        });


    });

    describe('Negative Testing for Bank Country Code', async () => {

        const payload_BCCN = [
            {payment_method: "SWIFT", bank_country_code: "", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: " ", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "cn", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "CN ", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "Au", account_name: "", account_number: "", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: " AU", account_name: "", account_number: "", swift_code: "", aba: ""},
        ];
        let errMsg = "'bank_country_code' is required, and should be one of 'US', 'AU', or 'CN'";
        let pass = false;


        payload_BCCN.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.bank_country_code}'`, async ()=>{
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg);
                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for bank_country_code: " + payload.bank_country_code +"\n");
            });
        });

    });


}); // Main describe
