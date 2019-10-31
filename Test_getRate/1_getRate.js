
const currencyPair = require('./testdata').currencyPair;
const getRateFunc = require('../lib/getRateFunctions');
const assert = require('assert');

let durations = ['30days','7days','12hours','liveRate'];

describe('Testing for get Rate', async () => {

    before('setting up', () => {
        // ANY SETUP
    });

    const CcyPair = getRateFunc.getCcyPair(currencyPair);

    for(let i=0; i<durations.length; i++) {
        CcyPair.forEach(async (Ccy) => {
            it(`Testing rate for ${durations[i]} with CurrencyPair as ${Ccy.sellCcy}${Ccy.buyCcy}`, async () => {
                const response = await getRateFunc.getRateAPI(durations[i], Ccy.sellCcy, Ccy.buyCcy);
                assert.strictEqual(response.status, 200);
                Array.isArray(response.data)
                    ? getRateFunc.getAssertion(response.data[0], Ccy.sellCcy, Ccy.buyCcy)
                    : getRateFunc.getAssertion(response.data, Ccy.sellCcy, Ccy.buyCcy);
                console.log(`Pass: Testing rate for ${durations[i]} with CurrencyPair as ${Ccy.sellCcy}${Ccy.buyCcy}\n`);
            });
        });

    }
});
