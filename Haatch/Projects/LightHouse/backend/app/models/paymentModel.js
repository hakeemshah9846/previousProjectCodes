const paymentPlatforms = require('../db/models/payment_platforms');

exports.fetchOne = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let payment_platform = await paymentPlatforms.findOne({_id: id});
            if (payment_platform) {
                resolve({ "status": 200, "data": payment_platform });
            }
            else {
                reject({ "status": 404, "message": "Payment platform not found" })
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchAll = async function (status, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let filter = status ? {status: status} : null;
            let payment_platforms = await paymentPlatforms.find(filter).sort({ order: 1 }).skip((page-1)*limit).limit(page*limit);
            let count = await paymentPlatforms.count();
            let payment_data = {
                "count": count,
                "payment_platforms": payment_platforms
            };
            resolve({ "status": 200, "data": payment_data });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}


// For internal usage only.
// Please do not map the below function to any public API end-points as it is intented to use only
// for the internal functionalities and the response data may contain highly confidential informations
// Mapping these to public APIs will affect the security of the project and privacy of the users

const fetchOneInternal = exports.fetchOneInternal = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let payment_platform = await paymentPlatforms.findOne({_id: id}).lean();
            if (payment_platform) {
                resolve(payment_platform);
            }
            else {
                reject("Payment platform not found")
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}