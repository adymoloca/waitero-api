import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Table from "../../../../models/clientModels/restaurantModels/RestaurantBase/tables/tableSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const getTable = async (req, res,next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const tableId = req.params.tableId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(tableId)) {

                const clientExists = await Client.exists({_id: clientId});
                const restaurantExists = await Restaurant.exists({_id: restaurantId});
                const tableExists = await Table.exists({_id: tableId});

                if (clientExists) {
    
                    if (restaurantExists) {

                        if (tableExists) {

                            try {
                                await Table.findById(tableId).then(result => {
                                    res.status(200).json({
                                        message: "Table loaded succesfully",
                                        review: result
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
                            res.status(404).json({ error: "Table does not exist in the database." });        
                        }
                        
                    } else {
                        res.status(404).json({ error: "Restaurant does not exist in the database." });    
                    }
    
                } else {
                    res.status(404).json({ error: "Client does not exist in the database." });    
                }

            } else {
                res.status(404).json({message: "The parameter tableId = " + tableId + " in the URL does not fulfill the correct form of an objectId."});    
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    } 
  
};
export default getTable;