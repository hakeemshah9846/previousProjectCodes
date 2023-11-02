const informationModel = require('../models/informationModel.js');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

exports.fetchInformations = function(req, res)
{
    let title = req.query.title;
    informationModel.fetchInformations(title)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}