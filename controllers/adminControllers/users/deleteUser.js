import { check } from "express-validator";
import User from "../../../models/userModels/userSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const deleteUser = async (req, res, next) => {

    const errors = check(req);
    const userId = req.body.userId;

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {

            let user;

            try {
                user = await User.findById(userId);
            } catch (err) {
                return res.status(404).json({message: "Deleting user failed - userId not fount in body.", error: errors})
            }

            try {
                await user.deleteOne()
            } catch (err) {
                return res.status(500).json({ message: "Deleting user has failed! ", error: err })
            }
            return res.status(200).json({ message: "User deleted."})
        } else {
            res.status(404).json({ error: "User does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the body does not fulfill the correct form of an objectId."});
    }        
};

export default deleteUser;