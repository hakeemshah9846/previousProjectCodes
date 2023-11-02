require('dotenv').config();
const jwt = require('jsonwebtoken');
const dayjs = require("dayjs");
const Op = require('sequelize').Op;
const success_function = require('../response-handler').success_function;
const error_function = require('../response-handler').error_function;
const notification_functions = require('./functions/notification-functions');
const notifications = require('../db/models/notifications');
const targetGroups = require('../db/models/target-groups');
const responses = require('../db/models/responses');
const notificationTypes = require('../db/models/notification-types');
const responseType = require('../db/models/response-types');

exports.getNotificationTypesModel = function() {;
    return new Promise((resolve, reject)=>{
        notificationTypes.findAll()
        .then(notification_types =>{
            resolve(success_function(notification_types));
        })
        .catch((error) =>{
            console.log(error);
            reject(error_function(error));
        });
    })
};

exports.getResponseTypesModel = function() {;
    return new Promise((resolve, reject)=>{
        responseType.findAll()
            .then(response_types =>{
                resolve(success_function(response_types));
            })
            .catch((error) =>{
                reject(error_function(error));
            });
    })
};

exports.createModel = function(token, type_id, targets, title, description, scheduled_at, response_type, status) {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                try{
                    let created_on = dayjs().format();
                    let created_by = decoded.email;
                    let organization_id = decoded.organization_id;
                    if(scheduled_at)
                    {
                        scheduled_at = dayjs(scheduled_at).format();
                    }
                    else
                    {
                        scheduled_at = null;
                    }
                    if(status=="draft" || status=="active")
                    {
                        notifications.create({
                            type_id : type_id,
                            organization_id : organization_id,
                            title : title,
                            description : description,
                            scheduled_at : scheduled_at,
                            created_by : created_by,
                            created_on : created_on,
                            response_type : response_type,
                            status : status
                        })
                        .then(result =>{
                            //adding targets branches
                            let count = targets.length;
                            count--;
                            targets.map((object, index, array)=>{
                                let branch_id = object.branch_id;
                                let group_count = object.groups.length;
                                group_count--;
                                object.groups.map((group_object, group_index, group_array)=>{
                                    targetGroups.create({
                                        notification_id : result.id,
                                        branch_id : branch_id,
                                        group_id : group_object.group_id
                                    })
                                    .then(() =>{
                                        if(group_index==group_count)
                                        {
                                            if(index==count){
                                                resolve(success_function("Notification Added"));
                                            }
                                        }
                                    })
                                    .catch((error) =>{
                                        reject(error_function(error));
                                    });
                                });
                            });
                        })
                        .catch((error) =>{
                            reject(error_function(error));
                        });
                    }
                    else
                    {
                        reject(error_function("Invalid notification status"));
                    }
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    })
};

