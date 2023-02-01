import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Table from "../../../../models/clientModels/restaurantModels/RestaurantBase/tables/tableSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const deleteTable = async (req, res, next) => {

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

                            let table;
                            try {
                                table = await Table.findById(tableId);
                            } catch (err) {
                                return res.status(404).json({message: "Deleting table failed - Table not fount!", error: errors})
                            }
                        
                            try {
                                await table.deleteOne();
                            } catch (err) {
                                return res.status(500).json({ message: "Deleting table has failed! ", error: err })
                            }
                            return res.status(200).json({ message: "Table deleted."})

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

export default deleteTable;