import { check } from "express-validator";
import Review from "../../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema";

const deleteReview = async (req, res, next) => {

    const errors = check(req);
    const reviewId = req.params.reviewId;

    let review;
    try {
        review = await Review.findById(reviewId);
    } catch (err) {
        return res.status(500).json({message: "Deleting review failed - Review not fount!", error: errors})
    }

    try {
        await review.deleteOne();
    } catch (err) {
        return res.status(500).json({ message: "Deleting review has failed! ", error: err });
    }
    return res.status(200).json({ message: "Review deleted."})
};

export default deleteReview;