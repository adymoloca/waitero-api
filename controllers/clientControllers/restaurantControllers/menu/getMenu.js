import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import RestaurantMenu from "../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Menu from "../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const getMenu = async (req, res,next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const menuId = req.params.menuId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(menuId)) {

                const clientExists = await Client.exists({_id: clientId});
                const restaurantExists = await Restaurant.exists({_id: restaurantId});
                const menuExists = await Menu.exists({_id: menuId});

                if (clientExists) {
    
                    if (restaurantExists) {

                        if (menuExists) {
                            
                            try {
                                await RestaurantMenu.findById(menuId).then(result => {
                                    res.status(200).json({
                                        message: "Restaurant menu loaded succesfully",
                                        menu: result
                                    })
                                }).catch(err => {
                                    res.status(400).json({
                                        message: err,
                                        errors: errors
                                    })
                                })
                            } catch(err) {
                                res.status(404).json({
                                    message: err,
                                    errors: errors
                                })
                            }

                        } else {
                            res.status(404).json({ error: "Restaurant menu does not exist in the database." });    
                        }
                        
                    } else {
                        res.status(404).json({ error: "Restaurant does not exist in the database." });    
                    }
    
                } else {
                    res.status(404).json({ error: "Client does not exist in the database." });    
                }

            } else {
                res.status(404).json({message: "The parameter menuId = " + menuId + " in the URL does not fulfill the correct form of an objectId."});
            }

        } else {
            res.status(404).json({message: "The parameter restaurantId = " + restaurantId + " in the URL does not fulfill the correct form of an objectId."});
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    } 

};
export default getMenu;