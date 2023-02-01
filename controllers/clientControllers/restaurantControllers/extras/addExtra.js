import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Extra from "../../../../models/clientModels/restaurantModels/RestaurantBase/extras/extraSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const addExtra = async (req, res, next) => {

    const errors = check(req);
    const {params} = req;
    const clientId = await params.clientId;
    const restaurantId = await params.restaurantId;

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
                        return res.status(404).json({message: "Could not find any client! ", error: err})
                    }

                    let restaurant;
                    try {
                        restaurant = await Restaurant.findById(restaurantId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any restaurant! ", error: err})
                    }
                    

                    if(client && restaurant) {

                        const newExtra = new Extra({
                            clientId: client._id,
                            restaurantId: restaurant._id,
                            extraName: req.body.extraName,
                            extraPrice: req.body.extraPrice,
                            extraPhoto: req.body.extraPhoto
                        });

                        await newExtra.save()
                            .then(async result => {
                                restaurant.extras.push(result._id);
                                await restaurant.save({
                                    validateModifiedOnly: true,
                                });
                                res.status(201).json({
                                    message: 'New extra added!',
                                    extra: result
                                })
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

export default addExtra;