exports.filesModel = async function(token, file, host) {
    return new Promise( async (resolve, reject)=>{
        jwt.verify(token, process.env.PRIVATE_KEY, async function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                try{
                    if (!file) {
                        return reject(error_function("Invalid File"));
                    }

                    let uploadPath = await notification_functions.uploadFile(file, host);
                    if(uploadPath) resolve(success_function(uploadPath));
                    else reject(error_function("Something went wrong"));
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    })
};

exports.updateModel = function(token, notification_id, type_id, targets, title, description, scheduled_at, response_type, status) {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                
                let organization_id = decoded.organization_id;
                try{
                    notifications.findOne({
                        where: {
                          id: notification_id
                        }
                    })
                    .then(notification_result =>{
                        //only if the status is draft
                        //only if the user is in the same organization
                        if((notification_result.status=="draft" || (notification_result.status=="active" && notification_result.scheduled_at!=null)) && notification_result.organization_id==organization_id)
                        {
                            if(scheduled_at)
                            {
                                scheduled_at = dayjs(scheduled_at).format();
                            }
                            else
                            {
                                scheduled_at = null;
                            }
                            if(status=="draft" || status=="active")
                            {
                                notifications.update({
                                    type_id : type_id,
                                    title : title,
                                    description : description,
                                    scheduled_at : scheduled_at,
                                    response_type : response_type,
                                    status : status
                                },
                                { 
                                    where: {id: notification_id}
                                })
                                .then(() =>{
                                    //deleting previous targets
                                    targetGroups.destroy({
                                        where: {
                                          notification_id : notification_id
                                        }
                                    })
                                    .then(() =>{
                                        //adding targets branches
                                        let count = targets.length;
                                        count--;
                                        targets.map((object, index, array)=>{
                                            let branch_id = object.branch_id;
                                            let group_count = object.groups.length;
                                            group_count--;
                                            object.groups.map((group_object, group_index, group_array)=>{
                                                targetGroups.create({
                                                    notification_id : notification_id,
                                                    branch_id : branch_id,
                                                    group_id : group_object.group_id
                                                })
                                                .then(() =>{
                                                    if(group_index==group_count)
                                                    {
                                                        if(index==count){
                                                            resolve(success_function("Notification Updated"));
                                                        }
                                                    }
                                                })
                                                .catch((error) =>{
                                                    reject(error_function(error));
                                                });
                                            });
                                        });
                                    })
                                    .catch((error) =>{
                                        reject(error_function(error));
                                    });
                                })
                                .catch((error) =>{
                                    reject(error_function(error));
                                });
                            }
                            else
                            {
                                reject(error_function("Invalid notification status"));
                            }
                        }
                        else
                        {
                            reject(error_function("Unauthorized update attempt"));
                        }
                    })
                    .catch((error) =>{
                        reject(error_function(error));
                    });
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    });
};

exports.deleteModel = function(token, notification_id) {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                let organization_id = decoded.organization_id;
                try{
                    notifications.findOne({
                        where: {
                          id: notification_id
                        }
                    })
                    .then(notification_result =>{
                        //only if the status is draft
                        //only if the user is in the same organization
                        if(notification_result.status=="draft" && notification_result.organization_id==organization_id)
                        {
                            //update status to deleted
                            notifications.update({
                                status : "deleted"
                            },
                            { 
                                where: {id: notification_id}
                            })
                            .then(() =>{
                                resolve(success_function("Notification Deleted"));
                            })
                            .catch((error) =>{
                                reject(error_function(error));
                            });
                        }
                        else
                        {
                            reject(error_function("Unauthorized delete attempt"));
                        }
                    })
                    .catch((error) =>{
                        reject(error_function(error));
                    });
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    })
};

