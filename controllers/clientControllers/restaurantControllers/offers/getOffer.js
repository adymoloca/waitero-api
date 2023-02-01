import { check } from "express-validator";
import SpecialOffer from "../../../../models/clientModels/restaurantModels/RestaurantBase/offers/specialOfferSchema.js";

const getOffer = async (req, res, next) => {

    const errors = check(req);
    const offerId = req.params.offerId;

    try {
        await SpecialOffer.find({_id: offerId}).then(result => {
            res.status(200).json({
                message: "Offer loaded succesfully",
                offer: result
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

export default getOffer;