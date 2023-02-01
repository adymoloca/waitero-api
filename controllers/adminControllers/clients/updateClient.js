import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";
import { createToken } from "../../utils/createToken.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const updateClient = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    let isBlocked = req.body.isBlocked;

    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

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
                if (isBlocked === false || isBlocked === true) {

                    client.isBlocked = isBlocked ;
                    client.updatedAt = new Date();

                    const {token, refreshToken} = createToken(client);

                    try {
                        await client.save({
                            validateModifiedOnly: true,
                        });
        
                        return res.status(200).json({
                            message: "Client updated successfully.",
                            isBlocked: client.isBlocked
                        })
                    } catch (error) {
                        return res.status(500).json({
                            message: "Error caught during update.",
                            error: error
                        })
                    }

                } else {
                    res.status(400).json({
                        message: "Input only boolean (true / false)."
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

export default updateClient;