exports.fetchSingleModel = function(lync_token, notification_token, notification_id) {
    return new Promise((resolve, reject)=>{
        jwt.verify(notification_token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                let organization_id = decoded.organization_id;
                try{
                    notifications.findOne({
                        where: {
                            [Op.and]: [{ organization_id: organization_id }, { status: {[Op.ne]: "deleted"} }, { id: notification_id } ]
                        },
                        raw : true
                    })
                    .then(notification_result =>{
                        if(notification_result)
                        {
                            notification_functions.fetchBranchGroup(notification_result.id, null, null, lync_token)
                            .then(targets =>{
                                notification_result.targets=targets;
                                resolve(success_function(notification_result));
                            })
                            .catch((error) =>{
                                reject(error_function(error));
                            });
                        }
                        else
                        {
                            reject(error_function("Notification not found"));
                        }
                    })
                    .catch((error) =>{
                        reject(error_function(error));
                    });
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    })
};

exports.fetchModel = async function(lync_token, notification_token, type_id, branch_id, group_id, keyword, page, limit) {
    return new Promise(async(resolve, reject)=>{
        let x = 1;
        jwt.verify(notification_token, process.env.PRIVATE_KEY, async function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                let set_limit = page*limit;
                let organization_id = decoded.organization_id;
                try{
                    let params=[{ organization_id: organization_id }, { status: {[Op.ne]: "deleted"} }];

                    if(type_id) params.push({'type_id': type_id});
                    if(keyword) params.push({title: {[Op.like] : `%${keyword}%`}});

                    let count = await notifications.count({where: {[Op.and]: params}});

                    notifications.findAll({
                        where: {[Op.and]: params},
                        order: [
                            ['id', 'DESC']
                        ],
                        raw : true,
                        limit : set_limit
                    })
                    .then(notification_result =>{
                        let pages_to_delete = page-1;
                        let notifications_to_delete = pages_to_delete*limit;
                        notification_result.splice(0, notifications_to_delete);
                        
                        if(notification_result.length>0)
                        {
                            let notification_array = [];
                            notification_result.map((notification)=>{
                                notification_functions.fetchBranchGroup(notification.id, branch_id, group_id, lync_token)
                                .then(targets =>{
                                    notification['targets']=targets;
                                    if(targets.length>0)
                                    {
                                        notification_array.push(notification);
                                    }
                                    if(x==notification_result.length)
                                    {
                                        let notifications = notification_array.slice().sort((a, b) => b.id - a.id);
                                        let notification_data = {
                                            "count" : count,
                                            "notifications" : notifications
                                        };
                                        resolve(success_function(notification_data));
                                    }
                                    else
                                    {
                                        x=x+1;
                                    }
                                })
                                .catch((error) =>{
                                    reject(error_function(error));
                                });
                            });
                        }
                        else
                        {
                            let notification_data = {
                                "count" : count,
                                "notifications" : notification_result
                            };
                            resolve(success_function(notification_data));
                        }
                    })
                    .catch((error) =>{
                        reject(error_function(error));
                    });
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    })
};

exports.searchModel = function(notification_token, keyword) {;
    return new Promise((resolve, reject)=>{
        jwt.verify(notification_token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                notifications.findAll({
                    where: {
                        title: {[Op.like] : `%${keyword}%`}
                    }
                })
                .then(notification_result =>{
                    resolve(success_function(notification_result));
                })
                .catch((error) =>{
                    console.log(error);
                    reject(error_function(error));
                });
            }
        });
    })
};

exports.lyncFetchModel = function(lync_token, organization_id, user_id, group_id) {
    return new Promise((resolve, reject)=>{
        try{
            const groups = group_id.split(',');
            //fetching notification_id from corresponding groups and branches
            targetGroups.findAll({
                where: {
                    group_id: groups
                }
            })
            .then(groups_result =>{
                let count = groups_result.length;
                if(count>0)
                {
                    //groups_result is a json array
                    let notifications = [];
                    let current_object = 1;
                    groups_result.map((object)=>{

                        //checking if notification is already viewed
                        notification_functions.checkViewed(object.notification_id, user_id)
                        .then( (response) => {
                            if(response.viewed===false)
                            {
                                //notification not viewed
                                //fetching notification details
                                notification_functions.getNotification(response.notification_id, organization_id)
                                .then(notification_result =>{

                                    //adding notification details to notification array
                                    //console.log(notification_result.id)
                                    notification_result ? notifications.push(notification_result) : '' ;
                                    if(current_object==count)
                                    {
                                        //stopping condition
                                        //no need to increment current_object value
                                        //formating notification array with notification type and response type
                                        if(notifications.length>0)
                                        {
                                            let x = 1;
                                            notifications.map((notification)=>{
                                                notification_functions.fetchBranchGroup(notification.id, null, null, lync_token)
                                                .then(targets =>{
                                                    notification.dataValues.targets=targets;
                                                    if(x==notifications.length)
                                                    {
                                                        notification_functions.formatNotification(notifications)
                                                        .then((formated_notification) =>{
                                                            //add to viewed table if response type is none
                                                            notification_functions.viewedNotification(formated_notification, user_id);
                                                            resolve(success_function(formated_notification));
                                                        })
                                                        .catch((error) =>{
                                                            reject(error_function(error));
                                                        });
                                                    }
                                                    else
                                                    {
                                                        x=x+1;
                                                    }
                                                })
                                                .catch((error) =>{
                                                    reject(error_function(error));
                                                });
                                            });
                                        }
                                        else
                                        {
                                            //no active or unviewed notifications
                                            resolve(success_function(notifications));
                                        }
                                    }
                                    else
                                    {
                                        current_object=current_object+1;
                                    }
                                })
                                .catch((error) =>{
                                    reject(error_function(error));
                                });
                            }
                            else
                            {
                                if(current_object==count)
                                {
                                    //stopping condition
                                    //no need to increment current_object value
                                    //formating notification array with notification type and response type
                                    if(notifications.length>0)
                                    {
                                            let x = 1;
                                            notifications.map((notification)=>{
                                                notification_functions.fetchBranchGroup(notification.id, null, null, lync_token)
                                                .then(targets =>{
                                                    notification.dataValues.targets=targets;
                                                    if(x==notifications.length)
                                                    {
                                                        notification_functions.formatNotification(notifications)
                                                        .then((formated_notification) =>{
                                                            //add to viewed table if response type is none
                                                            notification_functions.viewedNotification(formated_notification, user_id);
                                                            resolve(success_function(formated_notification));
                                                        })
                                                        .catch((error) =>{
                                                            reject(error_function(error));
                                                        });
                                                    }
                                                    else
                                                    {
                                                        x=x+1;
                                                    }
                                                })
                                                .catch((error) =>{
                                                    reject(error_function(error));
                                                });
                                            });
                                    }
                                    else
                                    {
                                        //no active or unviewed notifications
                                        resolve(success_function(notifications));
                                    }
                                }
                                else
                                {
                                    current_object=current_object+1;
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            reject(error_function(error));
                        });
                    });
                }
                else
                {
                    resolve(success_function([]));
                }
            })
            .catch((error) =>{
                reject(error_function(error));
            });
        }
        catch(error)
        {
            console.log(error);
            reject(error_function(error));
        }
    })
};

exports.lyncGetResponsesModel = async function(notification_token, lync_token, notification_id) {
    return new Promise((resolve, reject)=>{
        
        jwt.verify(notification_token, process.env.PRIVATE_KEY, function(err, decoded) {
            if (err) {
                let response = error_function(err.message);
                reject(error_function(response));
            }
            else
            {
                try{
                    let organization_id = decoded.organization_id;
                    responses.findAll({
                        where: {
                            // [Op.and]: [{ organization_id: organization_id }, { notification_id: notification_id }]
                            [Op.and]: [{ organization_id: organization_id }]
                        },
                        raw : true
                    })
                    .then( async (response_result) =>{
                        if(response_result.length>0)
                        {
                            let responses = [];
                            await Promise.all(response_result.map( async (obj)=>{
                                let response_obj = obj;
                                response_obj['user_name'] = await notification_functions.getUserName(obj.user_id, lync_token);
                                responses.push(response_obj);
                            }));
                            resolve(success_function(responses));
                        }
                        else
                        {
                            reject(error_function("No Responses Found"));
                        }
                    })
                    .catch((error) =>{
                        console.log(error)
                        reject(error_function(error));
                    });
                }
                catch(error)
                {
                    console.log(error);
                    reject(error_function(error))
                }
            }
        });
    })
};

exports.lyncAddResponsesModel = function(organization_id, branch_id, group_id, user_id, notification_id, response) {
    return new Promise((resolve, reject)=>{
        try{
            //verifying if notification id is for the user's group and branch
            targetGroups.findOne({
                where: {
                    [Op.and]: [{ notification_id: notification_id }, { branch_id: branch_id }, { group_id: group_id }]
                }
            })
            .then(groups_result =>{
                if(groups_result)
                {
                    //verifying notification id is in the same organization and it is active
                    notifications.findOne({
                        where: {
                            [Op.and]: [{ id: groups_result.dataValues.notification_id }, { organization_id: organization_id }]
                        }
                    })
                    .then(notification_result =>{
                        if(notification_result)
                        {
                            //create response if does not exist
                            responses.findOne({
                                where: {
                                    [Op.and]: [{ user_id: user_id }, { notification_id: notification_id }]
                                }
                            })
                            .then(response_result =>{
                                if(response_result)
                                {
                                    //response of the user already exist
                                    reject(error_function("User have already responded to this notification"));
                                }
                                else
                                {
                                    //adding to viewed notifications
                                    notification_functions.viewedResponseNotification(notification_id, user_id);
                                    //create response
                                    responses.create({
                                        user_id : user_id,
                                        response : response,
                                        notification_id : notification_id,
                                        organization_id : organization_id,
                                        branch_id : branch_id,
                                        group_id : group_id,
                                    })
                                    .then(() =>{
                                        resolve(success_function("Response Added"));
                                    })
                                    .catch((error) =>{
                                        console.log(error)
                                        reject(error_function(error));
                                    });
                                }
                            })
                            .catch((error) =>{
                                console.log(error)
                                reject(error_function(error));
                            });
                        }
                        else
                        {
                            reject(error_function("Notification does not exist in this organization"));
                        }
                    })
                    .catch((error) =>{
                        console.log(error)
                        reject(error_function(error));
                    });
                }
                else
                {
                    reject(error_function("Notification not found"));
                }
            })
            .catch((error) =>{
                console.log(error)
                reject(error_function(error));
            });
        }
        catch(error)
        {
            console.log(error);
            reject(error_function(error))
        }
    })
};