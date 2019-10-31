const loginAPI = require('../lib/loginAPI');
const assert = require('assert');


describe('Testing for Account Number', () => {

    before('setting up', () => {
        // ANY SETUP
    });


    describe('Positive testing for Account Number', async () => {
        const payload_ANP = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Jo", account_number: "1", swift_code: "ICBCUSBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Jo", account_number: "123for789#$%34567", swift_code: "ICBCUSBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Jo", account_number: " 12345", swift_code: "ICBKAUBJ", aba: "11122233A", bsb: "123456"},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Jo", account_number: "12345678 ", swift_code: "ICBKAUBJ", aba: "11122233A", bsb: "123456"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Jo", account_number: "12345678", swift_code: "ICBKCNBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Jo", account_number: "12345678901234567890", swift_code: "ICBKCNBJ", aba: "11122233A"}
        ];

        let Msg = 'Bank details saved';
        payload_ANP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.account_number}'`, async ()=>{
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log("Positive testing for " + payload.bank_country_code + " the length of account_number : " + payload.account_number.length +"\n");
            });
        });



    });

    describe('Negative Testing for Account Number', async () => {

        const payload_nullaccountnumber = {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Sanmei", account_number: "", swift_code: "ICBKCNBJ", aba: "11122233A"};

        let errMsg0 = "'account_number' is required";
        let pass0 = false;
        it('When without Account Number', async ()=>{
            await loginAPI.login(payload_nullaccountnumber).catch(err => {
                assert.strictEqual(err.response.status, 400);
                assert.strictEqual(err.response.data.error, errMsg0);
                pass0 = true;
            });
            assert.strictEqual(pass0, true);
            console.log("Negative testing without Account Number.\n");
        });

        const payload_ANN = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Tom", account_number: "123456789012345678", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "12345", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "1234567890", swift_code: "", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Tom", account_number: "1234567", swift_code: "ICBKCNBJ", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Tom", account_number: "123456789012345678901", swift_code: "ICBKCNBJ", aba: ""},
        ];

        let errMsg_US = "Length of account_number should be between 1 and 17 when bank_country_code is 'US'";
        let errMsg_AU = "Length of account_number should be between 6 and 9 when bank_country_code is 'AU'";
        let errMsg_CN = "Length of account_number should be between 8 and 20 when bank_country_code is 'CN'";
        let pass = false;

        payload_ANN.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.account_number}'`, async ()=>{
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    if(payload.bank_country_code === "US"){
                        assert.strictEqual(err.response.data.error, errMsg_US);
                    }else if(payload.bank_country_code === "AU"){
                        assert.strictEqual(err.response.data.error, errMsg_AU);
                    }else if(payload.bank_country_code === "CN"){
                        assert.strictEqual(err.response.data.error, errMsg_CN);
                    }
                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for " + payload.bank_country_code + " the length of account_number : " + payload.account_number.length +"\n");
            });
        });

    });


}); // Main describe
