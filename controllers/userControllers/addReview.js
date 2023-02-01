import { check } from "express-validator";
import User from "../../models/userModels/userSchema.js";
import Restaurant from "../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Review from "../../models/clientModels/restaurantModels/RestaurantBase/reviews/reviewSchema.js"
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const addReview = async (req, res, next) => {
    
    const errors = check(req);
    const {body, params} = req;
    const userId = await params.userId;
    const restaurantId = await params.restaurantId;


    let userName;

    if (validateObjectId(userId)) {

        if (validateObjectId(restaurantId)) {

            const userExists = await User.exists({_id: userId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});
            
        
            if (userExists) {
        
                if (restaurantExists) {
        
                    let user;
        
                    try {
                        user = await User.findById(userId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any user! ", error: err})
                    }
                
                    let restaurant;
                
                    try {
                        restaurant = await Restaurant.findById(restaurantId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any restaurant! ", error: err})
                    }
                
                    const value = parseFloat(body.food + body.service + body.ambience + body.experience)/4;
                    userName = user.name;
                
                    if(restaurant) {
                
                        const newReview = new Review({
                            food: body.food,
                            service: body.service,
                            ambience: body.ambience,
                            experience: body.experience,
                            value: value,
                            restaurantId: restaurant._id
                        });
                
                        await newReview.save()
                            .then(async result => {
                                restaurant.rating.push(result._id);
                                await restaurant.save({
                                    validateModifiedOnly: true,
                                });
                
                                res.status(201).json({
                                    message: 'New review added by ' + userName,
                                    review: result
                                })
                            })
                            .catch(err => {
                                res.status(400).send({
                                    message: err,
                                    errors: errors
                                });
                        });
                    }
        
                } else {
                    res.status(404).json({ error: "Restaurant does not exist in the database." });
                }                 
        
            } else {
                res.status(404).json({ error: "User does not exist in the database." });
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }

};

export default addReview;
