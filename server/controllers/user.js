const User = require('../models/user');

exports.fetchAllUsers = async(req, res, next) => {
    const userId = req.params.userId;
    let regx;
    try {
        const user = await User.findOne({ _id: userId }).select('email -_id');
        const userMailDomain = user.email.split('@')[1].split('.')[0];
        if (userMailDomain === "gmail") {
            regx = /(\W|^)[\w.+\-]*@gmail.com(\W|$)/;
        } else if (userMailDomain === "hotmail") {
            regx = /(\W|^)[\w.+\-]*@hotmail.com(\W|$)/;
        } else if (userMailDomain === "nxb") {
            regx = /(\W|^)[\w.+\-]*@nxb.com(\W|$)/;
        }



        const userList = await User.find({ email: { $regex: regx } });
        res.status(200).json({ usersList: userList });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
