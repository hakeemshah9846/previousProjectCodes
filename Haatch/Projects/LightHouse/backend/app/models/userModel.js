const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const Cryptr = require("cryptr");
const users = require("../db/models/users");
const paymentModel = require("./paymentModel");
const otpTemplate = require("../utils/email-templates/otpTemplate").otpTemplate;
const otpVerified = require("../utils/email-templates/otpVerified").otpVerified;
const restPassword =
  require("../utils/email-templates/restPassword").restPassword;
const sendEmail = require("../utils/send-email").sendEmail;
const fileUpload = require("../utils/file-upload").fileUpload;
const fnsFunctions = require("../utils/fns-functions");
const mongoose = require("mongoose");

const cryptr = new Cryptr(process.env.PRIVATE_KEY);

exports.login = async function (email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      if (email && password) {
        let user = await users.findOne({
          $and: [{ email: email }, { status: "active" }],
        });
        if (user) {
          //verifying password
          bcrypt.compare(password, user.password, async (error, auth) => {
            if (auth === true) {
              //valid credentials
              //saving last login
              await users.updateOne(
                { _id: user._id },
                { last_login: dayjs().format() }
              );
              let access_token = jwt.sign(
                { user_id: user._id, user_type: user.type },
                process.env.PRIVATE_KEY,
                { expiresIn: "10d" }
              );
              resolve({
                status: 200,
                data: access_token,
                message: "Login Successful",
              });
            } else {
              reject({ status: 401, message: "Invalid Credentials" });
            }
          });
        } else {
          reject({ status: 401, message: "Invalid Credentials" });
        }
      } else {
        if (!email) reject({ status: 422, message: "Email is required" });
        if (!password) reject({ status: 422, message: "Password is required" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.register = async function (first_name, last_name, email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      if (first_name && last_name && email && password) {
        //checking if user exist
        let user = await users.findOne({ email: email });
        if (user && user.status == "active") {
          //user exist
          reject({ status: 403, message: "User Already Exist" });
        } else if (user && user.status == "blocked") {
          //user exist and email blocked
          reject({ status: 403, message: "This email is blocked" });
        } else {
          //user does not exist or the status is pending
          //creating user
          let salt = bcrypt.genSaltSync(10);
          let otp = Math.floor(1000 + Math.random() * 9000);
          let password_hash = bcrypt.hashSync(password, salt);
          let new_user = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password_hash,
            type: "user",
            account_type: "individual",
            status: "pending",
            secrets: {
              registration: {
                otp: otp,
                expiry: dayjs().add(10, "minute").format(),
              },
              password_token: null,
            },
            added_on: dayjs().format(),
            added_by: null,
          };

          await users.findOneAndUpdate({ email: email }, new_user, {
            upsert: true,
            new: true,
          });
          //sending otp
          let email_template = await otpTemplate(first_name, otp);
          sendEmail(email, "Помоград - код подтверждения", email_template);
          resolve({
            status: 200,
            message: "OTP send to the registered email address",
          });
        }
      } else {
        if (!first_name)
          reject({ status: 422, message: "First name is required" });
        if (!last_name)
          reject({ status: 422, message: "Last name is required" });
        if (!email) reject({ status: 422, message: "Email is required" });
        if (!password) reject({ status: 422, message: "Password is required" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};
  .catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.verifyRegistrationOTP = async function (email, otp) {
  return new Promise(async (resolve, reject) => {
    try {
      if (email && otp) {
        let user = await users.findOne({ $and: [{ email: email }] });
        if (user && user.secrets.registration) {
          if (
            dayjs().isBefore(dayjs(user.secrets.registration.expiry).format())
          ) {
            if (user.secrets.registration.otp == otp) {
              //updating status, short_name and secrets
              let access_token = jwt.sign(
                { user_id: user.id, user_type: user.type },
                process.env.PRIVATE_KEY,
                { expiresIn: "10d" }
              );
              await users.updateOne(
                { email: email },
                {
                  short_name: user._id,
                  status: "active",
                  secrets: { registration: null, password_token: null },
                }
              );
              //sending verified email
              let email_template = await otpVerified(user.first_name);
              sendEmail(email, "Добро пожаловать в Помоград!", email_template);
              resolve({
                status: 200,
                data: access_token,
                message: "OTP verified",
              });
            } else {
              reject({ status: 422, message: "Incorrect OTP" });
            }
          } else {
            reject({ status: 403, message: "OTP expired" });
          }
        } else {
          reject({ status: 403, message: "Forbidden" });
        }
<<<<<<< HEAD
      } else {
        if (!email) reject({ status: 422, message: "Email is required" });
        if (!otp) reject({ status: 422, message: "OTP is required" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.forgotPassword = async function (email) {
  return new Promise(async (resolve, reject) => {
    try {
      if (email) {
        let user = await users.findOne({ $and: [{ email: email }] });
        if (user) {
          let reset_token = jwt.sign(
            { user_id: user._id, user_type: user.type },
            process.env.PRIVATE_KEY,
            { expiresIn: "10m" }
          );
          let data = await users.updateOne(
            { email: email },
            { $set: { "secrets.password_token": reset_token } }
          );
          if (data.matchedCount === 1 && data.modifiedCount == 1) {
            let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
            let email_template = await restPassword(
              user.first_name,
              reset_link
            );
            sendEmail(email, "Помоград - сброс пароля", email_template);
            resolve({ status: 200, message: "Email sent successfully" });
          } else if (data.matchedCount === 0)
            reject({ status: 404, message: "User not found" });
          else reject({ status: 400, message: "Password reset failed" });
        } else {
          reject({ status: 403, message: "Forbidden" });
        }
      } else reject({ status: 422, message: "Email is required" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.passwordReset = async function (token, password) {
  return new Promise(async (resolve, reject) => {
    try {
      decoded = jwt.decode(token);
      let user = await users.findOne({
        $and: [{ _id: decoded.user_id }, { "secrets.password_token": token }],
      });
      if (user) {
        let salt = bcrypt.genSaltSync(10);
        let password_hash = bcrypt.hashSync(password, salt);
        let data = await users.updateOne(
          { _id: decoded.user_id },
          { $set: { password: password_hash, "secrets.password_token": null } }
        );
        if (data.matchedCount === 1 && data.modifiedCount == 1)
          resolve({ status: 200, message: "Password changed successfully" });
        else if (data.matchedCount === 0)
          reject({ status: 404, message: "User not found" });
        else reject({ status: 400, message: "Password reset failed" });
      } else reject({ status: 403, message: "Forbidden" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.fetchOne = async function (token, id) {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded;
      let passport = "";
      let filter = mongoose.Types.ObjectId.isValid(id)
        ? { _id: id }
        : { short_name: id };
      if (token) {
        decoded = jwt.decode(token);
        passport = decoded.user_type != "admin" ? "-passport" : " "; // fetching passport details only if user is admin
      }
      let user = await users
        .findOne(filter, `-secrets -payment_templates -password ${passport}`)
        .populate("social_media.platform")
        .lean();
      if (user) {
        resolve({ status: 200, data: user });
      } else {
        reject({ status: 404, message: "User Not Found" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.fetchAll = async function (
  token,
  type,
  account_type,
  status,
  keyword,
  page,
  limit
) {
  return new Promise(async (resolve, reject) => {
    try {
      let filters = [];
      let decoded = jwt.decode(token);
      let passport = token && decoded.user_type == "admin" ? " " : "-passport"; // fetching passport details only if user is admin
      if (type && type != "admin") filters.push({ type: { $in: type } });
      if (account_type) filters.push({ account_type: { $in: account_type } });
      if (status) filters.push({ status: status });
      if (keyword)
        filters.push({
          $or: [
            { first_name: { $regex: keyword, $options: "i" } },
            { last_name: { $regex: keyword, $options: "i" } },
          ],
        });
      // not considering admin as a user
      filters.push({ type: { $ne: "admin" } });
      let user = await users
        .find(
          filters.length > 0 ? { $and: filters } : null,
          `-secrets -payment_templates -password ${passport}`
        )
        .populate("social_media.platform")
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      let count = await users.count(
        filters.length > 0 ? { $and: filters } : null
      );
      let users_data = {
        count: count,
        users: user,
      };
      resolve({ status: 200, data: users_data });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.fetchProfile = async function (token) {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = jwt.decode(token);
      let user = await users
        .findOne({ _id: decoded.user_id }, "-secrets -password")
        .populate(
          "social_media.platform payment_templates.platform",
          "title icon feilds"
        )
        .lean();
      if (user) {
        //hiding secure feilds in payment templates
        if (user.payment_templates) {
          user.payment_templates.forEach(async (payment_template) => {
            let platform = payment_template.platform;
            if (platform && platform.feilds) {
              platform.feilds.forEach((obj) => {
                if (obj.secure == true) {
                  payment_template.platform_data[obj.value] = "";
=======
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.forgotPassword = async function (email) {
    return new Promise(async (resolve, reject) => {
        try {
            if (email) {
                let user = await users.findOne({ $and: [{ email: email }] });
                if (user) {
                    let reset_token = jwt.sign({ "user_id": user._id, "user_type": user.type }, process.env.PRIVATE_KEY, { expiresIn: '10m' });
                    let data = await users.updateOne({ email: email }, { $set: { "secrets.password_token": reset_token } });
                    if (data.matchedCount === 1 && data.modifiedCount == 1) {
                        let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`
                        let email_template = await restPassword(user.first_name, reset_link);
                        sendEmail(email, "Помоград - сброс пароля", email_template);
                        resolve({ "status": 200, "message": "Email sent successfully" });
                    }
                    else if (data.matchedCount === 0) reject({ "status": 404, "message": "User not found" });
                    else reject({ "status": 400, "message": "Password reset failed" });
                }
                else {
                    reject({ "status": 404, "message": "User not found" });
                }
            }
            else reject({ "status": 422, "message": "Email is required" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.passwordReset = async function (token, password) {
    return new Promise(async (resolve, reject) => {
        try {
            decoded = jwt.decode(token);
            let user = await users.findOne({ $and: [{ _id: decoded.user_id }, { "secrets.password_token": token }] });
            if (user) {
                let salt = bcrypt.genSaltSync(10);
                let password_hash = bcrypt.hashSync(password, salt);
                let data = await users.updateOne({ _id: decoded.user_id }, { $set: { password: password_hash, "secrets.password_token": null } });
                if (data.matchedCount === 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "Password changed successfully" });
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "User not found" });
                else reject({ "status": 400, "message": "Password reset failed" });
            }
            else reject({ "status": 403, "message": "Forbidden" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchOne = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded;
            let passport = "";
            let filter = mongoose.isObjectIdOrHexString(id) ? { _id: id } : { short_name: id };
            if (token) {
                decoded = jwt.decode(token);
                passport = decoded.user_type != "admin" ? "-passport" : " "; // fetching passport details only if user is admin
            }
            let user = await users.findOne(filter, `-secrets -payment_templates -password ${passport}`).populate('social_media.platform').populate('supporting', '_id first_name last_name type').lean();
            if (user) {
                resolve({ "status": 200, "data": user });
            }
            else {
                reject({ "status": 404, "message": "User Not Found" })
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchAll = async function (token, type, account_type, status, keyword, page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let filters = [];
            let decoded = jwt.decode(token);
            let passport = (token && decoded.user_type == "admin") ? " " : "-passport"; // fetching passport details only if user is admin
            if (type && type != "admin") filters.push({ type: type });
            if (account_type) filters.push({ account_type: account_type });
            if (status) filters.push({ status: status });
            if (keyword) filters.push({ $or: [{ first_name: { $regex: keyword, $options: 'i' } }, { last_name: { $regex: keyword, $options: 'i' } }] });
            // not considering admin as a user
            filters.push({ type: { $ne: "admin" } });
            let user = await users.find(filters.length > 0 ? { $and: filters } : null, `-secrets -payment_templates -password ${passport}`).populate('social_media.platform').populate('supporting', '_id first_name last_name type').sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
            let count = await users.count(filters.length > 0 ? { $and: filters } : null);
            let users_data = {
                "count": count,
                "users": user
            };
            resolve({ "status": 200, "data": users_data });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchProfile = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let user = await users.findOne({ _id: decoded.user_id }, '-secrets -password').populate('social_media.platform payment_templates.platform', 'title icon feilds').populate({ path: 'supporting', select: '_id first_name last_name type payment_templates', populate: { path: 'payment_templates', populate: { path: 'platform' } } }).lean();
            if (user) {
                //hiding secure feilds in user's payment templates
                if (user.payment_templates) {
                    user.payment_templates.forEach(async (payment_template) => {
                        let platform = payment_template.platform;
                        if (platform && platform.feilds) {
                            platform.feilds.forEach((obj) => {
                                if (obj.secure == true) {
                                    payment_template.platform_data[obj.value] = "";
                                }
                            });
                        }
                    });
                }
                //hiding secure feilds in organization's payment templates
                if (user.supporting && user.supporting.payment_templates) {
                    user.supporting.payment_templates.forEach(async (payment_template) => {
                        let platform = payment_template.platform;
                        if (platform && platform.feilds) {
                            platform.feilds.forEach((obj) => {
                                if (obj.secure == true) {
                                    payment_template.platform_data[obj.value] = "";
                                }
                            });
                        }
                    });
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
                }
              });
            }
          });
        }
        resolve({ status: 200, data: user });
      } else {
        reject({ status: 404, message: "User Not Found" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.updateProfile = async function (
  token,
  first_name,
  last_name,
  short_name,
  image,
  description,
  gender,
  phone,
  occupation,
  date_of_birth,
  birth_place,
  father_name,
  country,
  passport,
  user_policy,
  social_media
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (first_name && last_name) {
        let decoded = jwt.decode(token);
        //checking if short_name is unique
        let existing_short_name = false;
        if (short_name)
          existing_short_name = await users.findOne({
            $and: [
              { short_name: short_name },
              { _id: { $ne: decoded.user_id } },
            ],
          });
        if (!existing_short_name) {
          let user_data = {
            first_name: first_name,
            last_name: last_name,
            short_name: short_name,
            description: description,
            gender: gender,
            phone: phone,
            occupation: occupation,
            date_of_birth: date_of_birth,
            birth_place: birth_place,
            father_name: father_name,
            country: country,
            social_media: social_media,
            "passport.code": passport.code,
            "passport.number": passport.number,
            "passport.issued_region": passport.issued_region,
            "passport.issue_date": passport.issue_date,
            "passport.expiry_date": passport.expiry_date,
            "passport.passport_authority": passport.passport_authority,
            "passport.passport_code_authority":
              passport.passport_code_authority,
            updated_on: dayjs().format(),
            updated_by: decoded.user_id,
          };

          //uploading image
          if (image && image != "removed") {
            image = await fileUpload(image, "users");
            user_data["image"] = image;
          } else if (image == "removed") {
            user_data["image"] = null;
          }

          //uploading passport files
          if (passport) {
            if (passport.files && passport.files.length > 0) {
              let passport_array = [];
              await Promise.all(
                passport.files.map(async (obj) => {
                  let passport_obj = {
                    title: obj.title,
                    url: await fileUpload(obj.file, "users"),
                  };
                  passport_array.push(passport_obj);
                })
              );
              user_data["passport.files"] = passport_array;
            }
          }

          //uploading user_policy
          if (user_policy && user_policy != "removed") {
            user_data["user_policy"] = {
              title: user_policy.title,
              url: await fileUpload(user_policy.file, "users"),
            };
          } else if (user_policy == "removed") {
            user_data["user_policy"] = null;
          }

          await users.updateOne({ _id: decoded.user_id }, user_data);
          resolve({ status: 200, message: "Profile updated successfully" });
        } else {
          reject({ status: 422, message: "Short name already exist" });
        }
<<<<<<< HEAD
      } else {
        if (!first_name)
          reject({ status: 422, message: "First name is required" });
        if (!last_name)
          reject({ status: 422, message: "Last name is required" });
      }
    } catch (error) {
      console.log(error);
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.fetchOnePayment = async function (token, id) {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = jwt.decode(token);
      let payment_template = (
        await users
          .findOne(
            {
              $and: [{ _id: decoded.user_id }, { "payment_templates._id": id }],
            },
            { payment_templates: { $elemMatch: { _id: id } } }
          )
          .populate("payment_templates.platform")
          .lean()
      ).payment_templates[0];
      if (payment_template) {
        let platform = payment_template.platform;
        if (platform && platform.feilds) {
          platform.feilds.forEach((obj) => {
            if (obj.secure == true) {
              payment_template.platform_data[obj.value] = "";
=======
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.updateProfile = async function (token, first_name, last_name, short_name, image, description, gender, phone, occupation, date_of_birth, birth_place, father_name, country, passport, user_policy, social_media, public_email, account_type) {
    return new Promise(async (resolve, reject) => {
        try {
            if (first_name && last_name) {
                let decoded = jwt.decode(token);

                //checking if account type is valid
                let allowed_types = ["individual", "organization"];
                if (account_type && !(allowed_types.includes(account_type))) return reject({ "status": 422, "message": "Invalid account type" });
                //checking if short_name is unique
                let existing_short_name = false;
                if (short_name) existing_short_name = await users.findOne({ $and: [{ short_name: short_name }, { _id: { $ne: decoded.user_id } }] });
                if (existing_short_name) return reject({ "status": 422, "message": "Short name already exist" });
                
                let user_data = {
                    "first_name": first_name,
                    "last_name": last_name,
                    "short_name": short_name,
                    "description": description,
                    "gender": gender,
                    "phone": phone,
                    "occupation": occupation,
                    "date_of_birth": date_of_birth,
                    "birth_place": birth_place,
                    "father_name": father_name,
                    "country": country,
                    "social_media": social_media,
                    "passport.code": passport.code,
                    "passport.number": passport.number,
                    "passport.issued_region": passport.issued_region,
                    "passport.issue_date": passport.issue_date,
                    "passport.expiry_date": passport.expiry_date,
                    "passport.passport_authority": passport.passport_authority,
                    "passport.passport_code_authority": passport.passport_code_authority,
                    "public_email": public_email,
                    "account_type": account_type,
                    "updated_on": dayjs().format(),
                    "updated_by": decoded.user_id
                }

                //uploading image
                if (image && image != "removed") {
                    image = await fileUpload(image, "users");
                    user_data["image"] = image;
                }
                else if (image == "removed") {
                    user_data["image"] = null;
                }

                //uploading passport files
                if (passport) {
                    if (passport.files && passport.files.length > 0) {
                        let passport_array = [];
                        await Promise.all(
                            passport.files.map(async (obj) => {
                                let passport_obj = {
                                    "title": obj.title,
                                    "url": await fileUpload(obj.file, "users")
                                }
                                passport_array.push(passport_obj);
                            })
                        );
                        user_data["passport.files"] = passport_array;
                    }
                }

                //uploading user_policy
                if (user_policy && user_policy != "removed") {
                    user_data["user_policy"] = {
                        "title": user_policy.title,
                        "url": await fileUpload(user_policy.file, "users")
                    };
                }
                else if (user_policy == "removed") {
                    user_data["user_policy"] = null;
                }

                await users.updateOne({ _id: decoded.user_id }, user_data);
                resolve({ "status": 200, "message": "Profile updated successfully" });

            }
            else {
                if (!first_name) reject({ "status": 422, "message": "First name is required" });
                if (!last_name) reject({ "status": 422, "message": "Last name is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchOnePayment = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            let data;
            let decoded = jwt.decode(token);
            let user = await users.findOne({ _id: decoded.user_id }).populate('payment_templates.platform').populate({ path: 'supporting', select: '_id first_name last_name type payment_templates', populate: { path: 'payment_templates', populate: { path: 'platform' } } });
            //checking if user supports any organization
            if (user.supporting) data = user.supporting.payment_templates.filter((obj) => obj._id == mongoose.Types.ObjectId(id));
            else data = user.payment_templates.filter((obj) => obj._id == mongoose.Types.ObjectId(id));
            if (data.length > 0) {
                let payment_template = data[0];
                let platform = payment_template.platform;
                if (platform && platform.feilds) {
                    platform.feilds.forEach((obj) => {
                        if (obj.secure == true) {
                            payment_template.platform_data[obj.value] = "";
                        }
                    });
                }
                resolve({ "status": 200, "data": payment_template });
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
            }
          });
        }
<<<<<<< HEAD
        resolve({ status: 200, data: payment_template });
      } else reject({ status: 404, data: "Payment Template not found" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.fetchPayments = async function (token) {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = jwt.decode(token);
      let payment_templates = (
        await users
          .findOne({ _id: decoded.user_id })
          .populate("payment_templates.platform")
          .sort({ _id: -1 })
          .lean()
      ).payment_templates;
      payment_templates.forEach(async (payment_template) => {
        let platform = payment_template.platform;
        if (platform && platform.feilds) {
          platform.feilds.forEach((obj) => {
            if (
              obj.secure == true &&
              payment_template.platform_data[obj.value]
            ) {
              payment_template.platform_data[obj.value] = "";
            }
          });
        }
      });
      resolve({ status: 200, data: payment_templates });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.addPayment = async function (token, payment_template) {
  return new Promise(async (resolve, reject) => {
    try {
      if (payment_template) {
        let platform = await paymentModel.fetchOneInternal(
          payment_template.platform
        );
        if (platform) {
          let decoded = jwt.decode(token);
          //encrypting secure feilds
          platform.feilds.forEach((obj) => {
            if (
              obj.secure == true &&
              payment_template.platform_data[obj.value]
            ) {
              let encrypted_data = cryptr.encrypt(
                payment_template.platform_data[obj.value]
              );
              payment_template.platform_data[obj.value] = encrypted_data;
=======
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.fetchPayments = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            let payment_templates;
            let decoded = jwt.decode(token);
            let user = await users.findOne({ _id: decoded.user_id }).populate('payment_templates.platform').populate({ path: 'supporting', select: '_id first_name last_name type payment_templates', populate: { path: 'payment_templates', populate: { path: 'platform' } } }).sort({ _id: -1 }).lean();
            //checking if the user is supporting any organization
            // if (user.supporting) payment_templates = user.supporting.payment_templates;
            // else payment_templates = user.payment_templates;
            payment_templates = user.payment_templates;
            payment_templates.forEach(async (payment_template) => {
                let platform = payment_template.platform;
                if (platform && platform.feilds) {
                    platform.feilds.forEach((obj) => {
                        if (obj.secure == true && payment_template.platform_data[obj.value]) {
                            payment_template.platform_data[obj.value] = "";
                        }
                    });
                }
            });
            resolve({ "status": 200, "data": payment_templates });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.addPayment = async function (token, payment_template) {
    return new Promise(async (resolve, reject) => {
        try {
            if (payment_template) {
                let decoded = jwt.decode(token);
                let user = await fetchOneInternal(decoded.user_id);
                //checking if the user is supporting any organization
                if (user.account_type == "individual" || (user.account_type == "organization" && user.type == "curator")) {
                    let platform = await paymentModel.fetchOneInternal(payment_template.platform)
                    if (platform && platform.allowed.includes(user.account_type)) {
                        //encrypting secure feilds
                        platform.feilds.forEach((obj) => {
                            if (obj.secure == true && payment_template.platform_data[obj.value]) {
                                let encrypted_data = cryptr.encrypt(payment_template.platform_data[obj.value]);
                                payment_template.platform_data[obj.value] = encrypted_data;
                            }
                        });
                        await users.updateOne({ _id: decoded.user_id }, { $push: { payment_templates: payment_template } }, { new: true });
                        resolve({ "status": 200, "message": "Payment Template added Successfully" });
                    }
                    else {
                        if (!platform) reject({ "status": 422, "message": "Invalid Payment Platform" });
                        if (!(platform.allowed.includes(user.account_type))) reject({ "status": 403, "message": "You are not allowed to use this platform" });
                    }
                }
                else reject({ "status": 403, "message": "You are not allowed to create payment templates" });
            }
            else {
                if (!payment_template) reject({ "status": 422, "message": "Payment template is required" });
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
            }
          });
          await users.updateOne(
            { _id: decoded.user_id },
            { $push: { payment_templates: payment_template } },
            { new: true }
          );
          resolve({
            status: 200,
            message: "Payment Template added Successfully",
          });
        } else {
          reject({ status: 422, message: "Invalid Payment Platform" });
        }
<<<<<<< HEAD
      } else {
        if (!payment_template)
          reject({ status: 422, message: "Payment template is required" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.updatePayment = async function (
  token,
  template_id,
  payment_template,
  otp
) {
  return new Promise(async (resolve, reject) => {
    try {
      if (template_id && payment_template && otp) {
        let platform = await paymentModel.fetchOneInternal(
          payment_template.platform
        );
        if (platform) {
          let decoded = jwt.decode(token);
          //checking otp
          let user = await fetchOneInternal(decoded.user_id);
          if (user && user.secrets.payments) {
            if (
              dayjs().isBefore(dayjs(user.secrets.payments.expiry).format())
            ) {
              if (user.secrets.payments.otp == otp) {
                //encrypting secure feilds
                platform.feilds.forEach((obj) => {
                  if (
                    obj.secure == true &&
                    payment_template.platform_data[obj.value]
                  ) {
                    let encrypted_data = cryptr.encrypt(
                      payment_template.platform_data[obj.value]
                    );
                    payment_template.platform_data[obj.value] = encrypted_data;
                  }
                });
                // create empty object to hold new properties
                var update_data = {};
                for (var key in payment_template) {
                  if (payment_template.hasOwnProperty(key)) {
                    // assign property to new object with modified key
                    update_data["payment_templates.$." + key] =
                      payment_template[key];
                  }
                }
                await users.updateOne(
                  {
                    $and: [
                      { _id: decoded.user_id },
                      { "payment_templates._id": template_id },
                    ],
                  },
                  { $set: update_data }
                );
                resolve({
                  status: 200,
                  message: "Payment Template updated Successfully",
                });
              } else reject({ status: 403, message: "Invalid OTP" });
            } else reject({ status: 403, message: "OTP Expired" });
          } else reject({ status: 403, message: "Forbidden" });
        } else {
          reject({ status: 422, message: "Invalid Payment Platform" });
        }
      } else {
        if (!template_id)
          reject({ status: 422, message: "Payment template ID is required" });
        if (!payment_template)
          reject({ status: 422, message: "Payment template is required" });
        if (!otp) reject({ status: 422, message: "OTP is required" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.changeType = async function (token, id, type) {
  return new Promise(async (resolve, reject) => {
    try {
      if (id && type) {
        let decoded = jwt.decode(token);
        let user_data = {
          type: type,
          updated_on: dayjs().format(),
          updated_by: decoded.user_id,
        };
        let data = await users.updateOne({ _id: id }, { $set: user_data });
        if (data.matchedCount === 1 && data.modifiedCount == 1)
          resolve({ status: 200, message: "User type updated Successfully" });
        else if (data.matchedCount === 0)
          reject({ status: 404, message: "User not found" });
        else reject({ status: 400, message: "User type update failed" });
      } else {
        if (!id) reject({ status: 422, message: "User ID is required" });
        if (!type) reject({ status: 422, message: "User type is required" });
      }
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};
=======
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.updatePayment = async function (token, template_id, payment_template, otp) {
    return new Promise(async (resolve, reject) => {
        try {
            if (template_id && payment_template && otp) {
                let decoded = jwt.decode(token);
                let user = await fetchOneInternal(decoded.user_id);
                //checking if the user is supporting any organization
                if (user.account_type == "individual" || (user.account_type == "organization" && user.type == "curator")) {
                    let platform = await paymentModel.fetchOneInternal(payment_template.platform);
                    if (platform && platform.allowed.includes(user.account_type)) {
                        //checking otp
                        let user = await fetchOneInternal(decoded.user_id);
                        if (user && user.secrets.payments) {
                            if (dayjs().isBefore(dayjs(user.secrets.payments.expiry).format())) {
                                if (user.secrets.payments.otp == otp) {
                                    //encrypting secure feilds
                                    platform.feilds.forEach((obj) => {
                                        if (obj.secure == true && payment_template.platform_data[obj.value]) {
                                            let encrypted_data = cryptr.encrypt(payment_template.platform_data[obj.value]);
                                            payment_template.platform_data[obj.value] = encrypted_data;
                                        }
                                    });
                                    // create empty object to hold new properties 
                                    var update_data = {}
                                    for (var key in payment_template) {
                                        if (payment_template.hasOwnProperty(key)) {
                                            // assign property to new object with modified key
                                            update_data["payment_templates.$." + key] = payment_template[key];
                                        }
                                    }
                                    await users.updateOne({ $and: [{ _id: decoded.user_id }, { "payment_templates._id": template_id }] }, { $set: update_data });
                                    resolve({ "status": 200, "message": "Payment Template updated Successfully" });
                                }
                                else reject({ "status": 403, "message": "Invalid OTP" });
                            }
                            else reject({ "status": 403, "message": "OTP Expired" });
                        }
                        else reject({ "status": 403, "message": "Forbidden" });
                    }
                    else {
                        if (!platform) reject({ "status": 422, "message": "Invalid Payment Platform" });
                        if (!(platform.allowed.includes(user.account_type))) reject({ "status": 403, "message": "You are not allowed to use this platform" });
                    }
                }
                else reject({ "status": 403, "message": "You are not allowed to create payment templates" });
            }
            else {
                if (!template_id) reject({ "status": 422, "message": "Payment template ID is required" });
                if (!payment_template) reject({ "status": 422, "message": "Payment template is required" });
                if (!otp) reject({ "status": 422, "message": "OTP is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.changeType = async function (token, id, type) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id && type) {
                let decoded = jwt.decode(token);
                let user_data = {
                    type: type,
                    updated_on: dayjs().format(),
                    updated_by: decoded.user_id
                }
                let data = await users.updateOne({ _id: id }, { $set: user_data });
                if (data.matchedCount === 1 && data.modifiedCount == 1) resolve({ "status": 200, "message": "User type updated Successfully" });
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "User not found" });
                else reject({ "status": 400, "message": "User type update failed" });
            }
            else {
                if (!id) reject({ "status": 422, "message": "User ID is required" });
                if (!type) reject({ "status": 422, "message": "User type is required" });
            }
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b

exports.fetchInn = async function (token, request) {
  return new Promise(async (resolve, reject) => {
    try {
      if (request) {
        let decoded = jwt.decode(token);
        //checking if the user have existing inn data
        let user = await users.findOne({ _id: decoded.user_id });
        if (user?.inn?.data && Object.keys(user.inn.data).length != 0)
          resolve({ status: 200, data: user.inn });
        else {
          if (user) {
            //fetching inn details from fns
            let inn_details = {
              number: request,
              data: await fnsFunctions.fetchInn(request),
            };
            if (
              inn_details?.data &&
              Object.keys(inn_details?.data).length != 0
            ) {
              let user_data = {
                inn: inn_details,
                updated_on: dayjs().format(),
                updated_by: decoded.user_id,
              };
              let data = await users.updateOne(
                { _id: decoded.user_id },
                { $set: user_data }
              );
              if (data.matchedCount === 1 && data.modifiedCount == 1)
                resolve({
                  status: 200,
                  message: "User inn updated successfully",
                  data: inn_details,
                });
              else if (data.matchedCount === 0)
                reject({ status: 404, message: "User not found" });
              else reject({ status: 400, message: "User type update failed" });
            } else
              reject({ status: 400, message: "Inn details fetching failed" });
          } else reject({ status: 404, message: "User not found" });
        }
<<<<<<< HEAD
      } else reject({ status: 422, message: "Inn request number is required" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.generateOTP = async function (token) {
  return new Promise(async (resolve, reject) => {
    try {
      let decoded = jwt.decode(token);
      let otp_data = {
        otp: Math.floor(1000 + Math.random() * 9000),
        expiry: dayjs().add(10, "minute").format(),
      };
      let data = await users.findOneAndUpdate(
        { _id: decoded.user_id },
        { $set: { "secrets.payments": otp_data } },
        { new: true }
      );
      if (data) {
        let email_template = await otpTemplate(
          data.first_name,
          data.secrets.payments.otp
        );
        sendEmail(data.email, "Помоград - код подтверждения", email_template);
        resolve({ status: 200, message: "OTP send successfully" });
      } else reject({ status: 404, message: "Collection not found" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.changeSupport = async function (token, curator) {
  return new Promise(async (resolve, reject) => {
    try {
      let supporting_data;
      let decoded = jwt.decode(token);
      if (curator == removed) supporting_data = null;
      else {
        //checking if curartor exist
        let user = await fetchOneInternal(curator);
        if (user) {
          supporting_data = {
            curator: curator,
            status: "pending",
          };
        } else return reject({ status: 403, message: "Invalid curator" });
      }
      let user_data = {
        supporting: supporting_data,
        updated_on: dayjs().format(),
        updated_by: decoded.user_id,
      };
      let data = await users.updateOne(
        { _id: decoded.user_id },
        { $set: user_data }
      );
      if (data.matchedCount === 1 && data.modifiedCount == 1)
        resolve({ status: 200, message: "Supporting changed successfully" });
      else if (data.matchedCount === 0)
        reject({ status: 404, message: "User not found" });
      else reject({ status: 400, message: "Supporting changing failed" });
    } catch (error) {
      reject({
        status: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });
    }
  });
};

exports.organizationcount = async function getOrganizationCount() {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await users.count({ account_type: "organization" });
      if (count) {
        resolve({ status: 200, data: count });
      } else {
        reject({ status: 404, message: "No users found" });
      }
    } catch (error) {
      reject({ status: 400, message: error });
    }
  });
};
=======
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}

exports.generateOTP = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let otp_data = {
                otp: Math.floor(1000 + Math.random() * 9000),
                expiry: (dayjs().add(10, 'minute')).format()
            };
            let data = await users.findOneAndUpdate({ _id: decoded.user_id }, { $set: { "secrets.payments": otp_data } }, { new: true });
            if (data) {
                let email_template = await otpTemplate(data.first_name, data.secrets.payments.otp);
                sendEmail(data.email, "Помоград - код подтверждения", email_template);
                resolve({ "status": 200, "message": "OTP send successfully" });
            }
            else reject({ "status": 404, "message": "Collection not found" });
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
            else reject({ "status": 400, "message": error });
        }
    });
}
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b

// For internal usage only.
// Please do not map the below function to any public API end-points as it is intented to use only
// for the internal functionalities and the response data may contain highly confidential informations
// Mapping these to public APIs will affect the security of the project and privacy of the users

const fetchOneInternal = (exports.fetchOneInternal = async function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await users.findOne({ _id: id }).lean();
      if (user) {
        resolve(user);
      } else {
        reject("User Not Found");
      }
    } catch (error) {
      reject(error.message ? error.message : error);
    }
  });
});

const fetchIdsInternal = (exports.fetchIdsInternal = async function (keyword) {
  return new Promise(async (resolve, reject) => {
    try {
      let users_data = await users
        .find(
          {
            $or: [
              { first_name: { $regex: keyword, $options: "i" } },
              { last_name: { $regex: keyword, $options: "i" } },
            ],
          },
          "_id"
        )
        .lean();
      resolve(users_data);
    } catch (error) {
      reject(error.message ? error.message : error);
    }
  });
});

const updateOneInternal = (exports.updateOneInternal = async function (
  id,
  user_data
) {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await users.updateOne({ _id: id }, { $set: user_data });
      resolve(data);
    } catch (error) {
      reject(error.message ? error.message : error);
    }
  });
});

const fetchOnePaymentInternal = (exports.fetchOnePaymentInternal =
  async function (id) {
    return new Promise(async (resolve, reject) => {
<<<<<<< HEAD
      try {
        let data = await users
          .findOne(
            { "payment_templates._id": mongoose.Types.ObjectId(id) },
            {
              payment_templates: {
                $elemMatch: { _id: mongoose.Types.ObjectId(id) },
              },
            }
          )
          .populate("payment_templates.platform")
          .lean();
        if (data && data.payment_templates.length > 0)
          resolve(data.payment_templates[0]);
        else reject("Payment template not found");
      } catch (error) {
        reject(error.message ? error.message : error);
      }
    });
  });
=======
        try {
            let user = await users.findOne({ _id: id }).populate({ path: 'supporting', populate: { path: 'payment_templates', populate: { path: 'platform' } } }).lean();
            if (user) resolve(user);
            else reject("User Not Found");
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

const fetchIdsInternal = exports.fetchIdsInternal = async function (keyword) {
    return new Promise(async (resolve, reject) => {
        try {
            let users_data = await users.find({ $or: [{ first_name: { $regex: keyword, $options: 'i' } }, { last_name: { $regex: keyword, $options: 'i' } }] }, '_id').lean();
            resolve(users_data);
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

const updateOneInternal = exports.updateOneInternal = async function (id, user_data) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await users.updateOne({ _id: id }, { $set: user_data });
            resolve(data)
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}

const fetchOnePaymentInternal = exports.fetchOnePaymentInternal = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await users.findOne({ "payment_templates._id": mongoose.Types.ObjectId(id) }, { payment_templates: { $elemMatch: { _id: mongoose.Types.ObjectId(id) } } }).populate('payment_templates.platform').lean();
            if (data && data.payment_templates.length > 0) resolve(data.payment_templates[0]);
            else reject("Payment template not found")
        }
        catch (error) {
            if (process.env.NODE_ENV == "production") reject(error ? (error.message ? error.message : error) : "Something went wrong");
            else reject({ "status": 400, "message": error });
        }
    });
}
>>>>>>> 01de542bda33bda283000971baa7f7f7c085630b
