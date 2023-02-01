import { check } from "express-validator";
import SpecialOffer from "../../../../models/clientModels/restaurantModels/RestaurantBase/offers/specialOfferSchema.js";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js"


const addOffer = async (req, res,next) => {

    const errors = check(req);
    const {params} = req;
    const restaurantId = await params.restaurantId;
    const clientId = await params.clientId;

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

        const newOffer = new SpecialOffer({
            clientId: client._id,
            restaurantId: restaurant._id,
            plateName: req.body.plateName,
            platePrice: req.body.platePrice,
            offer: req.body.offer
        });

        await newOffer.save()
            .then(async result => {
                restaurant.specialOffers.push(result._id);
                await restaurant.save({
                    validateModifiedOnly: true,
                });
                res.status(201).json({
                    message: 'New offer added!',
                    offer: result
                });
            })
            .catch(err => {
                res.status(400).send({
                    message: err,
                    errors: errors
                });
        });
    } 
};

export default addOffer;