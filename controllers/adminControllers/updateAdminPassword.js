import bcrypt from 'bcrypt';
import { check } from "express-validator";
import { validatePassword } from '../utils/validation/validatePassword.js';
import { validateObjectId } from "../utils/validation/validateObjectId.js";
import Admin from '../../models/adminModels/adminSchema.js';

const updateAdminPassword = async (req, res, next) => {

    const errors = check(req);

    const {oldPassword, newPassword} = req.body;

    const adminId = req.params.adminId;

    if(validateObjectId(adminId)) {

        const adminExists = await Admin.exists({_id: adminId});
    
    if (adminExists) {

        let admin;
        try {
            admin = await Admin.findById(adminId);
        } catch (err) {
            return res.status(404).json({message: "Could not update admin's password! - Admin not found. ", errors: errors});
        }

        const validPassword = await bcrypt.compare(oldPassword, admin.password);

        if(validPassword) {
            if(validatePassword(newPassword)) {
                admin.password = newPassword;
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);

                admin.updatedAt = new Date();

                const {password, ...responseUser} = admin;

                try {
                    await admin.save({
                        validateModifiedOnly: true,
                    });
                } catch (err) {
                    return res.status(500).json({message: "Could not update admin's password! ", error: err})
                }

                return res.status(200).json({ 
                    message: "Admin's password updated.", 
                    client: responseUser,
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
        res.status(404).json({ error: "Admin does not exist in the database." });
    } 

    } else {
        res.status(404).json({message: "The parameter adminId = " + adminId + " in the URL does not fulfill the correct form of an objectId."});
    }

       
};

export default updateAdminPassword;