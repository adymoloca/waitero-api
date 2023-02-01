import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';
import { createToken } from "../utils/createToken.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const updateUser = async (req, res, next) => {

    const errors = check(req);
    const userId = req.params.userId;
    const {name, email, phone} = req.body;

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {

            let user;
            try {
                user = await User.findById(userId);
            } catch (err) {
                return res.status(404).json({message: "Could not update user! - User not found. ", error: errors})
            }
        
            if(user) {
                user.name = name ? name : user.name;
                user.email = email.toLowerCase() ? email.toLowerCase() : user.email;
                user.phone = phone ? phone : user.phone;
                user.updatedAt = new Date();
            }
        
            const {token, refreshToken} = createToken(user);
        
            try {
                await user.save({
                    validateModifiedOnly: true,
                });
            } catch (err) {
                return res.status(500).json({message: "Could not update user! ", error: err})
            }
            return res.status(200).json({ 
                message: "User updated.", 
                user: user,
                token: token,
                refreshToken: refreshToken
            })

        } else {
            res.status(404).json({ error: "User does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default updateUser;