import { check } from "express-validator";
import Client from "../../models/clientModels/clientSchema.js";
import { createToken } from "../utils/createToken.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const updateClient = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const {name, email, phone} = req.body;


    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

            let client;
            try {
                client = await Client.findById(clientId);
            } catch (err) {
                return res.status(404).json({message: "Could not update client! - Client not found.", error: err})
            }
        
            if(client) {
                client.name = name ? name : client.name;
                client.email = email.toLowerCase() ? email.toLowerCase() : client.email;
                client.phone = phone ? phone : client.phone;
                client.updatedAt = new Date();
            }
        
            const {token, refreshToken} = createToken(client);
        
            try {
                await client.save({
                    validateModifiedOnly: true,
                });
            } catch (err) {
                return res.status(500).json({message: "Could not update client! ", error: err})
            }
            return res.status(200).json({ 
                message: "Client updated!", 
                client: client,
                token: token,
                refreshToken: refreshToken
            })
            
        } else {
            res.status(404).json({ error: "Client does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default updateClient;