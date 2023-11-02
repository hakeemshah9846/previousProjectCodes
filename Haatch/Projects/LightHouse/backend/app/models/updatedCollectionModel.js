const jwt = require('jsonwebtoken');
const updated_collections = require('../db/models/updated_collections');
const collectionModel = require('./collectionModel');
const mongoose = require('mongoose');

//function to fetch one update
exports.fetchUpdatedCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let data = await updated_collections.findOne({ _id: id }).populate({ path: '_collection', populate: { path: 'added_by' } });
            if (data) {
                //checking if the user is assigned as a curator for the collection
                let curators = data._collection.curators.map(obj => String(obj.curator));
                if (decoded.user_type == "admin" || (curators).includes(decoded.user_id) || data._collection.added_by.supporting == mongoose.Types.ObjectId(decoded.user_id)) {
                    resolve({ "status": 200, "data": data });
                }
                else {
                    reject({ "status": 403, "message": "You are not allowed to view this update" })
                }
            }
            else {
                reject({ "status": 404, "message": "Updated collection not found" })
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch all update
exports.fetchUpdatedCollections = async function (token, collection, status, keyword, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let filters = [];
            let facet_data = [{ $sort: { _id: -1 } }];
            let decoded = jwt.decode(token);
            if (status) filters.push({ status: status });
            if (collection) filters.push({ _collection: collection });
            if (keyword) filters.push({ purpose: { $regex: keyword, $options: 'i' } });
            if (page && limit) {
                facet_data.push({ $skip: ((page - 1) * limit) });
                facet_data.push({ $limit: page * limit });
            }
            let data = await updated_collections.aggregate([
                { $match: filters.length > 0 ? { $and: filters } : {} },
                {
                    $lookup: {
                        from: "users",
                        localField: "added_by",
                        foreignField: "_id",
                        as: "added_by"
                    }
                },
                { $unwind: '$added_by' },
                {
                    $lookup: {
                        from: "collections",
                        localField: "_collection",
                        foreignField: "_id",
                        as: "_collection"
                    }
                },
                { $unwind: '$_collection' },
                {
                    $lookup: {
                        from: "users",
                        localField: "_collection.added_by",
                        foreignField: "_id",
                        as: "_collection.added_by"
                    }
                },
                { $unwind: '$_collection.added_by' },
                { $match: { $or: [{ "_collection.curators.curator": mongoose.Types.ObjectId(decoded.user_id) }, { "_collection.added_by.supporting": mongoose.Types.ObjectId(decoded.user_id) }] } },
                { $project: 
                    { 
                        "purpose": true,
                        "description": true,
                        "featured_image": true,
                        "featured_video": true,
                        "files": true,
                        "status": true,
                        "target_amount": true,
                        "added_on": true,
                        "updated_on": true,
                        "updated_by": true,
                        "deleted_on": true,
                        "deleted_by": true,
                        "added_by._id": true,
                        "added_by.first_name": true,
                        "added_by.last_name": true,
                        "added_by.email": true,
                        "added_by.type": true,
                        "added_by.account_type": true,
                        "_collection.purpose": true,
                        "_collection.description": true,
                        "_collection.featured_image": true,
                        "_collection.featured_video": true,
                        "_collection.files": true,
                        "_collection.curators": true,
                        "_collection.payment_templates": true,
                        "_collection.status": true,
                        "_collection.updates": true,
                        "_collection.target_amount": true,
                        "_collection.collected_amount": true,
                        "_collection.updated_data": true,
                        "_collection.permalink": true,
                        "_collection.payment_purpose": true,
                        "_collection.added_on": true,
                        "_collection.added_by._id": true,
                        "_collection.added_by.first_name": true,
                        "_collection.added_by.last_name": true,
                        "_collection.added_by.email": true,
                        "_collection.added_by.type": true,
                        "_collection.added_by.account_type": true,
                        "_collection.updated_on": true,
                        "_collection.updated_by": true,
                        "_collection.deleted_on": true,
                        "_collection.deleted_by": true,
                    }
                },
                {
                    $facet: {
                        data: facet_data,
                        count: [{ $count: "count" }]
                    }
                }
            ]);

            let count = data[0]?.count[0]?.count;

            let updated_data = {
                "count": count ? count : 0,
                "updates": data[0].data
            };
            resolve({ "status": 200, "data": updated_data });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function for curator to accept update for a collection
exports.acceptUpdatedCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let updated_data = await updated_collections.findOne({ _id: id }).populate({path: '_collection', populate: {path: 'added_by'}}).lean();
            if (updated_data) {
                let collection = updated_data._collection;
                //checking if the logged-in user is admin or the organization or curator for the collection and the curator has accepted the collection request
                let data = collection.curators.filter((obj) => obj.status == "accepted");
                curators = data.map((obj) => String(obj.curator));
                if (curators.includes(decoded.user_id) || decoded.user_type == "admin" || collection.added_by.supporting == decoded.user_id) {
                    //updating collection data
                    if (updated_data.purpose) collection['purpose'] = updated_data.purpose;
                    if (updated_data.description) collection['description'] = updated_data.description;
                    if (updated_data.featured_image) collection['featured_image'] = updated_data.featured_image;
                    if (updated_data.featured_video) collection['featured_video'] = updated_data.featured_video;
                    if (updated_data.target_amount) collection['target_amount'] = updated_data.target_amount;
                    collection['updated_data'] = null;
                    let data = await collectionModel.updateCollectionInternal(collection._id, collection);
                    if (data.matchedCount === 1 && data.modifiedCount == 1) {
                        //updating status
                        let status_data = await updated_collections.updateOne({ _id: id }, { status: "accepted" });
                        if (status_data.matchedCount === 1 && status_data.modifiedCount == 1) resolve({ "status": 200, "message": "Update accepted successfully" });
                        else if (status_data.matchedCount === 0) reject({ "status": 404, "message": "Updated collection not found" });
                        else reject({ "status": 400, "message": "Update approving failed" });
                    }
                    else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection not found" });
                    else reject({ "status": 400, "message": "Collection updating failed" });
                }
                else {
                    reject({ "status": 403, "message": "You are not allowed to accept this update" });
                }
                resolve({ "status": 200, "data": updated_data });
            }
            else {
                reject({ "status": 404, "message": "Updated collection not found" });
            }
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

//function to add update request for a collection
const addUpdate = exports.addUpdate = async function (collection_id, collection_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await updated_collections.findOneAndUpdate({ _collection: collection_id }, collection_data, { upsert: true, new: true });
            if (data) resolve(data);
            else reject("Collection updating failed");
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}