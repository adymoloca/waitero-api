import { check } from "express-validator";
import Drink from "../../../../models/clientModels/restaurantModels/RestaurantBase/drinks/drinkSchema.js";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js"
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";



const addDrink = async (req, res,next) => {

    const errors = check(req);
    const {params} = req;
    const restaurantId = await params.restaurantId;
    const clientId = await params.clientId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({_id: clientId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});

            if (clientExists) {

                if (restaurantExists) {

                    let client;
                    try {
                        client = await Client.findById(clientId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any client. ", error: err})
                    }

                    let restaurant;
                    try {
                        restaurant = await Restaurant.findById(restaurantId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any restaurant! ", error: err})
                    }

                    if(client && restaurant) {

                        const newDrink = new Drink({
                            clientId: client._id,
                            restaurantId: restaurant._id,
                            drinkName: req.body.drinkName,
                            drinkCategory: req.body.drinkCategory,
                            drinkPrice: req.body.drinkPrice,
                            drinkPhoto: req.body.drinkPhoto
                        });

                        await newDrink.save()
                            .then(result => {
                                restaurant.drinks.push(result._id);
                                restaurant.save({
                                    validateModifiedOnly: true,
                                });
                                res.status(201).json({
                                    message: 'New drink added!',
                                    drink: result
                                });
                            })
                            .catch(err => {
                                res.status(400).send({
                                    message: err,
                                    errors: errors
                                });
                        });
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

export default addDrink;