const cron = require('node-cron');
const donationModel = require('../../models/donationModel');

exports.updateStatus = function () {
    cron.schedule('* * * * *', async () => {
        // fetching all pending donations
        donationModel.fetchProcessingInternal()
        .then((processing_donations)=>{
            processing_donations.map(async (obj) => {
                // updating current status of the payment from payment gateway
                await donationModel.updateStatusInternal(obj)
                .then(()=>{
                    // status updated
                }).catch((error)=>{
                    console.log(error);
                });
            });
        }).catch((error)=>{
            console.log(error);
        });
    });
};

