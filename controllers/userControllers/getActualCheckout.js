import { check } from "express-validator";
import User from "../../models/userModels/userSchema.js";
import Client from "../../models/clientModels/clientSchema.js";
import Restaurant from "../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import CartUser from "../../models/clientModels/restaurantModels/Checkout/cartUserSchema.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const getActualCheckout = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const userId = req.params.userId;
    const tableNumber = req.params.tableNumber;

    function groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
          if (!memo[x[property]]) { memo[x[property]] = []; }
          memo[x[property]].push(x);
          return memo;
        }, {}) || [];
    }

    function getObjKey(obj, value) {
        return Object.keys(obj).find(key => obj[key] === value);
      }

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(userId)) {

                const clientExists = await Client.exists({ _id: clientId });
                const restaurantExists = await Restaurant.exists({ _id: restaurantId });
                const userExists = await User.exists({ _id: userId });
                    
                if (clientExists) {
        
                    if (restaurantExists) {

                        if (userExists) {

                            let checkouts = await CartUser.find({ restaurantId: restaurantId });

                            try {
                                if (checkouts) {

                                    const dontPaidCheckout = checkouts.filter((checkout) => checkout.isPaid === false);

                                    const arr = dontPaidCheckout.map((item) => {
                                        return {
                                            _id: item._id,
                                            clientId: item.clientId,
                                            restaurantId: item.restaurantId,
                                            userId: item.userId,
                                            tableNumber: item.tableNumber,
                                            isPaid: item.isPaid,
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

                                    const checkoutByTableList = groupBy(arr, "tableNumber");
                                    const checkoutByTable = checkoutByTableList[tableNumber];
                                    
                                    res.status(200).json({
                                        message: "Checkouts loaded successfully for user",
                                        checkouts:  checkoutByTable
                                    })
                                }
                            } catch (error) {
                                res.status(401).json({
                                    message: error,
                                    errors: errors
                                })
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
                res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }     
};

export default getActualCheckout;