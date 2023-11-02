const mongoose = require("mongoose");

function connect()
{
    return new Promise(async (resolve, reject) => {
        var options = {
            keepAlive: true,
            connectTimeoutMS: 30000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
    
        // mongoose.connect(process.env.MONGODB_URI, options, (err)=>{
        //     if (err)
        //     {
        //         console.log(err);
        //     }
        //     else
        //     {
        //         console.log("Database Connection Established");
        //     }
        // });

        // const conn = await mongoose.createConnection(process.env.MONGODB_URI).
        //  asPromise();
        // conn.readyState; // 1, means Mongoose is connected

        // if(conn.readyState === 1) {
        //     console.log("Database connection established");
        // }else {
        //     console.log("Database connection unsuccessful");
        // }


        const conn = await mongoose.connect(process.env.MONGODB_URI)
            .then(()=> {
                console.log(" Database connection established");
            })
            .catch((err)=> {
                console.log("Connection failed");
                console.log("Error : ", err);
            })
    //    conn.readyState; // 1, means Mongoose is connected

    //    if(conn.readyState === 1) {
    //        console.log("Database connection established");
    //    }else {
    //        console.log("Database connection unsuccessful");
    //    }
//    })
    })
}

function close(){
    mongoose.disconnect();
}

module.exports = {
    connect,
    close
};