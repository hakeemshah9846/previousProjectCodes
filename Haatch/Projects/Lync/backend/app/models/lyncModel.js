require('dotenv').config()
const axios = require('axios').default;
const jwt = require('jsonwebtoken');
const dayjs = require("dayjs");
const success_function = require('../response-handler').success_function;
const error_function = require('../response-handler').error_function;
const revokedToken = require('../db/models/revoked-tokens');

exports.loginModel = function(email, password) {
    return new Promise((resolve, reject)=>{
        let data ={
            "email": email,
            "password": password
        }
        var config = {
          method: 'post',
          url: `https://app.letslync.com/backend/api/web/site/login`,
          headers: {
              'Content-Type': 'application/json'
          },
          data : data
        };
        axios(config)
        .then(result => {
            //200 status code
            //data is the lync token
            let lync_token = result.data.data.token;
            //fetching organization id
            getData('https://app.letslync.com/backend/api/web/user/user-data', lync_token)
            .then( (result) => {
                //creating a token to validate in notification system only
                    let userdetails = {
                        "email": email,
                        "organization_id" : result.organization_id
                    }
                    let notification_token = jwt.sign(userdetails, process.env.PRIVATE_KEY, { expiresIn: '365d' });
                    let tokens = {
                        "lync_token" : lync_token,
                        "notification_token" : notification_token
                    }
                    resolve(success_function(tokens));
            })
            .catch(error => {
                console.log(error);
                reject(error_function(error));
            });
        })
        .catch(error => {
            console.log(error);
            //axios error handling
            if (error.response) {
                //401 status code for incorrect credentials
                reject(error_function(error.response.data));
            } else if (error.request) {
                reject(error_function(error.request));
            } else {
                reject(error_function(error.message));
            }
        });
    })
};

exports.logoutModel = function(token) {;
    return new Promise((resolve, reject)=>{
        //adding revoked token to database
        if(token)
        {
            revokedToken.findOrCreate({
                where: { token: token },
                defaults: {
                  token: token,
                  revoked_at: dayjs().format()
                }
            })
            .then(result =>{
                resolve(success_function("Logout Successful"));
            })
            .catch((error) =>{
                reject(error_function("Logout Failed"));
            });
        }
        else
        {
            let response = "Invalid Token";
            reject(error_function(response));
        }
    })
};

exports.revokeModel = function(token) {;
    return new Promise((resolve, reject)=>{
        if(token == null || token == "null" || token == "" || token == "undefined")
        {
            reject(error_function("Invalid Token"))
        }
        else
        {
            revokedToken.findOne({
              where: {
                token: token
              }
            })
            .then(result =>{
                if(result)
                {
                    resolve(true); 
                }
                else
                {
                    resolve(false);
                }
            })
            .catch((error) =>{
                reject(error_function(error));
            });
        }
    })
};

exports.getBranchesModel = function(lync_token) {;
    return new Promise((resolve, reject)=>{
        //fetching branches
        getData('https://app.letslync.com/backend/api/web/branch/list?branchId=undefined', lync_token)
        .then( (branch_result) => {
            resolve(success_function(branch_result));
        })
        .catch(error => {
            console.log(error);
            reject(error_function(error));
        });
    })
};

exports.getGroupsModel = function(lync_token, branch_id) {;
    return new Promise((resolve, reject)=>{
        //fetching groups
        getData(`https://app.letslync.com/backend/api/web/groups?branch_id=${branch_id}`, lync_token)
        .then( (group_result) => {
            resolve(success_function(group_result));
        })
        .catch(error => {
            console.log(error);
            reject(error_function(error));
        });
    })
};

exports.getUser = function(lync_token) {;
    return new Promise((resolve, reject)=>{
        //fetching groups
        getData(`https://app.letslync.com/backend/api/web/user/user-data`, lync_token)
        .then( (user_result) => {
            resolve(success_function(user_result));
        })
        .catch(error => {
            console.log(error);
            reject(error_function(error));
        });
    })
};

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