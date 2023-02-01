import { check } from "express-validator";
import Table from "../../../../models/clientModels/restaurantModels/RestaurantBase/tables/tableSchema.js";
import Client from "../../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import QRCode from 'qrcode'
import { validateObjectId } from "../../../utils/validation/validateObjectId.js";

const addTable = async (req, res,next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;

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

                    const qrCodeGenerated = {
                        clientId: client._id,
                        restaurantId: restaurant._id,
                        tableNumber: req.body.tableNumber
                    }

                    const strignified = JSON.stringify(qrCodeGenerated);

                    let newTable;

                    try {

                        QRCode.toDataURL(strignified)
                            .then(async (url) => {
                                if (url) {
                                    newTable = new Table({
                                        clientId: clientId,
                                        restaurantId: restaurantId,
                                        tableNumber: req.body.tableNumber,
                                        qrCode: url
                                    });

                                    await newTable.save().then(result => {
                                        restaurant.tables.push(result._id);
                                        restaurant.save({
                                            validateModifiedOnly: true,
                                        });
                                        res.status(201).json({
                                            message: 'New table added!',
                                            table: result
                                        });
                                    });
                                }
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(400).send({
                                    message: err,
                                    errors: errors
                                });
                        })
                        
                    } catch(err) {
                        res.status(400).send({
                            message: err,
                            errors: errors
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

export default addTable;