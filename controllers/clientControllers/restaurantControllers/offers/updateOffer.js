import { check } from "express-validator";
import SpecialOffer from "../../../../models/clientModels/restaurantModels/RestaurantBase/offers/specialOfferSchema.js";

const updateOffer = async (req, res, next) => {

    const errors = check(req);

    const {plateName, platePrice, offer} = req.body;

    const offerId = req.params.offerId;
    
    let offerVar;
    try {
        offerVar = await SpecialOffer.findById(offerId);
    } catch (err) {
        return res.status(404).json({message: "Could not update offer! - Offer not found.", error: err})
    }

    if(offerVar) {
        offerVar.plateName = plateName ? plateName : offerVar.plateName;
        offerVar.platePrice = platePrice ? platePrice : offerVar.platePrice;
        offerVar.offer = offer ? offer : offerVar.offer;
        offerVar.updatedAt = new Date();
    }

    try {
        await offerVar.save({
            validateModifiedOnly: true,
        });
    } catch (err) {
        return res.status(500).json({message: "Could not update offer! ", error: err})
    }
    return res.status(200).json({ 
        message: "Offer updated!", 
        updatedField: offerVar 
    })
}

export default updateOffer;