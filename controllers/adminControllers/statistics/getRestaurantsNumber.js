import { check } from "express-validator";
import Restaurant from "../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Client from "../../../models/clientModels/clientSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const getRestaurantsNumber = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;

    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

            let restaurants = await Restaurant.find({clientId: clientId});
            
            try {        
                if(restaurants){
                    res.status(200).json({
                        numberOfRestaurants: restaurants.length
                    })
                }
            } catch (err) {
                res.status(400).json({
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

export default getRestaurantsNumber;