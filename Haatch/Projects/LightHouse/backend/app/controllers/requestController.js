const requestModel = require('../models/requestModel.js');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

exports.fetchOneRequest = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;
    
    requestModel.fetchOneRequest(token, id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.fetchRequests = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let status = req.query.status;
    let added_by = req.query.added_by;
    let type = req.query.type;
    let change_from = req.query.change_from;
    let change_to = req.query.change_to;
    let page = req.query.page;
    let limit = req.query.limit;

    requestModel.fetchRequests(token, status, added_by, type, change_from, change_to, page, limit)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.addRequest = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let type = req.body.type;
    let change_to = req.body.change_to;
    
    requestModel.addRequest(token, type, change_to)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.updateRequest = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;
    let type = req.body.type;
    let change_to = req.body.change_to;

    requestModel.updateRequest(token, id, type, change_to)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.deleteRequest = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;

    requestModel.deleteRequest(token, id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.acceptRequest = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;

    requestModel.acceptRequest(token, id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.rejectRequest = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    let id = req.params.id;

    requestModel.rejectRequest(token, id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}