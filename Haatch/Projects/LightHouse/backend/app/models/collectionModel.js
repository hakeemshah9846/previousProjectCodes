const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
const userModel = require('./userModel');
const donationModel = require('./donationModel');
const updatedCollectionModel = require('./updatedCollectionModel');
const collections = require('../db/models/collections');
const collectionAccepted = require('../utils/email-templates/collectionAccepted').collectionAccepted;
const collectionRejected = require('../utils/email-templates/collectionRejected').collectionRejected;
const otpTemplate = require('../utils/email-templates/otpTemplate').otpTemplate;
const fileUpload = require('../utils/file-upload').fileUpload;
const sendEmail = require('../utils/send-email').sendEmail;

//function to fetch single collection based on the collection id
exports.fetchCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            // let filters = [{status: {$ne: 'private'}}]; //hiding private collections (eg: collection for support us)
            let filters = [];
            if (id) {
                filters.push(mongoose.isObjectIdOrHexString(id) ? { _id: id } : { permalink: id });
            }
            let collection = await collections.findOne(filters.length > 0 ? { $and: filters } : null, '-curators._id').populate('added_by updated_by curators.curator updates.added_by', 'first_name last_name email phone image type occupation user_policy inn permalink supporting').populate('updated_data').lean();
            if (collection) {
                if (collection.curators) {
                    //array of ids of accepted curators
                    let data = collection.curators.filter((obj) => obj.status == "accepted");
                    active_curators = data.map((obj) => String(obj.curator._id));
                    //hiding inactive collection updates
                    collection['updates'] = collection.updates.filter((obj) => {
                        return (obj.status == "active");
                    });
                    //hiding non-accepted curators from users except the collection created user and admin
                    //if the current logged user is a curator and the curator is added in the collection then the curator's data will be given
                    collection['curators'] = collection.curators.filter((obj) => {
                        return ((token && (String(collection.added_by._id) === decoded.user_id || decoded.user_type === "admin" || String(obj.curator._id) === String(decoded.user_id))) || obj.status == "accepted");
                    });
                    //hiding updated data if user is not a curator or curator haven't accepted the collection or the current curator is not assigned to the collection
                    if (token) {
                        if ((decoded.user_type != "curator" || !(active_curators.includes(decoded.user_id))) && decoded.user_type != "admin" && collection.added_by.supporting != decoded.user_id) {
                            delete collection['updated_data'];
                        }
                    }
                    else {
                        delete collection['updated_data'];
                    }
                }
                //fetching payment templates
                let payment_templates = [];
                await Promise.all(
                    collection.payment_templates.map(async (obj) => {
                        payment_templates.push(await userModel.fetchOnePaymentInternal(obj));
                    })
                );
                collection['payment_templates'] = payment_templates;
                //sorting collection updates
                collection["updates"].sort((a, b) => (new Date(b.added_on)) - (new Date(a.added_on)));
                resolve({ "status": 200, "data": collection });
            }
            else {
                reject({ "status": 404, "message": "Collection Not Found" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch all collection based on the filters
exports.fetchCollections = async function (token, status, added_by, curator, curator_status, keyword, collections_combined, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let filters = [];
            if (status) filters.push({ status: status });
            if (keyword) filters.push({ purpose: { $regex: keyword, $options: 'i' } });
            //if collections_combined is true, then collections added by the user and where the user is added as a curator will be given.
            if ((collections_combined == true || collections_combined == "true" && added_by && curator)) {
                if (token && added_by == "me") added_by = decoded.user_id;
                if (token && curator == "me") curator = decoded.user_id;
                if (curator_status) filters.push({ $or: [{ added_by: added_by }, { curators: { $elemMatch: { curator: curator, status: curator_status } } }] });
                else filters.push({ $or: [{ added_by: added_by }, { "curators.curator": curator }] });
            }
            else {
                //filtering based on user type and filter content
                if (token && added_by == "me") added_by = decoded.user_id;
                else added_by = added_by;
                if (token && decoded.user_type == "curator" && curator == "me") curator = decoded.user_id; //filter only available for curator
                else if (token && decoded.user_type == "admin") curator = curator; //filter only available for admin
                else curator = null;
                if (token && curator_status && (decoded.user_type == "curator" || decoded.user_type == "admin")) curator_status = curator_status;
                else curator_status = null;
                if (added_by) filters.push({ added_by: added_by });
                if (curator && curator_status) filters.push({ curators: { $elemMatch: { curator: curator, status: curator_status } } });
                else if (curator) filters.push({ "curators.curator": curator });
                else if (curator_status) filters.push({ "curators.status": curator_status });
                // private collections are given only to admin and respective users
                if (!(token && (decoded.user_type == "admin" || added_by == "me"))) filters.push({ status: { $ne: 'private' } });
            }
            //fetching based on filter
            let collections_array = await collections.find(filters.length > 0 ? { $and: filters } : null, '-curators._id').populate('added_by updated_by curators.curator updates.added_by', 'first_name last_name email phone image type occupation user_policy inn permalink').populate('updated_data').sort({ added_on: -1 }).skip((page - 1) * limit).limit(limit).lean();
            let count = await collections.count(filters.length > 0 ? { $and: filters } : null);
            await Promise.all(
                collections_array.map(async (collection) => {
                    if (collection.curators) {
                        //array of ids of accepted curators
                        let data = collection.curators.filter((obj) => obj.status == "accepted");
                        active_curators = data.map((obj) => String(obj.curator._id));
                        //hiding inactive collection updates
                        collection['updates'] = collection.updates.filter((obj) => {
                            return (obj.status === "active")
                        });
                        //hiding non-accepted curators from users except the collection created user, added curators and and admin
                        //if the current logged user is a curator and the curator is added in the collection then the curator's data will be given
                        collection['curators'] = collection.curators.filter((obj) => {
                            return ((token && (String(collection.added_by._id) === (decoded.user_id) || decoded.user_type === "admin" || String(obj.curator._id) === String(decoded.user_id))) || obj.status === "accepted");
                        });
                        //hiding updated data if user is not a curator or curator haven't accepted the collection or the current curator is not assigned to the collection
                        if (token) {
                            if ((decoded.user_type != "curator" || !(active_curators.includes(decoded.user_id))) && decoded.user_type != "admin" && collection.added_by.supporting != decoded.user_id) {
                                delete collection['updated_data'];
                            }
                        }
                        else {
                            delete collection['updated_data'];
                        }
                    }
                    //fetching payment templates
                    let payment_templates = [];
                    await Promise.all(
                        collection.payment_templates.map(async (obj) => {
                            payment_templates.push(await userModel.fetchOnePaymentInternal(obj));
                        })
                    );
                    collection['payment_templates'] = payment_templates;
                    //sorting collection updates
                    collection["updates"].sort((a, b) => (new Date(b.added_on)) - (new Date(a.added_on)));
                })
            );
            let collection_data = {
                "count": count,
                "collections": collections_array
            };
            resolve({ "status": 200, "data": collection_data });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to add collection
exports.addCollection = async function (token, purpose, description, featured_image, featured_video, files, curators, target_amount, payment_templates, permalink, payment_purpose) {
    return new Promise(async (resolve, reject) => {
        try {
            if (featured_image && featured_image.file && featured_video && featured_video.file && purpose && description && target_amount && payment_templates.length > 0 && permalink && payment_purpose) {
                let files_array = [];
                let curators_array = [];
                let decoded = jwt.decode(token);
                let collection_status = "pending";
                let user = await userModel.fetchOneInternal(decoded.user_id);
                //if user type is curator or admin, activating collection without any curators
                if (user.type == "curator" || user.type == "admin") collection_status = "active"
                else {
                    if (curators.length > 0) {
                        await Promise.all(
                            curators.map(async (curator_id) => {
                                try {
                                    let curator = await userModel.fetchOneInternal(curator_id);
                                    if (curator.type == "curator") {
                                        curators_array.push({
                                            curator: curator._id,
                                            status: "pending"
                                        });
                                    }
                                    else reject({ "status": 403, "message": "Invalid Curator" });
                                }
                                catch (error) {
                                    reject({ "status": 403, "message": "Invalid Curator" });
                                }
                            })
                        );
                    }
                    else return reject({ "status": 422, "message": "Curators required" });
                }
                //checking if the user is serving for any organization/curator
                if (user.account_type == organization && user_type == "volunteer") {
                    //checking if the payment_template belong to the organization/curator
                    if (user.supporting?.payment_templates?.length > 0) {
                        let curator_payments = user.supporting.payment_templates.map((obj) => {
                            return String(obj._id);
                        });
                        let allowed_payments = payment_templates.filter((obj) => {
                            return curator_payments.includes(obj);
                        })
                        if (!(payment_templates.length === allowed_payments.length)) return reject({ "status": 403, "message": "Invalid organization payment platforms" });
                    }
                    else return reject({ "status": 404, "message": "Payment platforms not found for your organization" });
                }
                //checking if permalink is unique
                let existing_permalink = await collections.findOne({ permalink: permalink });
                if (!existing_permalink) {
                    //uploading featured image, featured video and files
                    let image = {
                        "title": featured_image.title,
                        "url": await fileUpload(featured_image.file, "collections")
                    };
                    let video = {
                        "title": featured_video.title,
                        "url": await fileUpload(featured_video.file, "collections")
                    };
                    await Promise.all(
                        files.map(async (obj) => {
                            files_array.push({
                                "title": obj.title,
                                "url": await fileUpload(obj.file, "collections")
                            })
                        })

                    );
                    let new_collection = new collections({
                        purpose: purpose,
                        description: description,
                        featured_image: image,
                        featured_video: video,
                        files: files_array,
                        curators: curators_array,
                        payment_templates: payment_templates,
                        status: collection_status,
                        updates: [],
                        target_amount: target_amount,
                        collected_amount: 0,
                        permalink: permalink,
                        payment_purpose: payment_purpose,
                        added_on: dayjs().format(),
                        added_by: decoded.user_id,
                    });
                    await new_collection.save();
                    resolve({ "status": 200, "message": "Collection Added Successfully" });
                }
                else {
                    reject({ "status": 422, "message": "Permalink already exist" });
                }
            }
            else {
                if (!featured_image) reject({ "status": 422, "message": "Featured image is required" });
                if (!featured_image.file) reject({ "status": 422, "message": "Featured image is required" });
                if (!featured_video) reject({ "status": 422, "message": "Featured video is required" });
                if (!featured_video.file) reject({ "status": 422, "message": "Featured video is required" });
                if (!purpose) reject({ "status": 422, "message": "Purpose is required" });
                if (!description) reject({ "status": 422, "message": "Description is required" });
                if (!target_amount) reject({ "status": 422, "message": "Target Amount is required" });
                if (!(payment_templates.length > 0)) reject({ "status": 422, "message": "Payment Templates are required" });
                if (!(permalink)) reject({ "status": 422, "message": "Permalink is required" });
                if (!(payment_purpose)) reject({ "status": 422, "message": "Payment purpose is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to update collection
exports.updateCollection = async function (token, id, purpose, description, featured_image, featured_video, files, curators, target_amount, payment_templates, permalink, payment_purpose, otp) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            if (purpose && description && target_amount && payment_templates.length > 0 && permalink && payment_purpose && otp) {
                let files_array = [];
                let collection = await fetchCollectionInternal(id);
                //checking otp
                if (collection && collection.otp) {
                    if (dayjs().isBefore(dayjs(collection.otp.expiry).format())) {
                        if (collection.otp.code == otp) {
                            let user = await userModel.fetchOneInternal(decoded.user_id);
                            //checking if the user is serving for any organization/curator
                            if (user.account_type == organization && user_type == "volunteer") {
                                //checking if the payment_template belong to the organization/curator
                                if (user.supporting?.payment_templates?.length > 0) {
                                    let curator_payments = user.supporting.payment_templates.map((obj) => {
                                        return String(obj._id);
                                    });
                                    let allowed_payments = payment_templates.filter((obj) => {
                                        return curator_payments.includes(obj);
                                    })
                                    if (!(payment_templates.length === allowed_payments.length)) return reject({ "status": 403, "message": "Invalid organization payment platforms" });
                                }
                                else return reject({ "status": 404, "message": "Payment platforms not found for your organization" });
                            }
                            //checking if permalink is unique
                            //checking if the collection is added by the logged-in user
                            let existing_permalink = await collections.findOne({ $and: [{ permalink: permalink }, { _id: { $ne: id } }] });
                            if (!existing_permalink && (String(collection.added_by) == user._id || user._type == "admin")) {
                                let new_collection = {
                                    purpose: purpose,
                                    description: description,
                                    payment_templates: payment_templates,
                                    target_amount: target_amount,
                                    permalink: permalink,
                                    payment_purpose: payment_purpose,
                                    updated_on: dayjs().format(),
                                    updated_by: decoded.user_id,
                                    otp: null
                                };
                                //uploading featured image
                                if (featured_image) {
                                    new_collection["featured_image"] = {
                                        "title": featured_image.title,
                                        "url": await fileUpload(featured_image.file, "collections")
                                    };
                                }
                                //uploading featured video
                                if (featured_video) {
                                    new_collection["featured_video"] = {
                                        "title": featured_video.title,
                                        "url": await fileUpload(featured_video.file, "collections")
                                    };
                                }
                                //uploading files
                                if (files && files != "removed") {
                                    await Promise.all(
                                        files.map(async (obj) => {
                                            if (obj.new === true) {
                                                files_array.push({
                                                    "title": obj.title,
                                                    "url": await fileUpload(obj.file, "collections")
                                                });
                                            }
                                            else {
                                                files_array.push({
                                                    "title": obj.title,
                                                    "url": obj.file
                                                });
                                            }
                                        })
                                    );
                                    new_collection["files"] = files_array;
                                }
                                else if (files == "removed") {
                                    new_collection["files"] = null;
                                }

                                let request_data = {};
                                // if user is curator or admin, updating and activating collection without curators
                                // if user is not curator or admin, updating curators and handling critical data changes
                                if (user.type == "curator" || user.type == "admin") new_collection["curators"] = null;
                                else {
                                    if (curators.length > 0) {
                                        let current_curators = collection.curators;
                                        //array containing current curators ids
                                        let current_ids = collection.curators.map(obj => String(obj.curator));
                                        await Promise.all(
                                            curators.map(async (curator_id) => {
                                                //checking if curator does not exist already
                                                if (!(current_ids.includes(String(curator_id)))) {
                                                    let curator = await userModel.fetchOneInternal(curator_id);
                                                    if (curator.type == "curator" && curator.status == "active") {
                                                        current_curators.push({
                                                            curator: curator._id,
                                                            status: "pending"
                                                        });
                                                    }
                                                    else reject({ "status": 422, "message": "Invalid Curator" });
                                                }
                                            })
                                        );
                                        //removing deleted curators and changing status of rejected curators to pending
                                        new_collection["curators"] = current_curators.filter(obj => {
                                            if (obj.status == "rejected") obj.status = "pending";
                                            return (curators.includes(String(obj.curator)))
                                        });
                                        //if the collection status is active and after updation there will not be accepted curators, then changing the collection status to pending (this may happen while removing accepted curators from an active collection)
                                        let accepted_curators = new_collection.curators.filter(obj => obj.status == "accepted");
                                        if (accepted_curators.length == 0 && collection.status == "active") new_collection["status"] = "pending";
                                    }
                                    else return reject({ "status": 422, "message": "Curators required" });

                                    // updating collection details directly for curators and admin without making collection update request
                                    // if user is not curator or admin, checking if there is any critical content changes (purpose, description, featured image, featured video, attachments)
                                    // if no critical content changes then data is updated in database else updating non-critical content and adding update collection request for this collection for critical data change
                                    // id of the update request is added with collection details
                                    if (collection.purpose != new_collection.purpose) {
                                        request_data["purpose"] = new_collection.purpose;
                                        delete new_collection["purpose"];
                                    }
                                    if (collection.description != new_collection.description) {
                                        request_data["description"] = new_collection.description;
                                        delete new_collection["description"];
                                    }
                                    if (collection.featured_image != new_collection.featured_image) {
                                        request_data["featured_image"] = new_collection.featured_image;
                                        delete new_collection["featured_image"];
                                    }
                                    if (collection.featured_video != new_collection.featured_video) {
                                        request_data["featured_video"] = new_collection.featured_video;
                                        delete new_collection["featured_video"];
                                    }
                                    if (collection.files != new_collection.files) {
                                        request_data["files"] = new_collection.files;
                                        delete new_collection["files"];
                                    }
                                    if (collection.target_amount != new_collection.target_amount) {
                                        request_data["target_amount"] = new_collection.target_amount;
                                        delete new_collection["target_amount"];
                                    }
                                }

                                // adding collection update request if any critical data changed
                                if (Object.keys(request_data).length > 0) {
                                    request_data["collection_id"] = id;
                                    request_data["status"] = "pending";
                                    request_data["added_by"] = decoded.user_id;
                                    request_data["added_on"] = dayjs().format();
                                    let data = await updatedCollectionModel.addUpdate(id, request_data);
                                    // adding request id to identify the collection has critical data updates
                                    if (data) new_collection["updated_data"] = data._id;
                                    else reject({ "status": 400, "message": "Collection updating failed" });
                                }

                                // if the user is curator or admin updating collection
                                // if the user is not curator or admin updating collection only with non-critical data and adding request id
                                let data = await collections.updateOne({ _id: id }, new_collection);
                                if (data.matchedCount === 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "Collection update request added" });
                                else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection not found" });
                                else reject({ "status": 400, "message": "Collection updating failed" });
                            }
                            else {
                                if (String(collection.added_by) != decoded.user_id) reject({ "status": 403, "message": "You are not allowed to edit this collection" });
                                if (existing_permalink) reject({ "status": 422, "message": "Permalink already exist" });
                            }
                        }
                        else reject({ "status": 403, "message": "Invalid OTP" });
                    }
                    else reject({ "status": 403, "message": "OTP Expired" });
                }
                else reject({ "status": 403, "message": "Forbidden" });
            }
            else {
                if (!purpose) reject({ "status": 422, "message": "Purpose is required" });
                if (!description) reject({ "status": 422, "message": "Description is required" });
                if (!target_amount) reject({ "status": 422, "message": "Target Amount is required" });
                if (!(payment_templates.length > 0)) reject({ "status": 422, "message": "Payment Templates are required" });
                if (!(permalink)) reject({ "status": 422, "message": "Permalink is required" });
                if (!(payment_purpose)) reject({ "status": 422, "message": "Payment purpose is required" });
                if (!(otp)) reject({ "status": 422, "message": "otp is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to generate otp to modify collection data
exports.generateOTP = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                let collection = await fetchCollectionInternal(id);
                if (String(collection.added_by) == decoded.user_id || decoded.user_type == "admin") {
                    //fetching user details
                    let user = await userModel.fetchOneInternal(decoded.user_id);
                    let otp_data = {
                        code: Math.floor(1000 + Math.random() * 9000),
                        expiry: (dayjs().add(10, 'minute')).format()
                    };
                    let data = await collections.findOneAndUpdate({ _id: id }, { $set: { otp: otp_data } }, { new: true });
                    if (data) {
                        let email_template = await otpTemplate(user.first_name, data.otp.code);
                        sendEmail(user.email, "Помоград - код подтверждения", email_template);
                        resolve({ "status": 200, "message": "OTP send successfully" });
                    }
                    else reject({ "status": 404, "message": "Collection not found" });
                }
                else reject({ "status": 403, "message": "You are not allowed to generate OTP" });
            }
            else reject({ "status": 422, "message": "Id is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to update collection status to complete
exports.completeCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                let collection_data = {
                    status: "complete",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id,
                };
                let data = await collections.updateOne({ $and: [{ _id: id }, { $or: [{ added_by: decoded.user_id }, { "curators.curator": mongoose.Types.ObjectId(decoded.user_id) }] }] }, collection_data);
                if (data.matchedCount === 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "Collection Updated Successfully" });
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection not found" });
                else reject({ "status": 400, "message": "Collection Status update failed" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function for the curator to accept a collection based on the collection id
exports.acceptCollection = async function (token, id, video) {
    return new Promise(async (resolve, reject) => {
        try {
            //checking id and uploaded video
            if (id && video) {
                let decoded = jwt.decode(token);
                //updating collection status to active and updating curator's status to accepted
                let collection_data = {
                    status: "active",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id,
                    "curators.$.status": "accepted",
                    "curators.$.video": {
                        "title": video.title,
                        "url": await fileUpload(video.file, "collections")
                    },
                    "curators.$.updated_on": dayjs().format(),
                    "curators.$.updated_by": decoded.user_id
                };
                let data = await collections.updateOne({ _id: id, "curators.curator": decoded.user_id }, { $set: collection_data });
                if (data.matchedCount === 1 && data.modifiedCount == 1) {
                    //sending email to the collection created user
                    let collection = await collections.findOne({ _id: id }).populate('added_by', 'first_name, last_name, email');
                    let accepted_curator = await userModel.fetchOneInternal(decoded.user_id);
                    let email = collection.added_by.email;
                    let user = collection.added_by.first_name + " " + collection.added_by.last_name;
                    let curator = accepted_curator.first_name + " " + accepted_curator.last_name;
                    let email_template = await collectionAccepted(user, curator, collection.purpose, collection.permalink);
                    sendEmail(email, "Помоград - Ваш сбор одобрен", email_template);
                    resolve({ "status": 200, "message": "Collection Accepted Successfully" });
                }
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection not found" });
                else reject({ "status": 400, "message": "Collection Status update failed" });
            }
            else {
                if (!id) reject({ "status": 422, "message": "Collection ID is required" });
                if (!video) reject({ "status": 422, "message": "Video is required to accept a collection" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function for the curator to reject a collection based on the collection id
exports.rejectCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            //checking id
            if (id) {
                let decoded = jwt.decode(token);
                let collection_data = {
                    "curators.$.status": "rejected",
                    "curators.$.updated_on": dayjs().format(),
                    "curators.$.updated_by": decoded.user_id
                }
                //updating curator's status to rejected
                let data = await collections.updateOne({ _id: id, "curators.curator": decoded.user_id }, { $set: collection_data });
                if (data.matchedCount === 1 && data.modifiedCount == 1) {
                    //sending email to the collection created user
                    let collection = await collections.findOne({ _id: id }).populate('added_by', 'first_name, last_name, email');
                    let rejected_curator = await userModel.fetchOneInternal(decoded.user_id);
                    let email = collection.added_by.email;
                    let user = collection.added_by.first_name + " " + collection.added_by.last_name;
                    let curator = rejected_curator.first_name + " " + rejected_curator.last_name;
                    let email_template = await collectionRejected(user, curator, collection.purpose, collection.permalink);
                    sendEmail(email, "Помоград - Ваш сбор отклонён", email_template);
                    resolve({ "status": 200, "message": "Collection Rejected Successfully" });
                }
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection not found" });
                else reject({ "status": 400, "message": "Collection Status update failed" });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function for the curator to request the admin to hold a collection
exports.holdRequestCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            //checking id
            if (id) {
                let decoded = jwt.decode(token);
                let request_data = {
                    "curators.$.status": "hold",
                    "curators.$.updated_on": dayjs().format(),
                    "curators.$.updated_by": decoded.user_id
                }
                //updating curator's status to hold
                await collections.updateOne({ _id: id, "curators.curator": decoded.user_id }, { $set: request_data });
                resolve({ "status": 200, "message": "Collection Hold Request Submitted" });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function for the admin to hold a collection
exports.holdCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            //checking id
            if (id) {
                let decoded = jwt.decode(token);
                let collection_data = {
                    status: "hold",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id
                }
                //updating collection status to active
                await collections.updateOne({ _id: id }, { $set: collection_data });
                resolve({ "status": 200, "message": "Collection Holded Successfully" });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to activate a collection
exports.activateCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            //checking id
            if (id) {
                let decoded = jwt.decode(token);
                let collection = await fetchCollectionInternal(id);
                let accepted_curators = collection.curators.filter(obj => obj.status == "accepted");
                let curators_id = collection.curators.map(obj => obj.curator);
                //if collection status is complete then allowing curators and voluteers to change status to active
                if (decoded.user_type == "admin" || (collection.status == "complete" && (curators_id.includes(decoded.user_id) || collection.added_by == decoded.user_id))) {
                    let collection_data = {
                        status: "active",
                        updated_on: dayjs().format(),
                        updated_by: decoded.user_id
                    }
                    //updating collection status to active
                    await collections.updateOne({ _id: id }, { $set: collection_data });
                    resolve({ "status": 200, "message": "Collection activated Successfully" });
                }
                else reject({ "status": 403, "message": "Activating this collection is not allowed" });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to hide a collection
exports.hideCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {

        try {
            if (id) {
                let decoded = jwt.decode(token);
                //hiding collection if status is active and the user is admin or the collection is added by the user
                let filters = [{ _id: id }, { status: "active" }];
                if (decoded.user_type != "admin") filters.push({ added_by: mongoose.Types.ObjectId(decoded.user_id) })
                let collection_data = {
                    status: "private",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id
                }
                //updating collection status to active
                let data = await collections.updateOne(filters.length > 0 ? { $and: filters } : null, { $set: collection_data });
                if (data.matchedCount == 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "Collection hidden Successfully" });
                else if (data.matchedCount == 0) reject({ "status": 404, "message": "Collection not found" });
                else reject({ "status": 400, "message": "Collection hiding failed" });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to unhide a collection
exports.unhideCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                //hiding collection if status is private and the user is admin or the collection is added by the user
                let filters = [{ _id: id }, { status: "private" }];
                if (decoded.user_type != "admin") filters.push({ added_by: mongoose.Types.ObjectId(decoded.user_id) })
                let collection_data = {
                    status: "active",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id
                }
                //updating collection status to active
                let data = await collections.updateOne(filters.length > 0 ? { $and: filters } : null, { $set: collection_data });
                if (data.matchedCount == 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "Collection unhidden Successfully" });
                else if (data.matchedCount == 0) reject({ "status": 404, "message": "Collection not found" });
                else reject({ "status": 400, "message": "Collection unhiding failed" });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function for the admin to delete a collection
exports.deleteCollection = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            //checking id
            if (id) {
                let decoded = jwt.decode(token);
                let collection = await fetchCollectionInternal(id);
                //if collection status is complete then allowing curators and voluteers to change status to active
                if ((collection.status == "pending" && (!(collection.collected_amount)) && (collection.added_by == decoded.user_id || decoded.user_type == "admin"))) {
                    let collection_data = {
                        status: "deleted",
                        updated_on: dayjs().format(),
                        updated_by: decoded.user_id
                    }
                    //updating collection status to active
                    await collections.updateOne({ _id: id }, { $set: collection_data });
                    resolve({ "status": 200, "message": "Collection deleted successfully" });
                }
                else {
                    if (collection.status != "pending") reject({ "status": 403, "message": "Collection is active" });
                    if (collection.collected_amount) reject({ "status": 403, "message": "Collection is having donations" });
                    if (collection.added_by != decoded.user_id || decoded.user_type != "admin") reject({ "status": 403, "message": "You are not allowed to delete this collection" });
                }
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch all collection updates of a collection
exports.fetchCollectionUpdates = async function (collection, extra_amount) {
    return new Promise(async (resolve, reject) => {
        try {
            if (collection) {
                let selection = 'updates';
                if (extra_amount) {
                    selection = { "updates": { "$elemMatch": { "extra_amount": { $gt: 0 } } } }
                }
                let updates = await collections.find({ _id: collection }).select(selection);
                resolve({ "status": 200, "data": updates });
            }
            else reject({ "status": 422, "message": "Collection ID is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to fetch a collection update
exports.fetchOneCollectionUpdate = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let data = await collections.findOne({ $and: [{ "updates.status": "active" }, { "updates._id": id }] }, '-_id updates').select({ _id: 1, "curators.curator": 1, added_by: 1, updates: { $elemMatch: { $and: [{ _id: id }, { status: "active" }] } } }).lean();
                if (data) {
                    let update = data.updates[0];
                    update["collection"] = {
                        _id: data._id,
                        curators: data.curators,
                        added_by: data.added_by
                    };
                    resolve({ "status": 200, "data": update });
                }
                else {
                    reject({ "status": 404, "message": "Collection Update not found" });
                }
            }
            else {
                if (!id) reject({ "status": 422, "message": "Collection Update ID is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to add updates to a collection
exports.addCollectionUpdates = async function (token, id, video, files, description, extra_amount) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id && video && description) {
                let files_array = [];
                let accepted_curators = []
                let decoded = jwt.decode(token);
                let collection = await collections.findOne({ $and: [{ _id: id }, { status: { $in: ["active", "pending"] } }] });
                if (collection) {
                    if (collection.curators) {
                        let curators = collection.curators.filter(obj => obj.status == "accepted");
                        accepted_curators = curators.map(obj => String(obj.curator));
                    }
                    if (decoded.user_type == "admin" || String(collection.added_by) == decoded.user_id || (accepted_curators).includes(decoded.user_id)) {
                        let video_obj = {
                            "title": video.title,
                            "url": await fileUpload(video.file, "collections")
                        };
                        if (files) {
                            await Promise.all(
                                files.map(async (obj) => {
                                    files_array.push({
                                        "title": obj.title,
                                        "url": await fileUpload(obj.file, "collections")
                                    })
                                })
                            );
                        }
                        let update_id = dayjs() + String(Math.floor(Math.random() * 100));
                        let updates_data = {
                            "status": "active",
                            "video": video_obj,
                            "files": files_array,
                            "description": description,
                            "amount": collection.collected_amount,
                            "extra_amount": extra_amount,
                            "update_id": update_id,
                            "added_on": dayjs().format(),
                            "added_by": decoded.user_id
                        };
                        let data = await collections.findOneAndUpdate({ _id: id }, { $inc: { collected_amount: extra_amount }, $push: { updates: updates_data } }, { new: true });
                        //adding extra amount to donations
                        if (extra_amount) {
                            let donation_data = {
                                "_collection": collection._id,
                                "amount": extra_amount,
                                "status": "success",
                                "extra_amount": true,
                                "update_id": update_id,
                                "added_on": dayjs().format(),
                                "added_by": decoded.user_id
                            }
                            await donationModel.addDonationInternal(donation_data);
                        }
                        resolve({ "status": 200, "message": "Updates added Successfully" });
                    }
                    else reject({ "status": 403, "message": "You are not allowed to add updates to this collection" });
                }
                else reject({ "status": 404, "message": "Collection not found" });
            }
            else {
                if (!id) reject({ "status": 422, "message": "Collection ID is required" });
                if (!video) reject({ "status": 422, "message": "Video is required" });
                if (!description) reject({ "status": 422, "message": "Description is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to update updates of a collection
exports.updateCollectionUpdates = async function (token, id, video, files, description, extra_amount) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id && description) {
                let files_array = [];
                let accepted_curators = [];
                let decoded = jwt.decode(token);
                let collection = await collections.findOne({ $and: [{ "updates._id": mongoose.Types.ObjectId(id) }, { status: { $in: ["active", "pending"] } }, { "updates.status": { $in: ["active", "pending"] } }] });
                if (collection) {
                    if (collection.curators) {
                        let curators = collection.curators.filter(obj => obj.status == "accepted");
                        accepted_curators = curators.map(obj => String(obj.curator));
                    }
                    if (decoded.user_type == "admin" || String(collection.added_by) == decoded.user_id || (accepted_curators).includes(decoded.user_id)) {
                        let current_data = await collections.findOne({ "updates": { "$elemMatch": { "_id": mongoose.Types.ObjectId(id) } } }).select({ "updates": { "$elemMatch": { "_id": mongoose.Types.ObjectId(id) } } });
                        let updates_data = {
                            collected_amount: (collection.collected_amount - current_data.updates[0].extra_amount) + extra_amount,
                            "updates.$.status": "active",
                            "updates.$.description": description,
                            "updates.$.amount": collection.collected_amount,
                            "updates.$.extra_amount": extra_amount,
                            "updates.$.updated_by": decoded.user_id,
                            "updates.$.updated_on": dayjs().format()
                        };
                        //uploading video
                        if (video) {
                            updates_data["updates.$.video"] = {
                                "title": video.title,
                                "url": await fileUpload(video.file, "collections")
                            };
                        }
                        //uploading files
                        if (files && files != "removed") {
                            await Promise.all(
                                files.map(async (obj) => {
                                    if (obj.new === true) {
                                        files_array.push({
                                            "title": obj.title,
                                            "url": await fileUpload(obj.file, "collections")
                                        });
                                    }
                                    else {
                                        files_array.push({
                                            "title": obj.title,
                                            "url": obj.file
                                        });
                                    }
                                })
                            );
                            updates_data["updates.$.files"] = files_array;
                        }
                        else if (files == "removed") {
                            updates_data["updates.$.files"] = null;
                        }
                        let data = await collections.updateOne({ "updates": { "$elemMatch": { $and: [{ "_id": mongoose.Types.ObjectId(id) }, { "status": { $in: ["active", "pending"] } }] } } }, { $set: updates_data });
                        if (data.matchedCount === 1 && data.modifiedCount == 1) {
                            //adding extra amount to donations
                            if (extra_amount) {
                                let index = collection.updates.findIndex(x => x._id == id);
                                if (index >= 0) {
                                    let update_id = collection.updates[index].update_id;
                                    let filters = { $and: [{ update_id: update_id }, { extra_amount: true }] };
                                    let donation_data = {
                                        "amount": extra_amount,
                                        "updated_on": dayjs().format(),
                                        "updated_by": decoded.user_id
                                    }
                                    await donationModel.updateDonationInternal(filters, donation_data);
                                }
                            }
                            resolve({ "status": 200, "message": "Updated Successfully" });
                        }
                        else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection Update not found" });
                        else reject({ "status": 400, "message": "Collection updating failed" });
                    }
                    else reject({ "status": 403, "message": "You are not allowed to edit this updates" });
                }
                else reject({ "status": 404, "message": "Collection update not found" });
            }
            else {
                if (!id) reject({ "status": 422, "message": "Collection ID is required" });
                if (!video) reject({ "status": 422, "message": "Video is required" });
                if (!description) reject({ "status": 422, "message": "Description is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to delete a collection update
exports.deleteCollectionUpdate = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                let collection = await collections.findOne({ $and: [{ "updates._id": mongoose.Types.ObjectId(id) }, { status: { $in: ["active", "pending"] } }, { "updates.status": { $in: ["active", "pending"] } }] });
                if (collection) {
                    let curators = collection.curators.filter(obj => obj.status == "accepted");
                    let accepted_curators = curators.map(obj => String(obj.curator));
                    if (decoded.user_type == "admin" || String(collection.added_by) == decoded.user_id || (accepted_curators).includes(decoded.user_id)) {
                        let decoded = jwt.decode(token);
                        let updates_data = {
                            "updates.$.status": "deleted",
                            "updates.$.deleted_by": decoded.user_id,
                            "updates.$.deleted_on": dayjs().format()
                        };
                        let data = await collections.updateOne({ "updates": { "$elemMatch": { "_id": mongoose.Types.ObjectId(id) } } }, { $set: updates_data });
                        if (data.matchedCount === 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "Deleted Successfully" });
                        else if (data.matchedCount === 0) reject({ "status": 404, "message": "Collection Update not found" });
                        else reject({ "status": 400, "message": "Collection deletion failed" });
                    }
                    else reject({ "status": 403, "message": "You are not allowed to delete this updates" });
                }
                else {
                    reject({ "status": 404, "message": "Collection not found" });
                }
            }
            else reject({ "status": 422, "message": "Collection Update ID is required" });
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

//function to fetch collection
const fetchCollectionInternal = exports.fetchCollectionInternal = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await collections.findOne({ _id: id }).lean();
            if (data) resolve(data);
            else reject("Collection not found")
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to update collected amount
const updateCollectedAmountInternal = exports.updateCollectedAmountInternal = async function (id, amount) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await collections.updateOne({ _id: id }, { $inc: { collected_amount: amount } });
            resolve(data);
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

//function to update collected amount
const updateCollectionInternal = exports.updateCollectionInternal = async function (id, collection_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await collections.updateOne({ _id: id }, collection_data);
            resolve(data);
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
};


// function to hide collections
exports.hideCollection = async function (token, id) {
    return new Promise(async (resolve,reject)=>{
        try {
            if(id){
                let decoded = jwt.decode(token);
                let collection_data = {
                    status : "private",
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id,

                }

                //updating collection status to hide
                let collection = await collections.findOne({_id : id});

                if( collection?.status === "active"){

                   let data = await collections.updateOne({$and : [{ _id: id }, {status: "active"}]}, { $set: collection_data });

                    resolve({ "status": 200, "message": "Collection Hided Successfully" });
                }else{
                    reject({"status": 400, "message":"Collection must be active"});
                }


            }else reject({ "status": 422, "message": "Collection ID is required" });
        } catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            
        }
    })
}