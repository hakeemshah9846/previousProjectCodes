const jwt = require('jsonwebtoken');
const dayjs = require('dayjs')
const requests = require('../db/models/requests');
const userModel = require('./userModel');

exports.fetchOneRequest = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let request = await requests.findOne({ _id: id }).populate('added_by updated_by', 'first_name last_name email type occupation');
            if (request && (decoded.user_type == "admin" || String(request.added_by._id) == decoded.user_id)) resolve({ "status": 200, "data": request });
            else if (request && (decoded.user_type != "admin" || request.added_by != decoded.user_id)) reject({ "status": 403, "data": "You are not allowed to view this request" });
            else reject({ "status": 404, "data": "Request not found" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchRequests = async function (token, status, added_by, type, change_from, change_to, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let filters = [];
            let user = await userModel.fetchOneInternal(decoded.user_id);
            if (status) filters.push({ status: status });
            if (type) filters.push({ type: type });
            if (change_from) filters.push({ change_from: change_from });
            if (change_to) filters.push({ change_to: change_to });
            if (user.type == "admin") {
                //fetching request according to the added_by filter
                if (added_by && added_by != "me") filters.push({ added_by: added_by });
                else if (added_by && added_by == "me") filters.push({ added_by: user._id });
            }
            else if (user.account_type == "organization") filters.push({ change_to: user._id }); //only showing request related to the organization
            else filters.push({ added_by: user._id }); //fetching request added by the logged in user only
            let requests_array = await requests.find(filters.length > 0 ? { $and: filters } : null).populate('added_by updated_by', 'first_name last_name email type image occupation').sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
            let count = await requests.count(filters.length > 0 ? { $and: filters } : null);

            let request_data = {
                "count": count,
                "requests": requests_array
            };
            resolve({ "status": 200, "data": request_data });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.addRequest = async function (token, type, change_to) {
    return new Promise(async (resolve, reject) => {
        try {
            if (type && change_to) {
                let decoded = jwt.decode(token);
                // checking if the user have filled all the mandatory profile informations
                let user = await userModel.fetchOneInternal(decoded.user_id);
                let profile_complete = user.first_name && user.last_name && user.description && user.email && user.occupation && user.date_of_birth && (user.passport && user.passport.files.length > 0);
                if (user && user.status == "active" && profile_complete && ((type == "user_type" && change_to == "curator") ? user.social_media.length > 0 : true) && ((type == "supporting") ? user.type == "volunteer" && user.account_type == "organization" : true)) {
                    let user_data = {
                        type: type,
                        change_to: change_to,
                        status: "pending",
                        added_on: dayjs().format(),
                        added_by: decoded.user_id,
                    }
                    //updating change_from of the request
                    if (type == "user_type") user_data["change_from"] = user.user_type;
                    else if (type == "supporting") user_data["change_from"] = user.supporting;
                    else return reject({ "status": 422, "message": "Invalid Type" });

                    await (new requests(user_data)).save();
                    resolve({ "status": 200, "message": "Request added Successfully" });
                }
                else if (!user) reject({ "status": 404, "message": "User not found" });
                else if (!(user.status == "active")) reject({ "status": 403, "message": "You are not allowed to make this request" });
                else if (!(user.first_name)) reject({ "status": 422, "message": "User profile is not complete - first name is required" });
                else if (!(user.last_name)) reject({ "status": 422, "message": "User profile is not complete - last name is required" });
                else if (!(user.description)) reject({ "status": 422, "message": "User profile is not complete - description is required" });
                else if (!(user.email)) reject({ "status": 422, "message": "User profile is not complete - email is required" });
                else if (!(user.occupation)) reject({ "status": 422, "message": "User profile is not complete - occupation is required" });
                else if (!(user.date_of_birth)) reject({ "status": 422, "message": "User profile is not complete - date of birth is required" });
                else if (!(user.passport && user.passport.code && user.passport.number && user.passport.issued_region && user.passport.issue_date && user.passport.files.length > 0)) reject({ "status": 422, "message": "User profile is not complete - passport is required" });
                else if (!((type == "user_type" && change_to == "curator") && user.social_media.length > 0)) reject({ "status": 422, "message": "User profile is not complete - social media is required" });
                else if(!(type == "supporting" && (user.type == "volunteer" && user.account_type == "organization"))) reject({ "status": 403, "message": "You are not allowed to make this request" });
                else reject({ "status": 400, "message": "Something went wrong" });
            }
            else {
                if (!type) reject({ "status": 422, "message": "Type is required" });
                if (!change_to) reject({ "status": 422, "message": "Upgrade To is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.updateRequest = async function (token, id, type, change_to) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id && type && change_to) {
                let decoded = jwt.decode(token);
                // checking if the user have filled all the mandatory profile informations
                let user = await userModel.fetchOneInternal(decoded.user_id);
                let profile_complete = user.first_name && user.last_name && user.description && user.email && user.occupation && user.date_of_birth && (user.passport && user.passport.files.length > 0);
                if (user && user.status == "active" && profile_complete && ((type == "user_type" && change_to == "curator") ? user.social_media.length > 0 : true) && ((type == "supporting") ? user.type == "volunteer" && user.account_type == "organization" : true)) {
                    let request_data = {
                        type: type,
                        change_to: change_to,
                        status: "pending",
                        updated_on: dayjs().format(),
                        updated_by: decoded.user_id,
                    }

                    //updating change_from of the request
                    if (type == "user_type") user_data["change_from"] = user.user_type;
                    else if (type == "supporting") user_data["change_from"] = user.supporting;
                    else return reject({ "status": 422, "message": "Invalid Type" });

                    let data = await requests.updateOne({ $and: [{ _id: id }, { added_by: decoded.user_id }] }, { $set: request_data });
                    if (data.modifiedCount === 1) resolve({ "status": 200, "message": "Request updated successfully" });
                    else if (data.matchedCount === 0) reject({ "status": 404, "message": "Request not found" });
                    else reject({ "status": 400, "message": "Request update failed" });
                }
                else if (!user) reject({ "status": 404, "message": "User not found" });
                else if (!(user.status == "active")) reject({ "status": 403, "message": "You are not allowed to make this request" });
                else if (!(user.first_name)) reject({ "status": 422, "message": "User profile is not complete - first name is required" });
                else if (!(user.last_name)) reject({ "status": 422, "message": "User profile is not complete - last name is required" });
                else if (!(user.description)) reject({ "status": 422, "message": "User profile is not complete - description is required" });
                else if (!(user.email)) reject({ "status": 422, "message": "User profile is not complete - email is required" });
                else if (!(user.occupation)) reject({ "status": 422, "message": "User profile is not complete - occupation is required" });
                else if (!(user.date_of_birth)) reject({ "status": 422, "message": "User profile is not complete - date of birth is required" });
                else if (!(user.passport && user.passport.code && user.passport.number && user.passport.issued_region && user.passport.issue_date && user.passport.files.length > 0)) reject({ "status": 422, "message": "User profile is not complete - passport is required" });
                else if (!((type == "user_type" && change_to == "curator") && user.social_media.length > 0)) reject({ "status": 422, "message": "User profile is not complete - social media is required" });
                else if(!(type == "supporting" && (user.type == "volunteer" && user.account_type == "organization"))) reject({ "status": 403, "message": "You are not allowed to make this request" });
                else reject({ "status": 400, "message": "Something went wrong" });
            }
            else {
                if (!id) reject({ "status": 422, "message": "Request ID is required" });
                if (!type) reject({ "status": 422, "message": "Type is required" });
                if (!change_to) reject({ "status": 422, "message": "Upgrade To is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.deleteRequest = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                let request_data = {
                    status: "deleted",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id,
                }
                let data = await requests.updateOne({ $and: [{ _id: id }, { status: "pending" }, { added_by: decoded.user_id }] }, { $set: request_data });
                if (data.modifiedCount === 1) resolve({ "status": 200, "message": "Request deleted successfully" });
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "Request not found" });
                else reject({ "status": 400, "message": "Request deletion failed" });
            }
            else if (!id) reject({ "status": 422, "message": "Request ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.acceptRequest = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                // checking if the user have filled all the mandatory profile informations
                let user = await userModel.fetchOneInternal(decoded.user_id);
                let request = await requests.findOne({ _id: id }).populate('added_by');
                let profile_complete = user.first_name && user.last_name && user.image && user.gender && user.phone && user.email && user.occupation && user.date_of_birth && user.country && (user.passport && user.passport.files.length > 0);
                if (user && user.status == "active" && (decoded.user_type == "admin" || (type == "supporting" && request.change_to == decoded.user_id)) && profile_complete && ((request.type == "user_type" && request.change_to == "curator") ? user.social_media.length > 0 : true)) {
                    let user_data = {
                        updated_on: dayjs().format(),
                        updated_by: decoded.user_id,
                    }

                    //checking type of the request
                    if (request.type == "user_type") user_data["type"] = request.change_to;
                    else if (request.type == "supporting") user_data["supporting"] = request.change_to;
                    else return reject({ "status": 403, "message": "Invalid Type" });

                    let user_update = await userModel.updateOneInternal(request.added_by._id, user_data);
                    let request_data = {
                        status: "accepted",
                        updated_on: dayjs().format(),
                        updated_by: decoded.user_id,
                    }
                    let request_update = await requests.updateOne({ _id: id }, { $set: request_data });
                    if (request_update.modifiedCount === 1 && user_update.modifiedCount === 1) resolve({ "status": 200, "message": "Request accepted successfully" });
                    else if (request_update.matchedCount === 0) reject({ "status": 404, "message": "Request not found" });
                    else if (user_update.matchedCount === 0) reject({ "status": 404, "message": "User not found" });
                    else reject({ "status": 400, "message": "Request accepting failed" });
                }
                else if (request.status == "accepted") reject({ "status": 422, "message": "Request already accepted" });
                else if (!user) reject({ "status": 404, "message": "User not found" });
                else if (!(user.status == "active")) reject({ "status": 422, "message": "User is not active" });
                else reject({ "status": 404, "message": "User profile is not complete" });
            }
            else if (!id) reject({ "status": 422, "message": "Request ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.rejectRequest = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                let request = await requests.findOne({ _id: id }).populate('added_by');
                if (request.status == "pending" && (decoded.user_type == "admin" || (type == "supporting" && request.change_to == decoded.user_id))) {
                    let request_data = {
                        status: "rejected",
                        updated_on: dayjs().format(),
                        updated_by: decoded.user_id,
                    }
                    let data = await requests.updateOne({ _id: id }, { $set: request_data });
                    if (data.modifiedCount === 1) resolve({ "status": 200, "message": "Request rejected successfully" });
                    else if (data.matchedCount === 0) reject({ "status": 404, "message": "Request not found" });
                    else reject({ "status": 400, "message": "Request rejection failed" });
                }
                else if (request.status == "accepted") reject({ "status": 422, "message": "Request already accepted" });
                else if (request.status == "rejected") reject({ "status": 422, "message": "Request already rejected" });
                else reject({ "status": 403, "message": "You are not alowed to reject the request" });
            }
            else if (!id) reject({ "status": 422, "message": "Request ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}