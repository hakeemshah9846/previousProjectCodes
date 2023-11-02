const paymentModel = require('../models/paymentModel.js');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

exports.fetchOne = function(req, res)
{
    let id = req.params.id;
    paymentModel.fetchOne(id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.fetchAll = function(req, res)
{
    let status = req.query.status;
    let page = req.query.page;
    let limit = req.query.limit;

    paymentModel.fetchAll(status, page, limit)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}