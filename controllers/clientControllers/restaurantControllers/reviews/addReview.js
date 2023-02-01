import { check } from "express-validator";
import Review from "../../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema.js";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";

const addReview = async (req, res,next) => {

    const errors = check(req);
    const {params} = req;
    const {food, service, ambience, experience} = req.body;
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
                        return res.status(404).json({message: "Could not find any client! ", error: err})
                    }

                    let restaurant;
                    try {
                        restaurant = await Restaurant.findById(restaurantId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any restaurant! ", error: err})
                    }

                    const value = parseFloat(food + service + ambience + experience)/4;

                    if(client && restaurant) {

                        const newReview = new Review({
                            clientId: client._id,
                            restaurantId: restaurant._id,
                            food: food,
                            service: service,
                            ambience: ambience,
                            experience: experience,
                            value: value
                        });

                        await newReview.save()
                            .then(result => {
                                restaurant.rating.push(result._id);
                                restaurant.save({
                                    validateModifiedOnly: true,
                                });
                                
                                res.status(201).json({
                                    message: 'New review added!',
                                    review: result
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

export default addReview;