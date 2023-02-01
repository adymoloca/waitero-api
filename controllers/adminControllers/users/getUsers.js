import { check } from "express-validator";
import User from '../../../models/userModels/userSchema.js';

const getUsers = async (req, res, next) => {

    const errors = check(req);

    try {
        await User.find().then(users => {
            res.status(200).json({
                message: "All users loaded",
                users: users
            })
        })
    } catch(err) {
        res.status(404).json({
            message: err,
            errors: errors
        })
    }     
};

export default getUsers;