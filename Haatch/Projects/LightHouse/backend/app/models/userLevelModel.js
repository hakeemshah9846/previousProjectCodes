const userLevels = require('../db/models/user_levels');

//function to fetch one user levels
exports.fetchOne = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await userLevels.findOne({ _id: id });
            if (data) {
                resolve({ "status": 200, "data": data });
            }
            else {
                reject({ "status": 404, "message": "User level not found" })
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch all user levels
exports.fetchAll = async function (page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let user_levels = await userLevels.find().sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
            resolve({ "status": 200, "data": user_levels });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}
