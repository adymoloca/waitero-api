import { check } from "express-validator";
import bcrypt from 'bcrypt';
import {createToken} from '../utils/createToken.js';
import {validatePassword} from '../utils/validation/validatePassword.js';
import Client from '../../models/clientModels/clientSchema.js';


const registerClient = async (req, res, next) => {
    
    const errors = check(req);
    let emailLowerCase = req.body.email.toLowerCase();
    
    const client_email = await Client.findOne({ email: emailLowerCase });
    if(client_email) {
        res.status(409).json({
            error:'Client already registered with this email address!'
        })
        return 0;
    }

    const client_phone = await Client.findOne({ phone: req.body.phone });
    if(client_phone) {
        res.status(409).json({
            error:'Client already registered with this email address!'
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
    
    const newClient = new Client({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        password: req.body.password
    });

    //hash the password
    const salt = await bcrypt.genSalt(10);
    newClient.password = await bcrypt.hash(newClient.password, salt);

    newClient.save()
        .then(result => {
            result.loggedIn = true;
            result.password = undefined;
            const {token, refreshToken} = createToken(result);
            res.status(201).json({
                message: 'New client added!',
                client: result,
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

export default registerClient;