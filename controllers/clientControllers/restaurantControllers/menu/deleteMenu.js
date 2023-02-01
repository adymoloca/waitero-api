import { check } from "express-validator";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Menu from "../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const deleteMenu = async (req, res, next) => {

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

                            let menu;
                            try {
                                menu = await Menu.findById(menuId);
                            } catch (err) {
                                return res.status(404).json({message: "Deleting restaurnt menu failed - Menu not fount!", error: errors})
                            }
                        
                            try {
                                await menu.deleteOne()
                            } catch (err) {
                                return res.status(500).json({ message: "Deleting restaurant menu has failed! ", error: err })
                            }
                            return res.status(200).json({ message: "Restaurant menu deleted."})
                            
                        } else {
                            res.status(404).json({ error: "Resturant menu does not exist in the database." });        
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

export default deleteMenu;