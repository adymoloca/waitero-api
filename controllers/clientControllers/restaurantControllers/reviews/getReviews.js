import { check } from "express-validator";
import Review from "../../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema";

const getReviews = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = await req.params.restaurantId;

    try {
        await Review.find({restaurantId: restaurantId}).then(result => {
            res.status(201).json({
                message: "Reviews loaded succesfully",
                reviews: result
            })
        }).catch(err => {
            res.status(401).json({
                message: err,
                errors: errors
            })
        })
    } catch(err) {
        res.status(401).json({
            message: err,
            errors: errors
        })
    }     
};

export default getReviews;