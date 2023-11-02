const lyncModel = require('../models/lyncModel');

exports.loginController = function(req, res) {
    let email = req.body.email;
    let password = req.body.password; 
    lyncModel.loginModel(email, password).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        delete error['code'];
        res.status(401).send(error);
    });
};

exports.logoutController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    lyncModel.logoutModel(token).then((message)=>{
        res.send(message);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.revokeController = function(req, res) {
    return new Promise((resolve, reject)=>{
        //Token is set to null if authorization token is not defined
        //null token will be catched in inner modules
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null;
        lyncModel.revokeModel(token).then((message)=>{
            resolve(message);
        }).catch((error)=>{
            reject(error);
        });
    });
};

exports.getGroupsController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['lync-token'];
    const lync_token = authHeader ? authHeader.split(' ')[1] : null;
    let branch_id = req.params.branch_id;
    lyncModel.getGroupsModel(lync_token, branch_id).then((groups)=>{
        res.send(groups);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.getBranchesController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['lync-token'];
    const lync_token = authHeader ? authHeader.split(' ')[1] : null;
    lyncModel.getBranchesModel(lync_token).then((branches)=>{
        res.send(branches);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};

exports.getUserController = function(req, res) {
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['lync-token'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    lyncModel.getUser(token).then((response_types)=>{
        res.send(response_types);
    }).catch((error)=>{
        let code = error.code;
        delete error['code'];
        res.status(code).send(error);
    });
};