
const assert = require('assert');
const loginAPI = require('../lib/loginAPI');


describe('Testing for ABA', () => {


    before('setting up', () => {
        // ANY SETUP
    });


    describe('Positive testing for ABA', async () => {
        const payload_ABAP = [
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "123456", swift_code: "ICBCAUBJ", bsb: "12&*56"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: " T*&y lt! ", account_number: "123456788", swift_code: "ICBKCNBJ"},
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Tom", account_number: "123456", swift_code: "ICBCUSBJ", aba: "12&*5687 "},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "123456", swift_code: "ICBCAUBJ", aba: "1234", bsb: "12&*56"},
        ];

        let Msg = 'Bank details saved';
        payload_ABAP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.aba}'`, async () => {
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log("Positive testing for ABA when Country Code is: " +payload.bank_country_code + "(" + payload.aba + ")\n");
            });
        });


    });

    describe('Negative Testing for ABA', async () => {

        const payload_nullaba = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Tom", account_number: "1234567", swift_code: "ICBKUSBJ", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Tom", account_number: "1234567", swift_code: "ICBKUSBJ"}
        ];
        let errMsg0 = "'aba' is required when bank country code is 'US'";
        let pass0 = false;
        payload_nullaba.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.aba}'`, async () => {
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg0);
                    pass0 = true;
                });
                assert.strictEqual(pass0, true);
                console.log("Negative testing for ABA as null or undefined: " + payload.aba + "\n");
            });
        });

        const payload_ABAN = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Tom", account_number: "1234567", swift_code: "ICBKUSBJ", aba: "111122233A"}
        ];
        let errMsg = "Length of 'aba' should be 9";
        let pass = false;
        payload_ABAN.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.aba}'`, async () => {
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg);
                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for the length of ABA: " + payload.aba + "(" + payload.aba.length + ")\n");
            });
        });

    });



}); // Main describe
