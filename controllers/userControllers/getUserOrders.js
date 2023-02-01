import { check } from "express-validator";
import User from "../../models/userModels/userSchema.js";
import CartUser from "../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const getUserOrders = async (req, res, next) => {

    const errors = check(req);
    const userId = req.params.userId;

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {

            let orders = await CartUser.find({userId: userId});

            try {
                
                if (orders) {
                    res.status(200).json({
                        orders: orders
                    })
                }
            } catch (error) {
                res.status(400).json({
                    message: error,
                    error: errors
                })
            }
        } else {
            res.status(404).json({ error: "User does not exist in the database." });
        }
    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }

}

export default getUserOrders;