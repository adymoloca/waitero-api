import bcrypt from 'bcrypt';
import { check } from "express-validator";
import Client from '../../models/clientModels/clientSchema.js';
import { validateObjectId } from '../utils/validation/validateObjectId.js';
import { validatePassword } from '../utils/validation/validatePassword.js';

const updateClientPassword = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const {oldPassword, newPassword} = req.body;

    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

            let client;
            try {
                client = await Client.findById(clientId);
            } catch (err) {
                return res.status(404).json({message: "Could not update client's password! - Client not found.", error: err})
            }
        
            const validPassword = await bcrypt.compare(oldPassword, client.password);
        
            if(validPassword) {
                if(validatePassword(newPassword)) {
                    client.password = newPassword;
                    const salt = await bcrypt.genSalt(10);
                    client.password = await bcrypt.hash(client.password, salt);
        
                    client.updatedAt = new Date();
        
                    const {password, ...responseUser} = client;
        
                    try {
                        await client.save({
                            validateModifiedOnly: true,
                        });
                    } catch (err) {
                        return res.status(500).json({message: "Could not update client's password! ", error: err})
                    }
        
                    return res.status(200).json({ 
                        message: "Client password updated!", 
                        client: responseUser,
                    })
        
                } else {
                    res.status(403).json({
                        message: "New password format is not correct!"
                    })
                }
        
            } else {
                res.status(403).json({
                    message: "Old password inserted is not matching!"
                })
            }
            
        } else {
            res.status(404).json({ error: "Client does not exist in the database." });    
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default updateClientPassword;