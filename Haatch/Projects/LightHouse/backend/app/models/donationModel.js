const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const collectionModel = require('./collectionModel');
const donations = require('../db/models/donations');
const userModel = require('./userModel');
const donationFunctions = require('../utils/donations');
const mongoose = require('mongoose');

//function to fetch one donation details
exports.fetchDonation = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                //fetching all details of the donation for the corresponding logged in user only
                //fetching only donation status for public user
                let donation = await donations.findOne({ _id: id }).lean();
                if (donation) {
                    //if donation status in database is processing the checking the status on payment gateway
                    let donation_data = {
                        _id: id,
                        status: donation.status == "processing" ? (await updateStatusInternal(donation)).status : donation.status
                    }
                    resolve({ "status": 200, "data": donation_data });
                }
                else {
                    reject({ "status": 404, "message": "Donation not found" });
                }
            }
            else {
                reject({ "status": 422, "message": "Donation ID / Order Number is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch all donations based on the filters
exports.fetchDonations = async function (token, collection_id, added_by, group_by, status, export_data, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let facet_data = [{ $sort: { _id: -1 } }];
            let donations_array;
            let filters = [];
            let pipeline = [];
            let group;
            let collection;
            if (collection_id) {
                filters.push({ _collection: mongoose.Types.ObjectId(collection_id) });
                collection = await collectionModel.fetchCollectionInternal(collection_id);
            }
            if (status) filters.push({ status: status });
            if (added_by && added_by != "me" && (decoded.user_type == "admin" || (collection && collection.added_by == decoded.user_id))) filters.push({ added_by: mongoose.Types.ObjectId(added_by) });
            else if (added_by == "me" || (decoded.user_type != "admin" && (collection && collection.added_by != decoded.user_id))) filters.push({ added_by: mongoose.Types.ObjectId(decoded.user_id) });
            if (group_by) {
                if (group_by == "collection") group = "$_collection";
                if (page && limit) {
                    facet_data.push({ $skip: ((page - 1) * limit) });
                    facet_data.push({ $limit: page * limit });
                }
                pipeline = [
                    { $match: filters.length > 0 ? { $and: filters } : {} },
                    {
                        $group: {
                            _id: group,
                            donations: { $sum: 1 },
                            total_amount: {
                                $sum: "$amount"
                            }
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            collection: "$_id",
                            total_amount: "$total_amount",
                            donations: "$donations",
                        }
                    },
                    {
                        $lookup: {
                            from: "collections",
                            localField: "collection",
                            foreignField: "_id",
                            as: "collection"
                        }
                    },
                    { $unwind: '$collection' },
                    {
                        $lookup: {
                            from: "users",
                            localField: "collection.added_by",
                            foreignField: "_id",
                            as: "collection.added_by"
                        }
                    },
                    { $unwind: '$collection.added_by' },
                    {
                        $lookup: {
                            from: "users",
                            localField: "collection.curators.curator",
                            foreignField: "_id",
                            as: "curators"
                        }
                    },
                    {
                        $project: {
                            "collection._id": true,
                            "collection.purpose": true,
                            "collection.description": true,
                            "collection.featured_video": true,
                            "collection.target_amount": true,
                            "collection.collected_amount": true,
                            "collection.curators": true,
                            "curators._id": true,
                            "curators.first_name": true,
                            "curators.last_name": true,
                            "curators.image": true,
                            "curators.email": true,
                            "curators.type": true,
                            "curators.occupation": true,
                            "collection.added_by.first_name": true,
                            "collection.added_by.last_name": true,
                            "collection.added_by.image": true,
                            "collection.added_by.email": true,
                            "collection.added_by.type": true,
                            "collection.added_by.occupation": true,
                            total_amount: true,
                            donations: true
                        }
                    },
                    {
                        $facet: {
                            data: facet_data,
                            count: [{ $count: "count" }]
                        }
                    }
                ];

                data = await donations.aggregate(pipeline);
                let count = data[0]?.count[0]?.count;

                //combining curators into collection
                data[0].data.forEach((obj) => {
                    obj.curators.forEach((curator) => {
                        let index = (obj.collection.curators).findIndex(x => String(x.curator) == String(curator._id));
                        if (index >= 0) obj.collection.curators[index].curator = curator;
                    });
                    delete obj["curators"];
                });

                donation_data = {
                    "count": count ? count : 0,
                    "donations": data[0]?.data
                };

            }
            else {
                if (export_data == true || export_data == "true") {
                    // donations_array = await donations.find(filters.length > 0 ? { $and: filters } : {}, '_id transation_id amount payment_template.platform.title status added_on').populate('_collection', '-_id purpose').populate('added_by', '-_id email').sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).lean();
                    donations_array = await donations.aggregate([
                        { $match: filters.length > 0 ? { $and: filters } : {} },
                        {
                            $lookup: {
                                from: "collections",
                                localField: "_collection",
                                foreignField: "_id",
                                as: "collection"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$collection",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "added_by",
                                foreignField: "_id",
                                as: "added_by"
                            }
                        },
                        {
                            "$unwind": {
                                "path": "$added_by",
                                "preserveNullAndEmptyArrays": true
                            }
                        },
                        {
                            //selecting data to be returned while exporting
                            $project: {
                                _id: false,
                                "Collection": "$collection.purpose",
                                "Transaction ID": "$transaction_id",
                                "Amount": "$amount",
                                "Status": "$status",
                                "Payment Method": "$payment_template.platform.title",
                                "Date": "$added_on",
                                "Donated by": "$added_by.email"
                            }
                        }

                    ]);
                    //formatting date
                    donations_array.forEach((obj) => {
                        obj["Date"] = dayjs(obj.Date).format("DD/MM/YYYY HH:mm");
                    })
                }
                else {
                    donations_array = await donations.find(filters.length > 0 ? { $and: filters } : {}, '-_id').populate('_collection').populate('added_by', 'first_name last_name image email occupation type').sort({ _id: -1 }).skip((page - 1) * limit).limit(limit).lean();
                }
                let count = await donations.count(filters.length > 0 ? { $and: filters } : null);
                donation_data = {
                    "count": count,
                    "donations": donations_array
                };
            }
            resolve({ "status": 200, "data": donation_data });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to add donation
exports.addDonation = async function (token, collection_id, amount, template) {
    return new Promise(async (resolve, reject) => {
        try {
            if (collection_id && amount && template) {
                //checking donaton status
                let collection = await collectionModel.fetchCollectionInternal(collection_id);
                if (collection.status == "active" || collection.status == "private") {
                    //fetching payment credentials of the collection
                    let payment_template = await userModel.fetchOnePaymentInternal(template);
                    let new_donation = new donations({
                        _collection: collection_id,
                        amount: amount,
                        status: "pending",
                        payment_template: payment_template,
                        transaction_id: null,
                        added_on: dayjs().format(),
                        added_by: token ? jwt.decode(token).user_id : null,
                    });
                    let donation = await new_donation.save();
                    let payment_data = await donationFunctions.donate(collection, donation, payment_template);
                    //updating payment gateway response in database
                    let data = await donations.updateOne({ _id: donation._id }, { $set: payment_data });
                    if (data.matchedCount === 1 && data.modifiedCount == 1) resolve({ "status": 200, "data": payment_data.payment_url });
                    else if (data.matchedCount === 0) reject({ "status": 404, "message": "Donation not found" });
                    else reject({ "status": 400, "message": "Donation response update failed" });
                }
                else {
                    reject({ "status": 403, "message": "Collection not active" })
                }
            }
            else {
                if (!collection_id) reject({ "status": 422, "message": "Collection ID is required" });
                if (!amount) reject({ "status": 422, "message": "Amount is required" });
                if (!template) reject({ "status": 422, "message": "Payment template is required" });
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

const fetchProcessingInternal = exports.fetchProcessingInternal = async function () {
    return new Promise(async (resolve, reject) => {
        try {
            let donations_data = await donations.find({ status: "processing" }).lean();
            resolve(donations_data);
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

const updateStatusInternal = exports.updateStatusInternal = async function (donation) {
    return new Promise(async (resolve, reject) => {
        try {
            let payment_template = await userModel.fetchOnePaymentInternal(donation.payment_template._id);
            let status = await donationFunctions.status(donation, payment_template);
            if (status != "processing") {
                // updating donation status
                donation["status"] = status;
                let donation_data = await donations.updateOne({ _id: donation._id }, { status: status });
                if (donation_data.matchedCount === 0) reject("Donation not found");
                else if (donation_data.modifiedCount === 0) reject("Donation status update failed");

                // updating collection collected amount if the status is success
                if (status == "success") {
                    let collection_data = await collectionModel.updateCollectedAmountInternal(donation._collection, donation.amount);
                    if (collection_data.matchedCount === 0) reject("Collection not found");
                    else if (collection_data.modifiedCount === 0) reject("Donation amount update failed");
                }
            }
            resolve(donation);
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

const addDonationInternal = exports.addDonationInternal = async function (donation_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let donation = await (new donations(donation_data)).save();
            resolve(donation);
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

const updateDonationInternal = exports.updateDonationInternal = async function (filters, donation_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await donations.updateOne(filters, {$set: donation_data});
            if (data.matchedCount === 1 && data.modifiedCount == 1) resolve("Donation updated successfully");
            else if (data.matchedCount === 0) reject("Donation not found");
            else reject("Donation updating failed");
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}