import { check } from "express-validator";
import Category from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js";
import Client from "../../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Menu from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import { validateObjectId } from "../../../../utils/validation/validateObjectId.js";


const getCategory = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const menuId = req.params.menuId;
    const categoryId = req.params.categoryId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(menuId)) {

                if (validateObjectId(categoryId)) {

                    const clientExists = await Client.exists({_id: clientId});
                    const restaurantExists = await Restaurant.exists({_id: restaurantId});
                    const menuExists = await Menu.exists({_id: menuId});
                    const categoryExists = await Category.exists({_id: categoryId});

                    if (clientExists) {
        
                        if (restaurantExists) {

                            if (menuExists) {
                                
                                if (categoryExists) {

                                    try {
                                        await Category.find({_id: categoryId}).then(result => {
                                            res.status(200).json({
                                                message: "Category loaded succesfully",
                                                category: result
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
                                    res.status(404).json({ error: "Menu category does not exist in the database." });        
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
                    res.status(404).json({message: "The parameter categoryId = " + categoryId + " in the URL does not fulfill the correct form of an objectId."});
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

export default getCategory;