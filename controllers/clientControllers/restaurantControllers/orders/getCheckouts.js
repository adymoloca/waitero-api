import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import CartUser from "../../../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const getCheckouts = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;

    function groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
          if (!memo[x[property]]) { memo[x[property]] = []; }
          memo[x[property]].push(x);
          return memo;
        }, {}) || [];
    }

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({_id: clientId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});

            if (clientExists) {
       
                if (restaurantExists) {

                    let checkouts = await CartUser.find({ restaurantId: restaurantId });

                    try {
                        if (checkouts) {

                            const dontPaidCheckout = checkouts.filter((checkout) => checkout.isPaidOrder === false);

                            const arr = dontPaidCheckout.map((item) => {
                                return {
                                    _id: item._id,
                                    clientId: item.clientId,
                                    restaurantId: item.restaurantId,
                                    userId: item.userId,
                                    tableNumber: item.tableNumber,
                                    isPaidOrder: item.isPaidOrder,
                                    myCart: {
                                        plates: item.myCart.plates.filter(plate => plate.isPaid === false),
                                        drinks: item.myCart.drinks.filter(drink => drink.isPaid === false),
                                        extras: item.myCart.extras.filter(extra => extra.isPaid === false),
                                    }
                                }
                            })


                            if ((typeof arr) === 'undefined') {
                                return res.status(400).json({
                                    error: 'arr undefined.'
                                })
                            }

                            const checkoutByTable = groupBy(arr, "tableNumber");

                            // [orders.clientId, ...orders]
                            res.status(200).json({
                                checkouts: checkoutByTable
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

export default getCheckouts;