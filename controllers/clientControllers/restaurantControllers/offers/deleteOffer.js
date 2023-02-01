import { check } from "express-validator";
import SpecialOffer from "../../../../models/clientModels/restaurantModels/RestaurantBase/offers/specialOfferSchema.js";

const deleteOffer = async (req, res, next) => {

    const errors = check(req);
    const offerId = req.params.offerId;

    let offer;
    try {
        offer = await SpecialOffer.findById(offerId);
    } catch (err) {
        return res.status(404).json({message: "Deleting offer failed - Offer not fount!", error: errors})
    }

    try {
        await offer.deleteOne()
    } catch (err) {
        return res.status(500).json({ message: "Deleting offer has failed! ", error: err })
    }
    return res.status(200).json({ message: "Offer deleted."})
};

export default deleteOffer;