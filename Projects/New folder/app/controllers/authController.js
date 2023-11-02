const bcrypt = require("bcryptjs");
const users = require("../models/userModel");

exports.register = async function (req, res) {
  try {
    //Getting user details from request body
    const user_name = req.body.user_name;
    const password = req.body.password;

    //Applying validations
    if (!user_name) {
      res.status(400).send({ message: "User name is required" });
      return;
    }
    
    if (!password) {
      res.status(400).send({ message: "Password is required" });
      return;
    }

    //Generating salt and hashing password
    let salt = bcrypt.genSaltSync(10);
    let hashed_password = bcrypt.hashSync(password, salt);

    //Creating and saving new instance in users collection
    let new_user = new users({
      user_name: user_name,
      password: hashed_password,
    });
    let save_user = await new_user.save();

    //Sending Final response
    if (save_user) {
      res.status(201).send({ message: "User created successfully" });
      return;
    } else {
      res.status(400).send({ message: "User not created" });
      return;
    }
  } catch (error) {
    console.log("Error : ", error);
    res.status(400).send({ "message : ": error.message });
    return;
  }
};

exports.login = async function (req, res) {
  try {

    //Getting details from request body
    let user_name = req.body.user_name;
    let password = req.body.password;

    //Applying validations
    if (!user_name) {
      res.status(404).send({ message: "User name is required" });
      return;
    }
    if (!password) {
      res.status(404).send({ message: "Password is required" });
      return;
    }

    //Finding user of corresponding user_name from database
    let user = await users.findOne({ user_name });

    //If user found then verify password, else reject access
    if (user) {
      //Verifying password
      bcrypt.compare(password, user.password, async (error, auth) => {
        if (auth === true) {
          res.status(200).send({ "message": "Success" });
          return;
        }else {
            res.status(401).send({"message" : "Wrong password"});
            return;
        }
      });
    } else {
      res.status(404).send({ "message": "User not found" });
      return;
    }

  } catch (error) {
    console.log("Error : ", error);
    res.status(400).send({ message: error.message });
  }
};
