const loginManager = require('../managers/loginManager');
const logoutManager = require('../managers/logoutManager');

const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;
const checkRevoked = require('../managers/logoutManager').checkRevoked;
const validateFirstTimeLoginInput = require('../validation/first_time_login');
const validateLoginInput = require('../validation/login');


exports.firstTimeLogin = function(req,res){

    //Login after admin creates a new user, sends an otp to the user through email and the user has to enter the otp and his registered email(which is entered by admin) through first time login page, users can also use forgot password api to reset their password if registered by admin


    let {errors, isValid}=validateFirstTimeLoginInput(req.body);


    if(isValid){

        let email = req.body.email;
        let otp = req.body.otp; //one time password
    
        loginManager.firstTimeLogin(email, otp)
        .then((result) => {
            let response = success_function(result);
            res.status(result.status).send(response);
        }).catch((error)=> {
            let response = error_function(error);
            res.status(error.status).send(response);
        })
    }else{
        res.status(400).send({"status" : 400, "error" : errors, "message" : "Validation Failed"});
    }

}


exports.login = function(req, res)
{
    //login for users, this cannot be used by users who hasn't completed first time login or resetted their password

    const {errors, isValid} = validateLoginInput(req.body);

    if(isValid){


        let email = req.body.email;
        let password = req.body.password;
    
        loginManager.login(email, password)
        .then((result)=>{
            let response = success_function(result);
            response.user_data = result.user_data;
            res.status(result.status).send(response);
        }).catch((error)=>{
            let response = error_function(error);
            // response.user_data = error.user_data;
            res.status(error.status).send(response);
        });
    }else{
        res.status(400).send({"status" : 400, "errors" : errors, "message" : "Validation failed"});
    }
}


exports.logout = async function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    console.log("Logout called");

    // if (
    //     token == null ||
    //     token == "null" ||
    //     token == "" ||
    //     token == "undefined"
    //   ) {
    //     console.log()
    //     return res.status(406).send(success_function({status : 406, message : "Only login users can logout"}));
    //   }

    if(token){

                console.log("Logout called");
    
              let isRevoked =  await checkRevoked(token);
              console.log("isRevoked : ", isRevoked);


    if(!isRevoked){


        logoutManager.revoke(token)
        .then((result)=>{
            let response = success_function(result);
            res.status(result.status).send(response);
        }).catch((error)=>{
            let response = error_function(error);
            res.status(error.status).send(response);
        });

    }else{
        console.log("Token already in revoked list");
        res.status(406).send(error_function({status : 406, message : "Token already in revoked list"}));
    }
}else{
    return res.status(406).send(success_function({status : 406, message : "Only login users can logout"}));
}

    }

    
