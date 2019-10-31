const axios = require('axios');

module.exports = {

    login: async (pld) => {
        const authUrl = '/bank';
        const payloadAPI = axios.create({
            baseURL: 'http://preview.airwallex.com:30001'
        });
        let tempResp;
        tempResp = await payloadAPI.post(authUrl, pld, {
            headers: {'Content-Type': 'application/json'}
        });
        return tempResp;

    },

};