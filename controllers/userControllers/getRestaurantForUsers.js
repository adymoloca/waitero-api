import { check } from "express-validator";
import Restaurant from "../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const getRestaurantForUsers = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = req.params.restaurantId;  
    
    if (validateObjectId(restaurantId)) {

        const restaurantExists = await Restaurant.exists({_id: restaurantId});

        if (restaurantExists) {

            try {
                if(restaurantId){
                const restaurant = await Restaurant.findById(restaurantId);
                    if(restaurant){
                        res.status(201).json({
                            message: "Restaurant loaded succesfully.",
                            restaurant: restaurant
                        });
                    } else {
                        res.status(404).json({
                            message: "Restaurant not found",
                            error: errors
                        })
                    }
                } else {
                    res.status(400).json({
                        message: "Bad request!"
                    })
                }
            }catch(err) {
                res.status(401).json({
                    message: "Bad Request",
                    error: err
                })
            } 
            
        } else {
            res.status(404).json({ error: "Restaurant does not exist in the database." });
        }
    } else {
        res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default getRestaurantForUsers;