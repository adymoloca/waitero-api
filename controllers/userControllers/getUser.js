import { check } from "express-validator";
import User from "../../models/userModels/userSchema.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const getUser = async (req, res, next) => {

    const errors = check(req);
    const userId = req.params.userId;    

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {
            
            try {
                await User.findById(userId).then(result => {
                    res.status(200).json({
                        message: "User loaded succesfully.",
                        user: result
                    })
                }).catch(err => {
                    res.status(400).json({
                        message: err,
                        errors: errors
                    })
                })
            } catch(err) {
                res.status(404).json({
                    message: err,
                    errors: errors
                })
            } 

        } else {
            res.status(404).json({ error: "User does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default getUser;