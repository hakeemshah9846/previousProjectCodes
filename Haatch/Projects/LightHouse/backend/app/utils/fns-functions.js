"use strict";
const axios = require("axios");

exports.fetchInn = async function (request) {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                method: "GET",
                url: process.env.FNS_URL,
                params: {
                    req: request,
                    key: process.env.FNS_KEY
                }
            }
            axios(config).then((response) => {
                resolve(JSON.stringify(response.data));
            }).catch((error) => {
                if (error.response) reject(error.response.data);
                else reject(error.message);
            });
        }
        catch (error) {
            console.log(error);
            reject(false);
        }
    })
};