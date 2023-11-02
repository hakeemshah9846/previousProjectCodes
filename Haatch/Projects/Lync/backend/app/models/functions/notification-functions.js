const Op = require('sequelize').Op;
const axios = require('axios').default;
const dayjs = require("dayjs");
var os = require("os");
var fs = require('fs');
const notifications = require('../../db/models/notifications');
const viewedNotifications = require('../../db/models/viewed-notifications');
const notificationTypes = require('../../db/models/notification-types');
const responseTypes = require('../../db/models/response-types');
const targetGroups = require('../../db/models/target-groups');

//function to check notification viewed or not viewed
exports.checkViewed = function(notification_id, user_id) {
    return new Promise((resolve, reject)=>{
        viewedNotifications.findOne({
            where: {
                [Op.and]: [{ notification_id: notification_id }, { user_id: user_id }]
            }
        })
        .then(viewed_result =>{
            if(viewed_result)
            {
                //notification viewed
                let response = {
                    "notification_id" : notification_id,
                    "viewed" : true
                }
                resolve(response);
            }
            else
            {
                //notification not viewed
                let response = {
                    "notification_id" : notification_id,
                    "viewed" : false
                }
                resolve(response);
            }
        })
        .catch((error) =>{
            reject(error);
        });
    })
}

//function to fetch notification details
exports.getNotification = function(notification_id, organization_id) {
    return new Promise((resolve, reject)=>{
        notifications.findOne({
            where: {
                [Op.and]: [{ id: notification_id }, { organization_id: organization_id }, { status: "active" }, { scheduled_at : null}]
            }
        })
        .then(notification_result =>{
            resolve(notification_result);
        })
        .catch((error) =>{
            reject(error);
        });
    })
}

//function to add viewed notifications for none response_types
exports.viewedNotification = function(notification, user_id) {
    notification.map((object)=>{
        if(object.dataValues.response_type == "None" || object.dataValues.response_type == "none")
        {
            viewedNotifications.create({
                notification_id	 : object.id,
                user_id : user_id
            })
        }
    });
}

//function to add viewed notifications for none response_types
exports.viewedResponseNotification = function(notification_id, user_id) {
    viewedNotifications.create({
        notification_id	 : notification_id,
        user_id : user_id
    });
}

//function to find response type and notification type
exports.formatNotification = function(notification) {
    return new Promise((resolve, reject)=>{
        let x = 1;
        let formated_notification = [];
        let formated_notification_id = [];
        notification.map((object)=>{
            notificationTypes.findOne({
                where: {
                    id: object.dataValues.type_id
                }
            })
            .then(notification_type =>{
                object.dataValues.notification_type=notification_type.title;
                responseTypes.findOne({
                    where: {
                        id: object.dataValues.response_type
                    }
                })
                .then(response_type =>{
                    object.dataValues.response_type=response_type.title;
                    delete object.dataValues['type_id'];
                    delete object.dataValues['deleted_at'];
                    //checking for duplicates
                    if(!(formated_notification_id.includes(object.dataValues.id)))
                    {
                        //duplicate notification
                        formated_notification.push(object);
                        formated_notification_id.push(object.dataValues.id);
                    }
                    
                    if(x==notification.length)
                    {
                        resolve(formated_notification);
                    }
                    else
                    {
                        x=x+1;
                    }
                })
                .catch((error) =>{
                    reject(error);
                });
            })
            .catch((error) =>{
                reject(error);
            });
        });
    })
}

