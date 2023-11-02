
let dataModel = require('../models/dataModel');

exports.processData = async function (req, res) {
    try {

        //Getting array of integers
        let data = req.body.data;

        //Applying validations
        if(data.length < 1) {
            res.status(400).send({"message" : "No values"});
        }

        function doubleInt1(arr) {
            var values = arr.map((e) => {
              return Number(e) * 2;
            });
 
            return values;
          }

          var result = data.map((e) => {
            return Number(e*2);
          })

        if(result.length > 0) {
            console.log("Finding sum");
            let sum = 0;
            result.map((e)=> {
                sum = sum + Number(e);
            })

            //Saving to database
            let save_data = new dataModel({
                doubled_array : result,
                sum : sum,
                status : "completed",
            })

            let saved_data = await save_data.save();

            if(saved_data) {

                res.status(200).send({"message" : "Success","datas" : save_data});
                return;
            }else {
                res.status(400).send({"message" : "Failed"});
                return;
            }

        }else {
            res.status(400).send({"message" : "Values array empty"});
            return;
        }
        
    } catch (error) {
        console.log("Error : ", error);
        res.status(400).send({"message" : error.message});
        return;
        
    }
}



exports.checkStatus = async function (req, res) {
    try {
        let taskId = req.params.taskId;

        //Checking in database
        let data = await dataModel.findOne({_id : taskId});

        if(data) {
            res.status(200).send({"status" : data.status});
            return;
        }else {
            res.status(400).send({"message" : "Failed"});
            return;
        }

    } catch (error) {
        console.log("Errr" , error);
        res.status(400).send({"message" : error.message});
        return;
        
    }
}