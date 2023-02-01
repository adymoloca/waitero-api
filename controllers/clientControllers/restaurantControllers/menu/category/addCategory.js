import { check } from "express-validator";
import RestaurantMenu from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";
import MenuCategory from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js";
import Restaurant from "../../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import Client from "../../../../../models/clientModels/clientSchema.js";
import { validateObjectId } from "../../../../utils/validation/validateObjectId.js";
import Menu from "../../../../../models/clientModels/restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js";

const addCategory = async (req, res, next) => {
    
    const errors = check(req);

    const {body, params} = req;
    const restaurantId = await params.restaurantId;
    const clientId = await params.clientId;
    const menuId = await params.menuId;

    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            if (validateObjectId(menuId)) {

                const clientExists = await Client.exists({_id: clientId});
                const restaurantExists = await Restaurant.exists({_id: restaurantId});
                const menuExists = await Menu.exists({_id: menuId});

                if (clientExists) {
    
                    if (restaurantExists) {

                        if (menuExists) {

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
                                return res.status(404).json({message: "Could not find any restaurant! ", error: err})
                            }

                            if(client && restaurant && menu) {

                                const newCategory = new MenuCategory({
                                    categoryName: body.categoryName,
                                    menuId: menu._id,
                                    restaurantId: restaurant._id,
                                    clientId: client._id
                                });

                                await newCategory.save()
                                    .then(async result => {
                                        menu.menuCategories.push(result._id);
                                        await menu.save({
                                            validateModifiedOnly: true,
                                        });

                                        res.status(201).json({
                                            message: 'New category added!',
                                            category: result
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

export default addCategory;
