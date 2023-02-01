import { check } from "express-validator";
import Restaurant from "../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";

const getNearByRestaurants = async (req, res, next) => {

    let nearByRestaurants;
    let userLat = 45.834258, userLong = 24.995644;

    try {
        const restaurants = await Restaurant.find().then(restaurants => restaurants)
        nearByRestaurants = restaurants.map(restaurant => {

            if ((Math.abs(parseFloat(restaurant.location.coordinates.lat)-userLat) < 0.05) && (Math.abs(parseFloat(restaurant.location.coordinates.long)-userLong) < 0.05)) {
                return restaurant;
            }

        })
        res.status(200).json({
            message: "Nearby Restaurants loaded.",
            nearByRestaurant: nearByRestaurants
        })
        
    } catch (error) {
        res.status(401).json({
            message: "Error....",
            error: error
        })
    }
}

export default getNearByRestaurants;