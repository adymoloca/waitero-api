import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";

const getClients = async (req, res, next) => {

    const errors = check(req);

    try {
        await Client.find().then(clients => {
            res.status(200).json({
                message: "All clients loaded",
                clients: clients
            })
        })
    } catch(err) {
        res.status(404).json({
            message: err,
            errors: errors
        })
    }     
};

export default getClients;