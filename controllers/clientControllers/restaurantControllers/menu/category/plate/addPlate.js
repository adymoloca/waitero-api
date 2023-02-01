import { check } from "express-validator";
import Client from "../../../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import RestaurantMenu from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import MenuCategory from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js";
import Plate from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/plates/plateSchema.js";
import Menu from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import Category from "../../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js";
import { validateObjectId } from "../../../../../utils/validation/validateObjectId.js";

const addPlate = async (req, res, next) => {

    const errors = check(req);
    const {body, params} = req;
    const restaurantId = await params.restaurantId;
    const clientId = await params.clientId;
    const menuId = await params.menuId;
    const categoryId = await params.categoryId;

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

                                    let menu;
                                    try {
                                        menu = await RestaurantMenu.findById(menuId);
                                    } catch (err) {
                                        return res.status(404).json({message: "Could not find any RestaurantMenu! ", error: err})
                                    }

                                    let category; 
                                    try {
                                        category = await MenuCategory.findById(categoryId);
                                    } catch (err) {
                                        return res.status(404).json({message: "Could not find any MenuCategory! ", error: err})
                                    }

                                    if(client && restaurant && menu && category) {

                                        const newPlate = new Plate({
                                            clientId: client._id,
                                            restaurantId: restaurant._id,
                                            menuId: menu._id,
                                            categoryId: category._id,
                                            plateName: req.body.plateName,
                                            platePrice: req.body.platePrice,
                                            plateIngredients: req.body.plateIngredients,
                                            platePhoto: req.body.platePhoto
                                        });

                                        await newPlate.save()
                                            .then(async result => {
                                                category.plates.push(result._id);
                                                await category.save({
                                                    validateModifiedOnly: true,
                                                });
                                                res.status(201).json({
                                                    message: 'New plate added!',
                                                    plate: result
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

export default addPlate;