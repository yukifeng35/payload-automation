const axios = require('axios');
const assert = require('assert');


module.exports = {

    getRateAPI: async (duration,sellCcy,buyCcy) => {

        const getRatePath = duration + '/?sellCcy=' + sellCcy + '&buyCcy=' + buyCcy;
        //console.log(getRatePath);
        const rateApiClient = axios.create({
            baseURL: 'https://www.airwallex.com/api/fxRate/'
        });
        let tempResp;

        tempResp = await rateApiClient.get(getRatePath);
        return tempResp;
    },

    getCcyPair: (currencyPair) => {

        const Ccy = [];
        for(let i=0; i<currencyPair.length; i++){
            const sellCcy = currencyPair[i].substring(0,3);
            //console.log(sellCcy);
            const buyCcy = currencyPair[i].substring(3,6);
            //console.log(buyCcy);
            Ccy[i] = {sellCcy: sellCcy, buyCcy: buyCcy};
            //console.log(Ccy);
        } // forEach
        return Ccy;

    },


    getAssertion: (respData, sellCcy, buyCcy) => {

        assert.strictEqual(respData.sellCcy, sellCcy);
        assert.strictEqual(respData.buyCcy, buyCcy);
        assert.strictEqual(respData.ccyPair, sellCcy+buyCcy);
        assert.strictEqual(respData.source, "AWX");
        assert.strictEqual(respData.rate > 0.1 ,true);

    }

};