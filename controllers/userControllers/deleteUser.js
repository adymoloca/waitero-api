import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';

const deleteUser = async (req, res, next) => {

    const errors = check(req);
    const userId = req.params.userId;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        return res.status(404).json({message: "Deleting user  failed - User  not fount!", error: errors})
    }

    try {
        await user.deleteOne()
    } catch (err) {
        return res.status(500).json({ message: "Deleting user has failed! ", error: err })
    }
    return res.status(200).json({ message: "User deleted."})
};

export default deleteUser;