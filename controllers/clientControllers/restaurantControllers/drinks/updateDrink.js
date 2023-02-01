import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Drink from "../../../../models/clientModels/restaurantModels/RestaurantBase/drinks/drinkSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const updateDrink = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const drinkId = req.params.drinkId;
    const {
        drinkName,
        drinkCategory,
        drinkPrice,
        drinkPhoto
    } = req.body;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(drinkId)) {

                const clientExists = await Client.exists({_id: clientId});
                const restaurantExists = await Restaurant.exists({_id: restaurantId});
                const drinkExists = await Drink.exists({_id: drinkId});

                if (clientExists) {
    
                    if (restaurantExists) {

                        if (drinkExists) {

                            let drink;
                            try {
                                drink = await Drink.findById(drinkId);
                            } catch (err) {
                                return res.status(404).json({message: "Could not update drink! - Drink not found. ", error: err})
                            }
                        
                            if(drink) {
                                drink.drinkName = drinkName ? drinkName : drink.drinkName;
                                drink.drinkCategory = drinkCategory ? drinkCategory : drink.drinkCategory;
                                drink.drinkPrice = drinkPrice ? drinkPrice : drink.drinkPrice;
                                drink.drinkPhoto = drinkPhoto ? drinkPhoto : drink.drinkPhoto;
                                drink.updatedAt = new Date();
                            }
                        
                            try {
                                await drink.save({
                                    validateModifiedOnly: true,
                                });
                            } catch (err) {
                                return res.status(500).json({message: "Could not update drink! ", error: err})
                            }
                            return res.status(200).json({ 
                                message: "Drink updated!", 
                                drink: drink 
                            })

                        } else {
                            res.status(404).json({ error: "Drink does not exist in the database." });    
                        }
    
                    } else {
                        res.status(404).json({ error: "Restaurant does not exist in the database." });    
                    }
    
                } else {
                    res.status(404).json({ error: "Client does not exist in the database." });    
                }

            } else {
                res.status(404).json({message: "The parameter drinkId = " + drinkId + " in the URL does not fulfill the correct form of an objectId."});    
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default updateDrink;