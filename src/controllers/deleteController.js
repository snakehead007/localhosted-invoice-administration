const Client = require('../models/client');
const Invoice = require('../models/invoice');
exports.delete_client = (req,res) =>{
    Client.deleteOne({fromUser:req.session._id,_id: req.params.idc}, function(err) {
        if(err) console.trace();
        if (!err) {
            Invoice.deleteMany({fromUser:req.session._id,fromClient: req.params.idc},function(err){
                if(err) console.trace();
                Client.find({fromUser:req.session._id}, function(err){
                    if(err) console.trace();
                    if(!err) {
                        res.redirect('/client/all');
                    }
                });
            });
        }
    });
};