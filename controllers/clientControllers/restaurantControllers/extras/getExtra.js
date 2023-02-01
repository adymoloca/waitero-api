import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Extra from "../../../../models/clientModels/restaurantModels/RestaurantBase/extras/extraSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const getExtra = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const extraId = req.params.extraId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(extraId)) {

                const clientExists = await Client.exists({_id: clientId});
                const restaurantExists = await Restaurant.exists({_id: restaurantId});
                const extraExists = await Extra.exists({_id: extraId});

                if (clientExists) {
    
                    if (restaurantExists) {

                        if (extraExists) {

                            try {
                                await Extra.findById(extraId).then(result => {
                                    res.status(200).json({
                                        message: "Extra loaded succesfully",
                                        extra: result
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
                            res.status(404).json({ error: "Extra does not exist in the database." });        
                        }
                        
                    } else {
                        res.status(404).json({ error: "Restaurant does not exist in the database." });    
                    }
    
                } else {
                    res.status(404).json({ error: "Client does not exist in the database." });    
                }
            } else {
                res.status(404).json({message: "The parameter extraId = " + extraId + " in the URL does not fulfill the correct form of an objectId."});
            }            

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    } 
   
};

export default getExtra;