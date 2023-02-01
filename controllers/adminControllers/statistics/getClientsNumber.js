import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";

const getClientsNumber = async (req, res, next) => {

    const errors = check(req);

    try {
        await Client.find().then(clients => {
            res.status(201).json({
                numberOfClients: clients.length
            })
        })
    } catch(err) {
        res.status(401).json({
            message: err,
            errors: errors
        })
    }
};

export default getClientsNumber;