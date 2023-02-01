import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const userLogout = async (req, res, next) => {

    const errors = check(req);
    const userId = req.params.userId;    

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {
            
            let user;
            try {
                if(userId) {
                    user = await User.findById(userId);
                } else {
                    return res.status(404).json({message: "Could not update user! - User not found. ", error: errors})
                }
            } catch (err) {
                return res.status(400).json({message: "Could not pass the validation", error: err})
            }
        
            if(user) {
                user.loggedIn = false;
                user.actualTable = {};
                user.updatedAt = new Date();
            }
        
            try {
                await user.save({
                    validateModifiedOnly: true,
                });
            } catch (err) {
                return res.status(500).json({message: "Could not update user! ", error: err})
            }
            return res.status(200).json({ 
                message: "User is logged out!"
            })

        } else {
            return res.status(404).json({message: "Could not update user! - UserID is undefined", error: err})
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default userLogout;