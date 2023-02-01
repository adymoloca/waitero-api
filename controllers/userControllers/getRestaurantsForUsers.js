import { check } from "express-validator";
import Client from "../../models/clientModels/clientSchema.js";

const getRestaurantsForUsers = async (req, res, next) => {

    const errors = check(req);

    let restaurants;
    try {
        const clients = await Client.find().then(clients => clients)
        restaurants = clients.map(client => {
            return client.restaurants[0];
        })
        
            res.status(201).json({
                message: "All clients loaded",
                restaurants: restaurants
            })
    } catch(err) {
        res.status(401).json({
            message: err,
            errors: errors
        })
    }     
};

export default getRestaurantsForUsers;