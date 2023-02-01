import { check } from "express-validator";
import Client from "../../models/clientModels/clientSchema.js";
import Restaurant from "../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import User from "../../models/userModels/userSchema.js";
import CartUser from "../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js"
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const addActualOrder = async (req, res, next) => {

    const errors = check(req);
    const {params} = req;
    const clientId = await params.clientId;
    const restaurantId = await params.restaurantId;
    const userId = await params.userId;


    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(userId)) {

                const clientExists = await Client.exists({ _id: clientId });
                const restaurantExists = await Restaurant.exists({ _id: restaurantId });
                const userExists = await User.exists({ _id: userId });

                if (clientExists) {

                    if (restaurantExists) {

                        if (userExists) {

                            let client;
                            try {
                                client = await Client.findById(clientId);
                            } catch (err) {
                                return res.status(404).json({ message: "Could not find any client! ", error: err })
                            }

                            let restaurant;
                            try {
                                restaurant = await Restaurant.findById(restaurantId);
                            } catch (err) {
                                return res.status(404).json({ message: "Could not find any restaurant! ", error: err })
                            }

                            let user; 
                            try {
                                user = await User.findById(userId);
                            } catch (err) {
                                return res.status(404).json({ message: "Could not find any user! ", error: err })
                            }
                        

                            if (client && restaurant && user) {

                                const newActualOrder = new CartUser({
                                    clientId: client._id,
                                    restaurantId: restaurant._id,
                                    userId: user._id,
                                    tableNumber: req.body.tableNumber,
                                    myCart: req.body.myCart
                                });

                                await newActualOrder.save()
                                    .then(result => {
                                        res.status(201).json({
                                            message: 'Actual order added!',
                                            order: result
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
                                res.status(404).json({ error: "User does not exist in the database." });
                        }

                    } else {
                        res.status(404).json({ error: "Restaurant does not exist in the database." });
                    }

                } else {
                    res.status(404).json({ error: "Client does not exist in the database." });
                }
            } else {
                    res.status(404).json({ message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId." });
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }    
};

export default addActualOrder;