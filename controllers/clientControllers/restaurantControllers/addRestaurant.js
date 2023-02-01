import { check } from "express-validator";
import Client from "../../../models/clientModels/clientSchema.js";
import Restaurant from "../../../models/clientModels/restaurantModels/RestaurantBase/restaurantSchema.js";
import { validateObjectId } from "../../utils/validation/validateObjectId.js";

const addRestaurant = async (req, res,next) => {

    const errors = check(req);
    const {params} = req;
    const clientId = await params.clientId;

    if (validateObjectId(clientId)) {

        const clientExists = await Client.exists({_id: clientId});

        if (clientExists) {

            let client;
            try {
                client = await Client.findById(clientId);
            } catch (err) {
                return res.status(404).json({message: "Could not find any client. ", error: err})
            }

            if(client) {

                // let coordLat;
                // let coordLong;
                // implementare geocoding
                // https://developers.google.com/maps/documentation/geocoding/requests-geocoding
                // https://maps.googleapis.com/maps/api/geocode/json?components=locality:Rodna|street_address:Magurii|street_number:10|postal_code:427245&key=AIzaSyBcslwmp6MsrnzAkH1Zqsb7Evf777FM87Q

                // axios.get('url catre care faci request-ul cu toti parametrii, adica adresa').then(async (result) => {
                //     coordLat = await result.lat;
                //     coordLong = await result.long;
                // }).catch(err => {
                //     res.status(409).json({
                //         message: err
                //     })

                //     return 0;
                // })

                const newRestaurant = new Restaurant({
                    clientId: client._id,
                    ...req.body,

                    // location: {
                    //     address: {
                    //         city: req.body.location.address.city,
                    //         postalCode: req.body.location.address.postalCode,
                    //         street: req.body.location.address.street,
                    //         number: req.body.location.address.number
                    //     },
                    //     coordinates: {
                    //         lat: coordLat,
                    //         long: coordLong
                    //     }
                    // },
                
                });

                await newRestaurant.save()
                    .then(result => {
                        client.restaurants.push(result._id);
                        client.save({
                            validateModifiedOnly: true,
                        });

                        res.status(201).json({
                            message: 'New restaurant added!',
                            restaurant: result
                        });
                    })
                    .catch(err => {
                        res.status(400).send({
                            message: err,
                            errors: errors
                        });
                });
            } 

        } else {
            res.status(404).json({ error: "Client does not exist in the database." });    
        }

    } else {
        res.status(404).json({message: "The parameter clientId = " + clientId + " in the URL does not fulfill the correct form of an objectId."});
    }    
};

export default addRestaurant;