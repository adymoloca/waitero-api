import { check } from "express-validator";
import Review from "../../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema";

const getReview = async (req, res,next) => {

    const errors = check(req);
    const {reviewId} = req.params;

    try {
        await Review.findById(reviewId).then(result => {
            res.status(201).json({
                message: "Review loaded succesfully",
                review: result
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
export default getReview;