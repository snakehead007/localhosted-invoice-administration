exports.start = (err,req,res,next) => {
  //All timing events here
    onHour(8,18,()=>{
    });
    next();
};

onHour = (hours, minutes,callback) => {
    let time = new Date(2018, 11, 24, hours, minutes) - Date.now();
    var timeout = setTimeout(callback(), time);
};