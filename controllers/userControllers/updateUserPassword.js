import bcrypt from 'bcrypt';
import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';
import { validateObjectId } from '../utils/validation/validateObjectId.js';
import { validatePassword } from '../utils/validation/validatePassword.js';

const updateUserPassword = async (req, res, next) => {

    const errors = check(req);
    const userId = req.params.userId;    
    const {oldPassword, newPassword} = req.body;

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {
            
            let user;
            try {
                user = await User.findById(userId);
            } catch (err) {
                return res.status(404).json({message: "Could not update user! - User not found.", error: errors})
            }
        
            const validPassword = await bcrypt.compare(oldPassword, user.password);
        
            if(validPassword) {
                if(validatePassword(newPassword)) {
                    user.password = newPassword;
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
        
                    user.updatedAt = new Date();
        
                    const {password, ...responseUser} = user;
        
                    try {
                        await user.save({
                            validateModifiedOnly: true,
                        });
                    } catch (err) {
                        return res.status(500).json({message: "Could not update user! ", error: err})
                    }
        
                    return res.status(200).json({ 
                        message: "User password updated!", 
                        user: responseUser,
                    })
        
                } else {
                    res.status(403).json({
                        message: "New password format is not correct!"
                    })
                }
        
            } else {
                res.status(400).json({
                    message: "Old password inserted is not matching!"
                })
            }

        } else {
            res.status(404).json({ error: "User does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default updateUserPassword;