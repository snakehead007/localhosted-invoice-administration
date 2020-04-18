

exports.getSupportPage = async (req,res) => {
  req.flash('danger','We are currently working on this feature, will be available soon.');
  res.redirect('back');
};

exports.adminGetSupportPage = async (req,res) =>{
  req.flash('danger','We are currently working on this feature, will be available soon.');
  res.redirect('back');
};