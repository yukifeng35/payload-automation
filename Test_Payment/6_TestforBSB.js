
const assert = require('assert');
const loginAPI = require('../lib/loginAPI');


describe('Testing for BSB', () => {


    before('setting up', () => {
        // ANY SETUP
    });


    describe('Positive testing for BSB', async () => {
        const payload_BSBP = [
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "123456", swift_code: "ICBCAUBJ", aba: "11122233A", bsb: "12&*56"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: " T*&y lt! ", account_number: "123456788", swift_code: "ICBKCNBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "US", account_name: " T*&y lt! ", account_number: "123456788", swift_code: "ICBKUSBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: " T*&y lt! ", account_number: "123456788", swift_code: "ICBKCNBJ", aba: "11122233A", bsb: "12345677"}
        ];

        let Msg = 'Bank details saved';
        payload_BSBP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.bsb}'`, async () => {
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log("Positive testing for BSB when Country Code is: " +payload.bank_country_code + "(" + payload.bsb + ")\n");
            });
        });


    });

    describe('Negative Testing for BSB', async () => {

        const payload_nullbsb = [
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "1234567", swift_code: "ICBKAUBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "1234567", swift_code: "ICBKAUBJ", aba: "11122233A", bsb: ""}
        ];
        let errMsg0 = "'bsb' is required when bank country code is 'AU'";
        let pass0 = false;
        payload_nullbsb.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.bsb}'`, async () => {
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg0);
                    pass0 = true;
                });
                assert.strictEqual(pass0, true);
                console.log("Negative testing for BSB as null or undefined: " + payload.bsb + "\n");
            });
        });

        const payload_BSBN = [
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "1234567", swift_code: "ICBKAUBJ", aba: "11122233A", bsb: '123'}
        ];
        let errMsg = "Length of 'bsb' should be 6";
        let pass = false;
        payload_BSBN.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.bsb}'`, async () => {
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg);
                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for the length of BSB: " + payload.bsb + "(" + payload.bsb.length + ")\n");
            });
        });

    });



}); // Main describe