//function to fetch groups and branches of a notification
exports.fetchBranchGroup = function(notification_id, branch_id, group_id, lync_token) {
    let x=1;
    let targets = [];
    let target_object={};
    return new Promise((resolve, reject)=>{
        let query;
        if(branch_id && group_id)
        {
            query = {[Op.and]: [{ notification_id: notification_id }, { branch_id: branch_id }, { group_id: group_id }]}
        }
        else if(branch_id)
        {
            query = {[Op.and]: [{ notification_id: notification_id }, { branch_id: branch_id }]}
        }
        else
        {
            query = {[Op.and]: [{ notification_id: notification_id }]}
        }
        targetGroups.findAll({
            where: query
        })
        .then(target_result=>{
            if(target_result.length>0)
            {
                target_result.map((object)=>{
                    let branch;
                    let group;
                    let branch_id;
                    let group_id;
                    //fetching branches
                    getData('https://app.letslync.com/backend/api/web/branch/list?branchId=undefined', lync_token)
                    .then( (branch_result) => {
                        branch_result.map((branch_object)=>{
                            if(branch_object.id==object.branch_id)
                            {
                                branch_id=branch_object.id;
                                branch=branch_object.name;
                            }
                        });
                        //fetching groups
                        getData(`https://app.letslync.com/backend/api/web/groups?branch_id=${object.branch_id}`, lync_token)
                        .then( (group_result) => {
                            group_result.map((group_object)=>{
                                if(group_object.id==object.group_id)
                                {
                                    group_id=group_object.id;
                                    group=group_object.name;
                                }
                            });
                            
                            target_object.branch_id=branch_id;
                            target_object.branch=branch;
                            target_object.group_id=group_id;
                            target_object.group=group;
                            targets.push(target_object);
                            target_object={};
                            if(x==target_result.length)
                            {
                                /* targets will be
                                    [
                                        {
                                            branch_id : 123,
                                            branch : abc,
                                            groups : [
                                                {
                                                    group_id : 2,
                                                    group : xyz
                                                }
                                            ]
                                        },
                                        {
                                            branch_id : 123,
                                            branch : abc,
                                            groups : [
                                                {
                                                    group_id : 2,
                                                    group : xyz
                                                }
                                            ]
                                        }
                                    ]
    
                                */
                                //combining same branches
                                
                                let prev_branch = null;
                                let target_array = [];
                                let group_array = [];
                                let y = 1;
                                let group_content = null;
                                let branch_content = null;
                                //sorting array to preserve ittereation order
                                targets.sort(function(a, b) {
                                    return parseFloat(a.branch_id) - parseFloat(b.branch_id);
                                });
                                targets.map((target_element)=>{
                                    if(target_element.branch_id==prev_branch)
                                    {
                                        let group_content={
                                            group_id : target_element.group_id,
                                            group : target_element.group,
                                        }
    
                                        group_array.push(group_content);
                                    }
                                    else
                                    {
                                        if(branch_content)
                                        {
                                            branch_content.groups=group_array;
                                            target_array.push(branch_content);
                                            branch_content = null;
                                            group_array = [];
    
                                            branch_content={
                                                branch_id : target_element.branch_id,
                                                branch : target_element.branch,
                                            }
    
                                            group_content={
                                                group_id : target_element.group_id,
                                                group : target_element.group,
                                            }
    
                                            group_array.push(group_content);
                                        }
                                        else
                                        {
                                            branch_content={
                                                branch_id : target_element.branch_id,
                                                branch : target_element.branch,
                                            }
    
                                            group_content={
                                                group_id : target_element.group_id,
                                                group : target_element.group,
                                            }
    
                                            group_array.push(group_content);
                                        }
    
                                        prev_branch=target_element.branch_id;
                                        
                                    }
    
                                    if(y==targets.length){
                                        if(branch_content)
                                        {
                                            branch_content.groups=group_array;
                                            target_array.push(branch_content);
                                        }
                                        resolve(target_array);
                                    }
                                    else
                                    {
                                        y=y+1;
                                    }
                                })
                            }
                            else
                            {
                                x=x+1;
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            reject(error);
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        reject(error);
                    });
                });
            }
            else
            {
                let response = [];
                resolve(response);
            }
        })
        .catch(error => {
            console.log(error);
            reject(error);
        })
    })
}

exports.getUserName = async function (user_id, lync_token)
{
    return new Promise((resolve, reject)=>{
        let url = `https://app.letslync.com/backend/api/web/users/${user_id}`;
        getData(url, lync_token)
        .then(response =>{
            resolve(response.first_name+" "+response.last_name);
        })
        .catch(error => {
            reject(error);
        });
    });
}

exports.uploadFile = async function (files, host)
{
    return new Promise(async(resolve, reject) => {
        try{
            let upload_file = files;
            let mime_type = ((upload_file.split(';')[0]).split(':')[1]).split('/')[1];

            //file size upto 100mb
            if(((mime_type=="mp4")||(mime_type=="png")||(mime_type=="jpg")||(mime_type=="jpeg") ||(mime_type=="pdf")))
            {
                let file_name = dayjs()+String(Math.floor(Math.random() * 100))+'.'+mime_type;
                let upload_path = `uploads/notifications`;

                let base64File = upload_file.split(';base64,').pop();
                fs.mkdir(upload_path, { recursive: true }, (err) => {
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {
                        upload_path = `uploads/notifications/${file_name}`;
                        fs.writeFile(upload_path, base64File, {encoding: 'base64'}, function(err) {
                            if(err) reject(err);
                            upload_path = host+'/'+upload_path;
                            resolve(upload_path);
                        });
                    }
                });

            }
            else
            {
                reject("File size upto 10 MB and Formats .mp4, .png, .jpg, .jpeg, .pdf are only allowed");
            }
        }
        catch(error)
        {
            reject(error);
        }
    });
}

//function to fetch data from lync
function getData(url, token) {
    return new Promise((resolve, reject)=>{
        axios({
            url: url,
            method: 'get',
            headers: {
               "Authorization" : "Bearer " + token
            }
         })
         .then(result => {
            //console.log(result.data.data)
            return resolve(result.data.data);
         })
         .catch(error => {
            console.log(error);
            //axios error handling
            if (error.response) {
                reject(error.response.data);
            } else if (error.request) {
                reject(error.request);
            } else {
                reject(error.message);
            }
         });
    })
}