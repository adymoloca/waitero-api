import { mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


const tableOrderSchema= new mongoose.Schema({
    clientId : {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
    restaurantId : {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    tableNumber: {type: String, required: true},
    userId : [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}],
    isPaid: {type: Boolean},
    plates: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        plateId: {type: mongoose.Schema.Types.ObjectId, ref: 'Plate'},
        plateName: {type: String},
        platePrice: {type: Number},
        plateQuantity: {type: Number},
        suplimentaryDescription: {type: String},
        totalPrice: {type: Number},
        isPaid: {type: Boolean}
    }],
    drinks: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        drinkId: {type: mongoose.Schema.Types.ObjectId, ref: 'Drink'},
        drinkName: {type: String},
        drinkPrice: {type: Number},
        drinkQuantity: {type: Number},
        suplimentaryDescription: {type: String},
        totalPrice: {type: Number},
        isPaid: {type: Boolean}
    }],
    extras: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
        extraId: {type: mongoose.Schema.Types.ObjectId, ref: 'Extra'},
        extraName: {type: String},
        extradrinkPrice: {type: Number},
        extraQuantity: {type: Number},
        suplimentaryDescription: {type: String},
        totalPrice: {type: Number},
        isPaid: {type: Boolean}
    }]
});

cartSchema.plugin(uniqueValidator);

export default mongoose.model('TableOrder', tableOrderSchema);