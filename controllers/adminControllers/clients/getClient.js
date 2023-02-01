import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";

const getClient = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const clientExists = await Client.exists({_id: clientId});

    if (clientExists) {
        try {
            await Client.findById(clientId).then(result => {
                res.status(200).json({
                    message: "Client loaded succesfully",
                    client: result
                })
            });
        } catch(err) {
            res.status(404).json({
                message: err,
                errors: errors
            })
        }
    } else {
        res.status(404).json({ error: "Client does not exist" });
    }         
};

export default getClient;