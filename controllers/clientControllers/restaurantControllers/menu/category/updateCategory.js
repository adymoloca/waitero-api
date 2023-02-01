import { check } from "express-validator";
import Client from "../../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Menu from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import Category from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js";
import { validateObjectId } from "../../../../utils/validation/validateObjectId.js";

const updateCategory = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const menuId = req.params.menuId;
    const categoryId = req.params.categoryId;
    const {categoryName} = req.body;

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
                                    
                                    let category;
                                    try {
                                        category = await Category.findById(categoryId);
                                    } catch (err) {
                                        return res.status(404).json({message: "Could not update category! - Category not found.", error: err})
                                    }
                                
                                    if(categoryName) {
                                        category.categoryName = categoryName;
                                        category.updatedAt = new Date();
                                    }
                                
                                    try {
                                        await category.save({
                                            validateModifiedOnly: true,
                                        });
                                    } catch (err) {
                                        return res.status(500).json({message: "Could not update category! ", error: err})
                                    }
                                    return res.status(200).json({ 
                                        message: "Category updated!", 
                                        category: category
                                    })
                                    
                                } else {
                                    res.status(404).json({ error: "Category does not exist in the database." });
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
    
}

export default updateCategory;