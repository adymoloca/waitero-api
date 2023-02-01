import { mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


const cartUserSchema = new mongoose.Schema({
    clientId : {type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
    restaurantId : {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tableNumber: { type: String, required: true },
    isPaidOrder: { type: Boolean, default: false },
    isServed: {type: Boolean, default: false},
    myCart: {
        plates: [{
            plateName: {type: String},
            platePrice: {type: Number},
            plateQuantity: { type: Number },
            plateIngredients: [{type: String}],
            suplimentaryDescription: {type: String},
            totalPrice: {type: Number},
            isPaid: {type: Boolean, default: false},
            isServed: {type: Boolean, default: false}
        }],
        drinks: [{
            drinkName: {type: String},
            drinkPrice: {type: Number},
            drinkQuantity: {type: Number},
            suplimentaryDescription: {type: String},
            totalPrice: {type: Number},
            isPaid: {type: Boolean, default: false},
            isServed: {type: Boolean, default: false}
        }],
        extras: [{
            extraName: {type: String},
            extraPrice: {type: Number},
            extraQuantity: {type: Number},
            suplimentaryDescription: {type: String},
            totalPrice: {type: Number},
            isPaid: {type: Boolean, default: false},
            isServed: {type: Boolean, default: false}
        }]
    }
    
}, {timestamps: true});

// cartUserSchema.pre('update', { document: true, query: false }, async function () {
    
//     let isDrinksPaid = true;
//     let isPlatesPaid = true;
//     let isExtrasPaid = true;

//     const isPaid = (arr) => {
//         arr.map(el => {
//             if (!el.isPaid) {
//                 if (arr === this.myCart.drinks) {
//                     isDrinksPaid = false;
//                     return isDrinksPaid;
//                 } else if (arr === this.myCart.plates) {
//                     isPlatesPaid = false;
//                     return isPlatesPaid;
//                 } else if (arr === this.myCart.extras) {
//                     isExtrasPaid = false;
//                     return isExtrasPaid;
//                 }
                
//             }
//             return isDrinksPaid && isPlatesPaid && isExtrasPaid;
//         });
//     };

//     if (isPaid(this.myCart.drinks) && isPaid(this.myCart.plates) && isPaid(this.myCart.extras))
//         this.isPaid = true;
// });

cartUserSchema.plugin(uniqueValidator);

export default mongoose.model('CartUser', cartUserSchema);