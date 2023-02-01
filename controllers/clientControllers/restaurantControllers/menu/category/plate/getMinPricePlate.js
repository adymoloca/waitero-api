import { check } from "express-validator";
import Client from "../../../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Plate from '../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/plates/plateSchema.js';
import { validateObjectId } from "../../../../../utils/validation/validateObjectId.js";

const getMinPricePlate = async (req, res, next) => {

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
                        Plate.find({restaurantId: restaurantId})
                            .then(result => {
                                let minValue = result.reduce(function(prev, curr) {
                                    return prev.Cost < curr.Cost ? curr : prev;
                                });
                
                                res.status(200).json({
                                    message: "Minimum plate price",
                                    plates: minValue
                                });
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

export default getMinPricePlate;