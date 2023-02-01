import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import CartUser from "../../../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";


const payTableOrder = async (req, res, next) => {

    const errors = check(req);
    const {params} = req;
    const clientId = await params.clientId;
    const restaurantId = await params.restaurantId;
    const userId = await params.userId;
    const cartUserId = await params.cartUserId;
    let tableNumber = req.body.tableNumber;
    let isPaid = req.body.isPaid;
    let platesIdArr = req.body.platesIdArr;
    let drinksIdArr = req.body.drinksIdArr;
    let extrasIdArr = req.body.extrasIdArr;
    let ordersIdArr;
    let resultOrder = [];
    let isPaidPlates = true;
    let isPaidDrinks = true;
    let isPaidExtras = true;
    let isPaidTable = true;


    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({ _id: clientId });
            const restaurantExists = await Restaurant.exists({ _id: restaurantId });

            if (clientExists) {

                if (restaurantExists) {

                    let orders
                    try {
                        orders = await CartUser.find({restaurantId: restaurantId}, {tableNumber: tableNumber});
                    } catch (error) {
                        return res.status(404).json({message: "Cannot find order by tableNumber."});
                    }

                    if (orders) {
                        ordersIdArr = orders.map((e) => {
                                return e._id;
                        })

                    } else {
                        console.log("error");
                    }

                    for (let o = 0; o < ordersIdArr.length; o++) {


                        let order;
                        try {
                            order = await CartUser.findById({_id: ordersIdArr[o]}).exec();
                        } catch (error) {
                            return res.status(404).json({message: "Cannot find order by cartUserId."});
                        }

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

                        for (let pp = 0; pp < order.myCart.plates.length; pp++){
                            isPaidPlates = isPaidPlates && order.myCart.plates[pp].isPaid;
                        }

                        for (let dd = 0; dd < order.myCart.drinks.length; dd++){
                            isPaidDrinks = isPaidDrinks && order.myCart.drinks[dd].isPaid;
                        }

                        for (let ee = 0; ee < order.myCart.extras.length; ee++){
                            isPaidExtras = isPaidExtras && order.myCart.extras[ee].isPaid;
                        }

                        if (isPaidPlates === true && isPaidDrinks === true && isPaidExtras === true) {
                            order.isPaidOrder = true;
                            order.updatedAt = new Date();
                        } else {
                            order.isPaidOrder = false;
                            order.updatedAt = new Date();
                        }

                        try {
                            await order.save({
                                validateModifiedOnly: true,
                            })
                        } catch (error) {
                            res.status(500).json({
                                message: "Error caught during update.",
                                error: error
                            })
                        }

                        resultOrder.push(order);
                        
                    }

                    for (let oo = 0 ; oo < resultOrder.length ; oo ++) {
                        isPaidTable = isPaidTable && resultOrder[oo].isPaidOrder;
                    }

                    if(isPaidTable === true) {
                        res.status(200).json({
                            message: "There is nothing left to be paid. See you next time!",
                            orders: resultOrder
                        })
                    } else {
                        res.status(200).json({
                            message: "There is something left to be paid.",
                            orders: resultOrder
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

export default payTableOrder;