import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const getTables = async (req, res,next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({_id: clientId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});

            if (clientExists) {

                if (restaurantExists) {

                    try {
                        await Restaurant.findById(restaurantId)
                        .then(result => {
                            result.tables.length > 0 ? res.status(200).json({
                                message: "Tables loaded succesfully",
                                tables: result.tables
                            }) : res.status(204).json({
                                message: "No tables added for this restaurant"
                            })
                        }).catch(err => {
                            res.status(400).json({
                                message: err,
                                errors: errors
                            })
                        })
                    } catch(err) {
                        res.status(404).json({
                            message: err,
                            errors: errors
                        })
                    }  

                } else {
                    res.status(404).json({ error: "Restaurant does not exist in the database." });    
                }

            } else {
                res.status(404).json({ error: "Client does not exist in the database." });    
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }
   
};
export default getTables;