import { check } from "express-validator";
import Review from "../../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema.js";
import Restaurant from "../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const getReviewsNumber = async (req, res, next) => {

    const errors = check(req);
    const restaurantId = req.params.restaurantId;

    if (validateObjectId(restaurantId)) {

        const restaurantExists = await Restaurant.exists({_id: restaurantId});

        if (restaurantExists) {

            let reviews = await Review.find({restaurantId: restaurantId});

            let sumFood = 0;
            let foodAvg = 0;

            for(let index = 0 ; index < reviews.length ; index ++) {
                sumFood += reviews[index].food;
            }
            foodAvg = sumFood / reviews.length;

            try {
                
                if(reviews){
                    res.status(201).json({
                        numberOfReviews: reviews.length
                    });
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

export default getReviewsNumber;