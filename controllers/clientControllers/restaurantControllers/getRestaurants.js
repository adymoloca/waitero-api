import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const getRestaurants = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;

    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

            try {
                Client.findById(clientId)
                    .then(result => {
                        result.restaurants.length > 0 ? res.status(200).json({
                            message: "Restaurants loaded succesfully",
                            restaurants: result.restaurants
                        }) : res.status(204).json({
                            message: "No restaurants added for this client"
                        })
                    })
                    .catch(err => {
                        res.send(err)
                    })
            } catch(err) {
                res.status(404).json({
                    message: err,
                    errors: errors
                })
            }    

        } else {
            res.status(404).json({ error: "Client does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }     
};

export default getRestaurants;