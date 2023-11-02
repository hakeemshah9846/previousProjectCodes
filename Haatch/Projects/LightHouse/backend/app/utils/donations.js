"use strict";
const axios = require("axios");
const Cryptr = require('cryptr');
const crypto = require('crypto');

const cryptr = new Cryptr(process.env.PRIVATE_KEY);

const initDonation = exports.initDonation = async function (url, method, data, params) {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                method: method,
                url: url,
            }

            if (data) config["data"] = data;
            if (params) config["params"] = params;

            axios(config).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                if (error.response) reject(error.response.data);
                else reject(error.message);
            });
        }
        catch (error) {
            reject(error);
        }
    })
};

const checkStatus = exports.checkStatus = async function (url, method, data, params) {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                method: method,
                url: url,
            }

            if (data) config["data"] = data;
            if (params) config["params"] = params;

            axios(config).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                if (error.response) reject(error.response.data);
                else reject(error.message);
            });
        }
        catch (error) {
            reject(error);
        }
    })
};

exports.donate = async function (collection, donation, payment_template) {
    return new Promise(async (resolve, reject) => {
        try {
            if (payment_template.platform.gateway == "sber-bank") {
                let payload = {
                    orderNumber: donation._id, // orderNumber will be the the donation's id
                    amount: donation.amount * 100,
                    returnUrl: `${process.env.PAYMENT_RETURN_URL}?collection=${collection._id}&donation=${donation._id}`,
                    failUrl: `${process.env.PAYMENT_RETURN_URL}?collection=${collection._id}&donation=${donation._id}`
                }
                payment_template.platform.feilds.forEach((obj) => {
                    if (obj.secure == true) payload[obj.value] = cryptr.decrypt(payment_template.platform_data[obj.value]);
                    else payload[obj.value] = payment_template.platform_data[obj.value];
                });
                let payment_response = await initDonation(payment_template.platform.payment_url, "POST", null, payload);
                let payment_data = {
                    status: "processing",
                    transaction_id: payment_response.orderId,
                    payment_url: payment_response.formUrl,
                    payment_response: payment_response
                }
                resolve(payment_data);
            }
            else if (payment_template.platform.gateway == "tinkoff") {
                let payload = {
                    OrderId: donation._id,
                    Amount: donation.amount * 100,
                    SuccessURL: `${process.env.PAYMENT_RETURN_URL}?collection=${collection._id}&donation=${donation._id}`,
                    FailURL: `${process.env.PAYMENT_RETURN_URL}?collection=${collection._id}&donation=${donation._id}`
                }
                payment_template.platform.feilds.forEach((obj) => {
                    if (obj.secure == true) payload[obj.value] = cryptr.decrypt(payment_template.platform_data[obj.value]);
                    else payload[obj.value] = payment_template.platform_data[obj.value];
                });

                let payment_response = await initDonation(payment_template.platform.payment_url, "POST", payload, null);
                let payment_data = {
                    status: "processing",
                    transaction_id: payment_response.PaymentId,
                    payment_url: payment_response.PaymentURL,
                    payment_response: payment_response
                }
                // payload["Token"] = crypto.createHash('sha256', process.env.PRIVATE_KEY)
                // .update((donation.amount * 100)+String(payment_template.platform.description)+String(donation._id)+String(payload["Password"])+String(payload["TerminalKey"]))
                // .digest('hex');
                // // payload["Token"] = crypto.createHash('sha256', process.env.PRIVATE_KEY)
                // // .update('How are you?')
                // // .digest('hex');
                resolve(payment_data);
            }
            else reject("Donation Failed")
        }
        catch (error) {
            reject(error);
        }
    })
};

exports.status = async function (donation, payment_template) {
    return new Promise(async (resolve, reject) => {
        try {
            if (payment_template.platform.gateway == "sber-bank") {
                let status = donation.status;
                //decrypting secure feilds
                let payment_feilds = {}
                payment_template.platform.feilds.forEach((obj) => {
                    if (obj.secure == true) payment_feilds[obj.value] = cryptr.decrypt(payment_template.platform_data[obj.value]);
                    else payment_feilds[obj.value] = payment_template.platform_data[obj.value];
                });
                let payload = {
                    userName: payment_feilds["userName"],
                    password: payment_feilds["password"],
                    orderNumber: donation._id,
                    language: "en"
                }
                let status_response = await checkStatus(payment_template.platform.status_url, "POST", null, payload);
                if (status_response && status_response.orderStatus == 0) status = "success";
                if (status_response && status_response.orderStatus == 1) status = "processing";
                if (status_response && status_response.orderStatus == 2) status = "success";
                if (status_response && status_response.orderStatus == 3) status = "canceled";
                if (status_response && status_response.orderStatus == 4) status = "refunded";
                if (status_response && status_response.orderStatus == 5) status = "processing";
                if (status_response && status_response.orderStatus == 6) status = "declined";
                resolve(status);
            }
            else if (payment_template.platform.gateway == "tinkoff") {
                let status = donation.status;
                //decrypting secure feilds
                let payment_feilds = {}
                payment_template.platform.feilds.forEach((obj) => {
                    if (obj.secure == true) payment_feilds[obj.value] = cryptr.decrypt(payment_template.platform_data[obj.value]);
                    else payment_feilds[obj.value] = payment_template.platform_data[obj.value];
                });
                let payload = {
                    PaymentId: donation.transaction_id,
                    TerminalKey: payment_feilds["TerminalKey"],
                    Token: crypto.createHash('sha256', process.env.PRIVATE_KEY)
                    .update((donation.amount * 100)+String(payment_template.platform.description)+String(donation._id)+String(payment_feilds["Password"])+String(payment_feilds["TerminalKey"]))
                    .digest('hex')
                }
                let status_response = await checkStatus(payment_template.platform.status_url, "POST", null, payload);
                if (status_response && status_response.orderStatus == 0) status = "success";
                if (status_response && status_response.orderStatus == 1) status = "processing";
                if (status_response && status_response.orderStatus == 2) status = "success";
                if (status_response && status_response.orderStatus == 3) status = "canceled";
                if (status_response && status_response.orderStatus == 4) status = "refunded";
                if (status_response && status_response.orderStatus == 5) status = "processing";
                if (status_response && status_response.orderStatus == 6) status = "declined";
                resolve(status);
            }
            else reject("Donation Failed")
        }
        catch (error) {
            reject(error);
        }
    })
};