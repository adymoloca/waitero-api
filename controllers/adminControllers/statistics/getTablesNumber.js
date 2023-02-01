import { check } from "express-validator";
import Table from "../../../models/clientModels/restaurantModels/RestaurantBase/tables/tableSchema.js";
import Restaurant from "../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const getTablesNumber = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = req.params.restaurantId;

    if (validateObjectId(restaurantId)) {

        const restaurantExists = await Restaurant.exists({_id: restaurantId});

        if (restaurantExists) {

            let tables = await Table.find({restaurantId: restaurantId});

            try {
            
                if(tables){
                    res.status(201).json({
                        numberOfTables: tables.length
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

export default getTablesNumber;