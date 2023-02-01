import { check } from "express-validator";
import Review from "../../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema";

const updateReview = async (req, res, next) => {

    const errors = check(req);

    const {food, service, ambience, experience} = req.body;

    const reviewId = req.params.reviewId;
    
    let review;
    try {
        review = await Review.findById(reviewId);
    } catch (err) {
        return res.status(500).json({message: "Could not update review! ", error: err})
    }

    if(food) {
        review.food = food ? food : review.food;
        review.service = service ? service : review.service;
        review.ambience = ambience ? ambience : review.ambience;
        review.experience = experience ? experience : review.experience;
        review.value = parseFloat((review.food + review.service + review.ambience + review.experience) / 4);
        review.updatedAt = new Date();
    }


    try {
        await review.save({
            validateModifiedOnly: true,
        });
        return res.status(200).json({ 
            message: "Review updated!", 
            review: review,
            value: review.value
        })
    } catch (err) {
        return res.status(500).json({message: "Could not update review! ", error: err})
    }
}

export default updateReview;