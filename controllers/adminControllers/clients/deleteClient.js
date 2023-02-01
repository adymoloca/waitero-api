import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const deleteClient = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.body.clientId;

    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

            let client;
            
            try {
                client = await Client.findById(clientId);
            } catch (err) {
                return res.status(404).json({message: "Deleting client failed - clientId not fount in body!", error: errors})
            }

            try {
                await client.deleteOne()
            } catch (err) {
                return res.status(500).json({ message: "Deleting client has failed! ", error: err })
            }
            return res.status(200).json({ message: "Client deleted."})
        } else {
            res.status(404).json({ error: "Client does not exist in database." });
        } 

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the body does not fulfill the correct form of an objectId."});
    }       
};

export default deleteClient;