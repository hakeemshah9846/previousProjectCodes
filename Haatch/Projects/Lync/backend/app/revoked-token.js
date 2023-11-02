require('dotenv').config();
const jwt = require('jsonwebtoken');
const lyncController = require('./controllers/lyncController');
const error_function = require('./response-handler').error_function;
exports.revokedToken = function(req, res, next)
{
    //middleware to check JWT
    //Token is set to null if authorization token is not defined
    //null token will be catched in inner modules
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null;
    jwt.verify(token, process.env.PRIVATE_KEY, function(err, decoded) {
        if (err) {
            if(token===null)
            {
                let response = error_function("Invalid Token");
                delete response['code'];
                res.status(401).send(response);
            }
            else
            {
                let response = error_function(err.message);
                delete response['code'];
                res.status(401).send(response);
            }
        }
        else
        {
            //checking if the token is in revoked list
            lyncController.revokeController(req, res)
            .then((revoked)=>{
                if(revoked===false)
                {
                    //token not in revoked list
                    next();
                }
                else if(revoked===true)
                {
                    //token is in revoked list
                    let response = error_function("Revoked Token");
                    delete response['code'];
                    res.status(401).send(response);
                }
                else
                {
                    let response = error_function("Something went wrong");
                    delete response['code'];
                    res.status(400).send(response);
                }
            }).catch((error)=>{
                let response = error_function(error);
                delete response['code'];
                res.status(400).send(response);
            });
        }
    });
}