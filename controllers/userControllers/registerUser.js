import bcrypt from 'bcrypt';
import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';
import { createToken } from '../utils/createToken.js';
import { validatePassword  } from '../utils/validation/validatePassword.js';

const registerUser = async (req, res, next) => {

    const errors = check(req);
    const user_mail = await User.findOne({ email: req.body.email });

    if(user_mail){
        res.status(409).json({
            error:'User already registered with this email address!'
        });

        return 0;
    }
    const user_phone = await User.findOne({ phone: req.body.phone });

    if(user_phone) {
        res.status(409).json({
            message: 'User already registered with this phone number!', 
            error: errors
        });

        return 0;
    }

    if(!validatePassword(req.body.password)) {
        res.status(400).json({
            message: "Password invalid.",
            error: errors
        });

        return 0;
    }

    const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        password: req.body.password
    });

    //hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    
    newUser.save()
        .then(result => {
            result.loggedIn = true;
            result.password = undefined;
            const {token, refreshToken} = createToken(result);
            res.status(201).json({
                message: 'New user added!',
                user: result,
                token: token,
                refreshToken: refreshToken
            })
        })
        .catch(err => {
            res.status(400).send(err);
        });

};
export default  registerUser;