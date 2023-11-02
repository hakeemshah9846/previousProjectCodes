const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const Cryptr = require('cryptr');
const userModel = require('../db/models/users');

exports.firstTimeLogin = async function(email, otp) {
    return new Promise(async (resolve, reject) =>{
        try {
            if(email && otp) {
                let user = await userModel.findOne({where : {email : email}});

                if(!user){
                    reject({"status" : 401, "message" : "User not found"});
                }


                let otp_status = user.otp_status;
                let new_user = user.new_user;

             if(user && otp_status === "active" && new_user === "true"){
                    //Verifying one time password
                    bcrypt.compare(otp, user.otp, async (error, auth) => {
                        if(auth === true) {
                            //Valid otp
                            //Setting otp status to used
                            // await userModel.findOrCreate({where : {email : email}, defaults : { otp_status : "used"} });
                            // let set_otp_status = await user.setDataValue({otp_status : "used"});
//                             console.log("otp_status : ", set_otp_status);

                            let set_otp_status = await user.update({ otp_status: "used"}, {
                                where: {
                                  email: email
                                }
                              });

                              console.log("Set OTP Status : ", set_otp_status);

                            //Generating an access token
                            let access_token = jwt.sign({user_id : user.id}, process.env.PRIVATE_KEY, {expiresIn : '1d'});

                            resolve({"status" : 200, "data" : access_token, message : "First time login successful"})
                        }else{
                            reject({"status" : 401, "message" : "Invalid credentials"});
                        }
                    })

                }else {
                    if(!email) reject({"status" : 422, "message" : "Email is required"});
                    if(!otp) reject({"status" : 422, "message" : "One time password is required"});
                    if(otp_status !== "active") reject({"status" : 422, "message" : "Your one time password has been already used"});
                    if(new_user !== "true") reject({"status" : 422, "message" : "Already changed the password"});
                    reject({"status" : 422, "message" : "Cannot find user"});
                }
            }
        } catch (error) {

            reject({ "status": 400, "message": error.message ? error.message : error });

            
        }
    })
}

exports.login = async function (email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (email && password) {
                let user = await userModel.findOne({ where: { email : email } });
                // console.log("User : ", user);
                if (user) {

                    console.log("Password : ", user.password);

                    let user_data = {
                        isOperator : user.isOperator,
                        isSupervisor : user.isSupervisor,
                        password_changed : user.password_changed,
                    }

           
                    //verifying password
                    bcrypt.compare(password,user.password, async (error, auth) => {
                        if (auth === true) {
                            //valid credentials
                            //saving last login
                            let access_token = jwt.sign({ "user_id": user.id}, process.env.PRIVATE_KEY, { expiresIn: '10d' });

                            // if(!user.password_changed) {

                            //     reject({ "status": 401, data : access_token ,"message": "Reset password" ,user_data : user_data});
        
                            // }else {

                            

                            //Setting new_user flag to false
                            let update_user = await user.update({new_user : "false"});
                            let updated = update_user.save();

                            if(updated) {

      
                                resolve({ "status": 200, "data": access_token, "message": "Login Successful",user_data : user_data  });
                            }else {
                                reject({ "status": 401, "message": "Login unsuccessful" });

                            
                        }
                        }
                        else {
                            reject({ "status": 401, "message": "Incorrect password" });
                        }
                    });
                
                }
                else {
                    reject({ "status": 401, "message": "Email invalid" });
                }
            }
            else {
                if (!email) reject({ "status": 422, "message": "Email is required" });
                if (!password) reject({ "status": 422, "message": "Password is required" });
            }
        }
        catch (error) {
            reject({ "status": 400, "message": error.message ? error.message : error });
        }
    });
}
