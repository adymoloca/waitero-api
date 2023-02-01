import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";
import { getCoordinates } from "../../utils/getCoordinates.js";
import { validateCoordinates } from "../../utils/validation/validateCoordinates.js";

const updateRestaurant = async (req, res, next) => {

    const errors = check(req);
    const clientId = req.params.clientId;
    const restaurantId = req.params.restaurantId;
    let {restaurantName, cuisines, location, description, coverPicture, entertainment, photos, contact, paymentOptions} = req.body;
    
    if (validateObjectId(clientId)) {

        if (validateObjectId(restaurantId)) {

            const clientExists = await Client.exists({_id: clientId});
            const restaurantExists = await Restaurant.exists({_id: restaurantId});

            if (clientExists) {

                if (restaurantExists) {

                    let restaurant;
                    try {
                        restaurant = await Restaurant.findById(restaurantId);
                    } catch (err) {
                        return res.status(404).json({message: "Could not update restaurant! - Restaurant not found. ", error: err});
                    }
                
                    let updatedField;
                
                    if(restaurant){
                        if (restaurantName) {
                            restaurant.restaurantName = restaurantName;
                            updatedField = restaurantName;
                        }
                
                        if (cuisines) {
                            restaurant.cuisines = cuisines;
                            updatedField = cuisines;
                            
                        }
                
                        if (location) {

                            let country = 'RO', city, street, number;
                           
                            city = location.address.city;
                            street = location.address.street;
                            number = location.address.number;


                            await getCoordinates(country, city, street, number).then((e) => {
                                
                                if (e) {
                                    if ((typeof e.coordLat) === 'undefined' || (typeof e.coordLong) === 'undefined') {
                                        return res.status(400).json({
                                            error: 'coordinates undefined.'
                                        })
                                    }
                                    if ( validateCoordinates(e.coordLat, e.coordLong) ) {

                                        location = {
                                            ...location,
                                            coordinates: {
                                                lat: e.coordLat.toString(),
                                                long: e.coordLong.toString()
                                            }
                                        } 

                                    } else {
                                        console.log('Invalid coordinates.');
                                    }             
    
                                } else {
                                    console.log('Lat and long undefined');
                                }

                            }).catch(error => {
                                console.log(error);
                            })

                            restaurant.location = location;
                            updatedField = location;

                        }
                
                        if (description) {
                            restaurant.description = description;
                            updatedField = description;
                        }
                
                        if (coverPicture) {
                            restaurant.coverPicture = coverPicture;
                            updatedField = coverPicture;
                        }
                
                        if (entertainment) {
                            restaurant.entertainment = entertainment;            
                            updatedField = entertainment;
                        }
                
                        if (photos) {
                            restaurant.photos = photos;
                            updatedField = photos;
                        }
                
                        if (contact) {
                            restaurant.contact = contact;
                            updatedField = contact;
                        }
                
                        if (paymentOptions) {
                            restaurant.paymentOptions = paymentOptions;
                            updatedField = paymentOptions;
                        }
                        
                        restaurant.updatedAt = new Date();
                
                        try {
                            await restaurant.save({
                                validateModifiedOnly: true,
                            });
                
                            return res.status(200).json({ 
                                message: "Restaurant updated!", 
                                updatedField: updatedField
                            })
                        } catch (err) {
                            return res.status(500).json({message: "Could not update restaurant! ", error: err})
                        }


                    } else {
                        return res.status(404).json({message: "Could not find any restaurant! ", error: errors});
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

export default updateRestaurant;