import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import User from "../../../../models/userModels/userSchema.js";
import CartUser from "../../../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";


const updateProductsPayment = async (req, res, next) => {

    const errors = check(req);
    const {params} = req;
    const clientId = await params.clientId;
    const restaurantId = await params.restaurantId;
    const userId = await params.userId;
    const cartUserId = await params.cartUserId;
    let isPaid = req.body.isPaid;
    let platesIdArr = req.body.platesIdArr;
    let drinksIdArr = req.body.drinksIdArr;
    let extrasIdArr = req.body.extrasIdArr;


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
                                        order = await CartUser.findOne({_id: cartUserId}).exec();
                                    } catch (error) {
                                        return res.status(404).json({message: "Cannot find order by cartUserId."});
                                    }

                                    if (order) {

                                        for (let p = 0; p < platesIdArr.length; p++) {
                                            
                                            const indexP = order.myCart.plates.findIndex(el => el._id == platesIdArr[p]);

                                            if (order.myCart.plates.includes(order.myCart.plates[indexP])) {
    
                                                if (isPaid === true || isPaid === false) {
    
                                                    order.myCart.plates[indexP].isPaid = isPaid
                                                    order.myCart.plates[indexP].updatedAt = new Date();  
    
                                                    try {
                                                        await order.save({
                                                            validateModifiedOnly: true,
                                                        });                                                        
                                                    } catch (error) {
                                                        res.status(500).json({
                                                            message: "Error caught during update! ",
                                                            error: error
                                                        })
                                                    }
    
                                                } else {
                                                    res.status(400).json({
                                                        message: "Input only boolean (true / false)."
                                                    })
                                                }                                                                            

                                            }   
                                        }

                                        for (let d = 0; d < drinksIdArr.length; d++) {
                                            
                                            const indexD = order.myCart.drinks.findIndex(el => el._id == drinksIdArr[d]);

                                            if (order.myCart.drinks.includes(order.myCart.drinks[indexD])) {
    
                                                if (isPaid === true || isPaid === false) {
    
                                                    order.myCart.drinks[indexD].isPaid = isPaid
                                                    order.myCart.drinks[indexD].updatedAt = new Date();  
    
                                                    try {
                                                        await order.save({
                                                            validateModifiedOnly: true,
                                                        });
                                                    } catch (error) {
                                                        res.status(500).json({
                                                            message: "Error caught during update! ",
                                                            error: error
                                                        })
                                                    }
    
                                                } else {
                                                    res.status(400).json({
                                                        message: "Input only boolean (true / false)."
                                                    })
                                                }
                                            }
                                        } 

                                        for (let e = 0; e < extrasIdArr.length; e++) {
                                            
                                            const indexE = order.myCart.extras.findIndex(el => el._id == extrasIdArr[e]);

                                            if (order.myCart.extras.includes(order.myCart.extras[indexE])) {
    
                                                if (isPaid === true || isPaid === false) {
    
                                                    order.myCart.extras[indexE].isPaid = isPaid
                                                    order.myCart.extras[indexE].updatedAt = new Date();  
    
                                                    try {
                                                        await order.save({
                                                            validateModifiedOnly: true,
                                                        });                                                        
                                                    } catch (error) {
                                                        res.status(500).json({
                                                            message: "Error caught during update! ",
                                                            error: error
                                                        })
                                                    }
    
                                                } else {
                                                    res.status(400).json({
                                                        message: "Input only boolean (true / false)."
                                                    })
                                                } 

                                            }
                                        }

                                        res.status(200).json({
                                            orderPaid: order.myCart
                                        })

                                    }

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

export default updateProductsPayment;