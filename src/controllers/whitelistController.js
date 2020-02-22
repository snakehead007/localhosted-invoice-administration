const Whitelist = require('../models/whitelist');

exports.addToWhitelist = async (req,res) => {
    if(req.params.secret===process.env.ADMIN_SECRET){
        let newWhitelist = new Whitelist({
            mail:req.params.mail
        });
        await newWhitelist.save((err) => {
            if(err){
                console.trace(err);
                res.send('error');
            }else{
                res.send('success');
            }
        });
    }else{
        res.send('failed');
    }
};