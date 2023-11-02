const socialMedia = require('../db/models/social_medias');

//function to fetch one social media platform
exports.fetchOne = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await socialMedia.findOne({ _id: id });
            if (data) {
                resolve({ "status": 200, "data": data });
            }
            else {
                reject({ "status": 404, "message": "Social media platform not found" })
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch all social media platform
exports.fetchAll = async function (page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let social_media = await socialMedia.find().sort({ _id: -1 }).skip((page-1)*limit).limit(page*limit);
            let count = await socialMedia.count();
            let social_medias = {
                "count": count,
                "social_medias": social_media
            };
            resolve({ "status": 200, "data": social_medias });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}
