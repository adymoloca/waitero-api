import { check } from "express-validator";
import Plate from "../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/plates/plateSchema.js";
import Restaurant from "../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const getPlatesNumber = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = req.params.restaurantId;

    if (validateObjectId(restaurantId)) {

        const restaurantExists = await Restaurant.exists({_id: restaurantId});

        if (restaurantExists) {

            let plates = await Plate.find({restaurantId: restaurantId});

            try {
                
                if(plates){
                    res.status(201).json({
                        numberOfPlates: plates.length
                    })
                }

            } catch (err) {
                res.status(401).json({
                    message: err,
                    errors: errors
                })
            }

        } else {
            res.status(404).json({ error: "Restaurant does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
    }    
};

export default getPlatesNumber;