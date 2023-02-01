import { check } from "express-validator";
import Review from "../../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";


const getRestaurantReview = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = req.params.restaurantId;

    if (validateObjectId(restaurantId)) {

        const restaurantExists = await Restaurant.exists({_id: restaurantId});

        if (restaurantExists) {

            let reviews = await Review.find({restaurantId: restaurantId});

            let sumValue = 0; let sumFood = 0; let sumService = 0; let sumAmbience = 0; let sumExperience = 0;
            let restaurantReview = 0; let restaurantReviewFood = 0; let restaurantReviewService = 0; let restaurantReviewAmbience = 0; let restaurantReviewExperience = 0;

            for (let index = 0 ; index < reviews.length ; index ++) {
                sumValue += reviews[index].value;
                sumFood += reviews[index].food;
                sumService += reviews[index].service;
                sumAmbience += reviews[index].ambience;
                sumExperience += reviews[index].experience;
            }
            restaurantReview = sumValue / reviews.length;
            restaurantReviewFood = sumFood / reviews.length;
            restaurantReviewService = sumService / reviews.length;
            restaurantReviewAmbience = sumAmbience / reviews.length;
            restaurantReviewExperience = sumExperience / reviews.length;

            try {
                
                if(reviews){
                    res.status(200).json({
                        restaurantReview: restaurantReview,
                        restaurantReviewFood: restaurantReviewFood,
                        restaurantReviewService: restaurantReviewService,
                        restaurantReviewAmbience: restaurantReviewAmbience,
                        restaurantReviewExperience: restaurantReviewExperience,
                        restaurantReviewsNumber: reviews.length
                    })
                }

            } catch (err) {
                res.status(401).json({
                    message: err,
                    errors: errors
                })
            }

        } else {
            res.status(404).json({ error: "Restaurant does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
    }    
};

export default getRestaurantReview;