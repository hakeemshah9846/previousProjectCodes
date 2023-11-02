const donationModel = require('../models/donationModel.js');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

exports.fetchDonation = function(req, res)
{
    let id = req.params.id;
    
    donationModel.fetchDonation(id)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.fetchDonations = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    let collection_id = req.query.collection;
    let added_by = req.query.added_by;
    let group_by = req.query.group_by;
    let status = req.query.status;
    let export_data = req.query.export;
    let page = req.query.page;
    let limit = req.query.limit;
    
    donationModel.fetchDonations(token, collection_id, added_by, group_by, status, export_data, page, limit)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.addDonation = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;

    let collection_id = req.params.id;
    let amount = Number(req.body.amount);
    let template = req.body.payment_template;
    
    donationModel.addDonation(token, collection_id, amount, template)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}