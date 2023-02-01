import { check } from "express-validator";
import Client from "../../../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Menu from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import Category from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js";
import Plate from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/plates/plateSchema.js";
import { validateObjectId } from "../../../../../utils/validation/validateObjectId.js";

const updatePlate = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    const menuId = req.params.menuId;
    const categoryId = req.params.categoryId;
    const plateId = req.params.plateId;
    const {
        plateName,
        platePrice,
        plateIngredients,
        platePhoto
    } = req.body;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(menuId)) {

                if (validateObjectId(categoryId)) {

                    if (validateObjectId(plateId)) {

                        const clientExists = await Client.exists({_id: clientId});
                        const restaurantExists = await Restaurant.exists({_id: restaurantId});
                        const menuExists = await Menu.exists({_id: menuId});
                        const categoryExists = await Category.exists({_id: categoryId});
                        const plateExists = await Plate.exists({_id: plateId});
        
                        if (clientExists) {
            
                            if (restaurantExists) {
            
                                if (menuExists) {
    
                                    if (categoryExists) {
        
                                        if (plateExists) {

                                            let plate;
                                            try {
                                                plate = await Plate.findById(plateId);
                                            } catch (err) {
                                                return res.status(404).json({message: "Could not update plate! - Plate not found.", errors: errors})
                                            }
                                        
                                            if(plate) {
                                                plate.plateName = plateName ? plateName : plate.plateName;
                                                plate.platePrice = platePrice ? platePrice : plate.platePrice;
                                                plate.plateIngredients = plateIngredients ? plateIngredients : plate.plateIngredients;
                                                plate.platePhoto = platePhoto ? platePhoto : plate.platePhoto;
                                                plate.updatedAt = new Date();
                                            }
                                        
                                            try {
                                                await plate.save({
                                                    validateModifiedOnly: true,
                                                });
                                            } catch (err) {
                                                return res.status(500).json({message: "Could not update plate! ", error: err})
                                            }
                                            return res.status(200).json({ 
                                                message: "Plate updated!", 
                                                plate: plate
                                            })
                                        } else {
                                            res.status(404).json({ error: "Plate does not exist in the database." });    
                                        }
            
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
                        res.status(404).json({message: "The parameter plateId = " + plateId + " in the URL does not fulfill the correct form of an objectId."});        
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

export default updatePlate;