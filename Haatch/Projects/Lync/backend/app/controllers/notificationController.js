const notificationModel = require('../models/notificationModel');

exports.getNotificationTypesController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    notificationModel.getNotificationTypesModel(token).then((notification_types)=>{
        res.send(notification_types);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.getResponseTypesController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    notificationModel.getResponseTypesModel(token).then((response_types)=>{
        res.send(response_types);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.fetchNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const notification_token = authHeader ? authHeader.split(' ')[1] : null;
    const lyncHeader = req.headers['lync-token'];
    const lync_token = lyncHeader ? lyncHeader.split(' ')[1] : null;
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let type_id = parseInt(req.query.type);
    let branch_id = parseInt(req.query.branch_id);
    let group_id = parseInt(req.query.group_id);
    let keyword = req.query.keyword;
    notificationModel.fetchModel(lync_token, notification_token, type_id, branch_id, group_id, keyword, page, limit).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.fetchSingleNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const notification_token = authHeader ? authHeader.split(' ')[1] : null;
    const lyncHeader = req.headers['lync-token'];
    const lync_token = lyncHeader ? lyncHeader.split(' ')[1] : null;
    let notification_id = req.params.notification_id;
    notificationModel.fetchSingleModel(lync_token, notification_token, notification_id).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.createNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    let type_id = req.body.type_id;
    let targets = req.body.targets;
    let title = req.body.title;
    let description = req.body.description;
    let scheduled_at = req.body.scheduled_at;
    let response_type = req.body.response_type;
    let status = req.body.status; // now or draft
    notificationModel.createModel(token, type_id, targets, title, description, scheduled_at, response_type, status).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.filesNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    let file = req.body.file;
    let host = req.headers.host
    notificationModel.filesModel(token, file, host).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.updateNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    let notification_id = req.params.notification_id;
    let type_id = req.body.type_id;
    let targets = req.body.targets;
    let title = req.body.title;
    let description = req.body.description;
    let scheduled_at = req.body.scheduled_at;
    let response_type = req.body.response_type;
    let status = req.body.status; // now or draft
    notificationModel.updateModel(token, notification_id, type_id, targets, title, description, scheduled_at, response_type, status).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.deleteNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    let notification_id = req.params.notification_id;
    notificationModel.deleteModel(token, notification_id).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.searchNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    let keyword = req.query.keyword;
    notificationModel.searchModel(token, keyword).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.lyncFetchNotificationController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const lyncHeader = req.headers['lync-token'];
    const lync_token = lyncHeader ? lyncHeader.split(' ')[1] : null;
    let organization_id = req.query.organization_id;
    let user_id = req.query.user_id;
    let group_id = req.query.group_id;
    notificationModel.lyncFetchModel(lync_token, organization_id, user_id, group_id).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.lyncGetResponsesController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const notification_token = authHeader ? authHeader.split(' ')[1] : null;
    const lyncHeader = req.headers['lync-token'];
    const lync_token = lyncHeader ? lyncHeader.split(' ')[1] : null;
    let notification_id = req.params.notification_id;
    notificationModel.lyncGetResponsesModel(notification_token, lync_token, notification_id).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.lyncAddResponsesController = function(req, res) {
    let organization_id = req.body.organization_id;
    let branch_id = req.body.branch_id;
    let group_id = req.body.group_id;
    let user_id = req.body.user_id;
    let notification_id = req.params.notification_id;
    let response = req.body.response;
    notificationModel.lyncAddResponsesModel(organization_id, branch_id, group_id, user_id, notification_id, response).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};