import { check } from "express-validator";
import User from '../../models/userModels/userSchema.js';
import Table from "../../models/clientModels/restaurantModels/RestaurantBase/tables/tableSchema.js";
import { validateObjectId } from "../utils/validation/validateObjectId.js";

const setActualTableForUser = async (req, res, next) => {

    const errors = check(req);
    const {userId, clientId, restaurantId, tableNumber} = await req.params;

    if (validateObjectId(userId)) {

        const userExists = await User.exists({_id: userId});

        if (userExists) {
            
            let user, theTable;
            try {
                user = await User.findById(userId);
            } catch (err) {
                return res.status(404).json({message: "Could not update user! - User not found. ", error: err})
            }
        
            if (user && clientId && restaurantId && tableNumber) {

                theTable = await Table.findOne({ clientId: clientId, restaurantId: restaurantId, tableNumber: tableNumber }).exec();

                let password = '';
                // const unique = clientId.toString() + restaurantId.toString() + (user._id).toString();
                
                if (theTable && theTable.isEmpty === true) {
                    for (let i = 0; i < 2; i++)
                        password += tableNumber.toString() + (user._id).toString().charAt(Math.floor(Math.random() * (user._id).toString().length)) + clientId.toString().charAt(Math.floor(Math.random() * clientId.toString().length)) + restaurantId.toString().charAt(Math.floor(Math.random() * restaurantId.toString().length));
                    theTable.password = password.toUpperCase();
                    theTable.isEmpty = false;
                }

                user.actualTable = {
                    clientId: clientId,
                    restaurantId: restaurantId,
                    tableNumber: tableNumber,
                    password: password.toUpperCase()
                }
            }
        
            try {
                await theTable.save({
                    validateModifiedOnly: true,
                })

                await user.save({
                    validateModifiedOnly: true,
                });

            } catch (err) {
                return res.status(500).json({message: "Could not update user! ", error: err})
            }
            return res.status(200).json({ 
                message: "User updated.", 
                actualTable: user.actualTable
                
            })
        } else {
            res.status(404).json({ error: "User does not exist in the database." });
        }

    } else {
        res.status(404).json({message: "The parameter userId = " + userId + " in the URL does not fulfill the correct form of an objectId."});
    }
    
};

export default setActualTableForUser;