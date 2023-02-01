import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import CartUser from "../../../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const getOrders = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({_id: clientId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});

            if (clientExists) {
       
                if (restaurantExists) {

                    let orders = await CartUser.find({restaurantId: restaurantId});

                    if (orders) {
                        orders = orders.filter(order => order.isServed === false);
                    }

                    try {
                        if (orders) {
                            // [orders.clientId, ...orders]
                            res.status(200).json({
                                orders: orders
                            })
                        }
                    } catch (error) {
                        res.status(401).json({
                            message: error,
                            errors: errors
                        })
                    }
                } else {
                    res.status(404).json({ error: "Restaurant does not exist in the database." });    
                }
    
            } else {
                res.status(404).json({ error: "Client does not exist in the database." });
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }     
};

export default getOrders;