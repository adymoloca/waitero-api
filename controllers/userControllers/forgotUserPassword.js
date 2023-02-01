import bcrypt from 'bcrypt';
import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';
import sendEmail from '../utils/sendEmil.js';
import { validatePassword } from '../utils/validation/validatePassword.js';

const forgotUserPassword = async (req, res, next) => {

    const errors = check(req);

    const {email} = req.body;
    
    let user;
    try {
        user = await User.findOne({email: email});
    } catch (err) {
        return res.status(500).json({message: "Could not update user! ", error: err})
    }

    if(user) {
        // if(validatePassword(newPassword)) {
        //     user.password = newPassword;
        //     const salt = await bcrypt.genSalt(10);
        //     user.password = await bcrypt.hash(user.password, salt);

        //     user.updatedAt = new Date();

        //     const {password, ...responseUser} = user;

        //     try {
        //         await user.save({
        //             validateModifiedOnly: true,
        //         });
        //     } catch (err) {
        //         return res.status(500).json({message: "Could not update user! ", error: err})
        //     }

        //     return res.status(200).json({ 
        //         message: "User password updated!", 
        //         user: responseUser,
        //     })

        // } else {
        //     res.status(403).json({
        //         message: "New password format is not correct!"
        //     })
        // }

        sendEmail(email, "Test", "Verificare email");

    } else {
        res.status(403).json({
            message: "Old password inserted is not matching!"
        })
    }
}

export default forgotUserPassword;