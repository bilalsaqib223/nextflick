// const { ValidationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.SignUp = async (req, res, next)=>{
    // const errors = ValidationResult(req);

    // if (!errors.isEmpty()) {
    //     const error = new Error('Validation failed.');
    //     error.statusCode = 422;
    //     error.data = errors.array();
    //     throw error;
    // }
    const name = req.body.name;
    const email = req.body.email;
    const address = req.body.address;
    try {
        const password = await bcrypt.hash(req.body.password,12);

        const newUser = new User({
            name,
            email,
            address,
            password
        });

        const result = newUser.save();
        console.log(result);
        res.status(201).json({message:"Successfully Signed Up For NextFlick"});
    } catch(err) {
        if(!err.statusCode) {
            res.status = 500
        }
        next(err);
    }
};


exports.SignIn = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            'somesupersecret', { expiresIn: '4h' }
        );
        res.status(200).json({ token: token, userId: loadedUser._id.toString(), userName: loadedUser.name, userEmail: loadedUser.email });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};