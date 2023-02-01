import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import User from "../../../../models/userModels/userSchema.js";
import CartUser from "../../../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";


const isServedUserOrder = async (req, res, next) => {

    const errors = check(req);
    const {params} = req;
    const clientId = await params.clientId;
    const restaurantId = await params.restaurantId;
    const userId = await params.userId;
    const cartUserId = await params.cartUserId;
    let {isServedOrder} = req.body;


    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(userId)) {

                if (validateObjectId(cartUserId)) {


                    const clientExists = await Client.exists({ _id: clientId });
                    const restaurantExists = await Restaurant.exists({ _id: restaurantId });
                    const userExists = await User.exists({ _id: userId });
                    const cartUserExists = await CartUser.exists({_id: cartUserId});
    
                    if (clientExists) {
    
                        if (restaurantExists) {
    
                            if (userExists) {

                                if (cartUserExists) {

                                    let order;
                                    try {
                                        order = await CartUser.findById(cartUserId);
                                    } catch (error) {
                                        return res.status(404).json({message: "Cannot find order by cartUserId."});
                                    }

                                    if (order) {
                                        order.isServedOrder = isServedOrder;
                                    }

                                    try {
                                        await order.save({
                                            validateModifiedOnly: true,
                                        });
                                    } catch (error) {
                                        return res.status(500).json({message: "Could not serve order! ", error: error})
                                    }

                                    return res.status(200).json({
                                        message: "Order is served.",
                                        order: order
                                    })

                                } else {
                                    res.status(404).json({ error: "User order does not exist in the database." });
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
                    res.status(404).json({message: "The parameter cartUserId = " + cartUserId + " in the URL does not fulfill the correct form of an objectId."});
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

export default isServedUserOrder;