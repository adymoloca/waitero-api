import { check } from "express-validator";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Client from "../../../models/clientModels/clientSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";
import { validatePassword } from "../../utils/validation/validatePassword.js";
import { sendRecoveryMail } from "../../utils/sendRecoveryMail.js";

const changeClientPassword = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;

    const generatePassword = () => {
        const length = 12;
        const wishlist = '328ABEjky~!#?';


        return Array.from(crypto.randomFillSync(new Uint32Array(length)))
            .map((x) => {
                let newChar = wishlist[x % wishlist.length];
                return newChar;
            }
        ).join('');
    }

    if (validateObjectId(clientId)) {
        const clientExists = await Client.exists({_id: clientId});

        if(clientExists) {

            let client;

            try {
                client = await Client.findById(clientId);
            } catch (error) {
                return res.status(404).json({
                    message: "Cannot find client by clientId.",
                    error: errors
                })
            }

            if (client) {
                try {
                    let newPass = generatePassword();
                    while (validatePassword(newPass) === false) {
                        return newPass = generatePassword();
                    }

                    if (validatePassword(newPass)) {

                        client.password = newPass;
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
                        
                        sendRecoveryMail(newPass, client.email);

                        return res.status(200).json({ 
                            message: "Client password updated!",
                            newPass: newPass
                        })

                    } else {
                        res.status(400).json({
                            message: "Password generated incorrectly."
                        })
                    }
                } catch (error) {
                    res.status(500).json({
                        error: error
                    })
                }
            }
        } else {
            res.status(404).json({ error: "Client does not exist in the database." });
        }
    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }
}

export default changeClientPassword;