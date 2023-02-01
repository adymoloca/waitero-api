import { check } from "express-validator";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Menu from "../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import Client from "../../../../models/clientModels/clientSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const addMenu = async (req, res, next) => {
    
    const errors = check(req);

    const {body, params} = req;
    const restaurantId = await params.restaurantId;
    const clientId = await params.clientId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({_id: clientId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});

            if (clientExists) {

                if (restaurantExists) {

                    let client;
                    try {
                        client = await Client.findById(clientId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any client! ", error: err})
                    }

                    let restaurant;
                    try {
                        restaurant = await Restaurant.findById(restaurantId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not find any restaurant! ", error: err})
                    }

                    if(client && restaurant) {

                        const newMenu = new Menu({
                            menuName: body.menuName,
                            restaurantId: restaurant._id,
                            clientId: client._id
                        });

                        await newMenu.save()
                            .then(async result => {
                                restaurant.restaurantMenu.push(result._id);
                                await restaurant.save({
                                    validateModifiedOnly: true,
                                });

                                res.status(201).json({
                                    message: 'New menu added!',
                                    menu: result
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

export default addMenu;
