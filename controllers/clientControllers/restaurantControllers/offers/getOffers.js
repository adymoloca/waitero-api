import { check } from "express-validator";
import SpecialOffer from "../../../../models/clientModels/restaurantModels/RestaurantBase/offers/specialOfferSchema.js";

const getOffers = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = req.params.restaurantId;

    try {
        await SpecialOffer.find({restaurantId: restaurantId}).then(result => {
            res.status(200).json({
                message: "Offers loaded succesfully",
                offers: result
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
};

export default getOffers;