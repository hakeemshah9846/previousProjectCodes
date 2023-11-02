const informations = require('../db/models/informations');

exports.fetchInformations = async function (title) {
    return new Promise(async (resolve, reject) => {
        try {
            let filter = title ? { title: title } : null;
            let information = await informations.findOne(filter);
            if (information) resolve({ "status": 200, "data": information });
            else reject({ "status": 404, "data": "Information not found" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}