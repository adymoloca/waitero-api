import { check } from "express-validator";
import bcrypt from 'bcrypt';
import {createToken} from '../utils/createToken.js';
import {validatePassword} from '../utils/validation/validatePassword.js';
import Admin from '../../models/adminModels/adminSchema.js';

const registerAdmin = async (req, res, next) => {
    
    const errors = check(req);
    let emailLowerCase =  req.body.email.toLowerCase();
    const admin_email = await Admin.findOne({ email: emailLowerCase });
    if(admin_email) {
        res.status(409).json({
            error:'Admin already registered with this email address!'
        })
        return 0;
    }

    const admin_phone = await Admin.findOne({ phone: req.body.phone });
    if(admin_phone) {
        res.status(409).json({
            error:'Admin already registered with this phone number.'
        })

        return 0;
    }

    if(!validatePassword(req.body.password)) {
        res.status(400).json({
            message: "Password invalid.",
            error: errors
        });

        return 0;
    }
    
    const newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        password: req.body.password
    });

    //hash the password
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

    newAdmin.save()
        .then(result => {
            result.loggedIn = true;
            result.password = undefined;
            const {token, refreshToken} = createToken(result);
            res.status(201).json({
                message: 'New admin added!',
                admin: result,
                token: token,
                refreshToken: refreshToken
            })
        })
        .catch(err => {
            res.status(400).json({
                message: err,
                errors: errors
            });
        });
};

export default registerAdmin;