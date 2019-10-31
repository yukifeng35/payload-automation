
const assert = require('assert');
const loginAPI = require('../lib/loginAPI');


describe('Testing for Swift Code', () => {

    before('setting up', () => {
        // ANY SETUP
    });



    describe('Positive testing for Swift Code', async () => {
        const payload_SCP = [
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Jo", account_number: "123", swift_code: "ICBCUSBJ", aba: "11122233A"},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: " T*&y lt! ", account_number: "123456788", swift_code: " CBKCNBJ*^", aba: "11122233A"},
            {payment_method: "LOCAL", bank_country_code: "CN", account_name: " T*&y lt! ", account_number: "123456788", swift_code: "", aba: "11122233A"}
        ];

        let Msg = 'Bank details saved';
        payload_SCP.forEach(async (payload) => {
            it(`Should be able to pay with '${payload.swift_code}'`, async ()=>{
                const response = await loginAPI.login(payload);
                assert.strictEqual(response.status, 200);
                assert.strictEqual(response.data.success, Msg);
                console.log("Positive testing for the length of swift_code: " + payload.swift_code + " (" + payload.swift_code.length + ")\n");
            });
        });

    });

    describe('Negative Testing for Swift Code', async () => {

        const payload_nullSwiftcode = {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Tom", account_number: "123456788", swift_code: "", aba: "11122233A"};
        let errMsg0 = "'swift_code' is required when payment method is 'SWIFT'";
        it('When Swift Code is Null', async ()=>{
            await loginAPI.login(payload_nullSwiftcode).catch(err => {
                assert.strictEqual(err.response.status, 400);
                assert.strictEqual(err.response.data.error, errMsg0);
                pass = true;
            });
            assert.strictEqual(pass, true);
            console.log("Negative testing for Null swift code when 'SWIFT'.\n");
        });


        const payload_SCN = [
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Tom", account_number: "1234567", swift_code: "ICBKCNB", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Tom", account_number: "1234567", swift_code: "ICBKCNBjioiu", aba: ""}
        ];
        let errMsg_length = "Length of 'swift_code' should be either 8 or 11";
        let pass_length = false;
        payload_SCN.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.swift_code}'`, async ()=>{
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    assert.strictEqual(err.response.data.error, errMsg_length);
                    pass_length = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for Swift Code length " + payload.swift_code.length +"\n");
            });
        });



        const payload_swiftcode2 = [
            {payment_method: "SWIFT", bank_country_code: "CN", account_name: "Tom", account_number: "1234567", swift_code: "ICBKNBMK", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "AU", account_name: "Tom", account_number: "1234567", swift_code: "ICBKCNBOK", aba: ""},
            {payment_method: "SWIFT", bank_country_code: "US", account_name: "Tom", account_number: "1234567", swift_code: "ICBKCNBIJ", aba: ""}

        ];

        let errMsg_CN = "The swift code is not valid for the given bank country code: CN";
        let errMsg_AU = "The swift code is not valid for the given bank country code: AU";
        let errMsg_US = "The swift code is not valid for the given bank country code: US";
        let pass = false;

        payload_swiftcode2.forEach(async (payload) => {
            it(`Should NOT be able to pay with '${payload.swift_code}'`, async ()=>{
                await loginAPI.login(payload).catch(err => {
                    assert.strictEqual(err.response.status, 400);
                    if(payload.bank_country_code === 'CN'){
                        assert.strictEqual(err.response.data.error, errMsg_CN);
                    }else if(payload.bank_country_code === 'AU'){
                        assert.strictEqual(err.response.data.error, errMsg_AU);
                    }else if(payload.bank_country_code === 'CN'){
                        assert.strictEqual(err.response.data.error, errMsg_US);
                    }

                    pass = true;
                });
                assert.strictEqual(pass, true);
                console.log("Negative testing for Swift Code Non-Matching " + payload.bank_country_code + ' :' + payload.swift_code + "\n");
            });
        });

    });


}); // Main describe
