import { mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import Extra from '../extraSchema.js.js.js';
import Drink from '../drinksSchema.js.js.js'

const cartOrderSchema = new mongoose.Schema({
    cartTotalCheckout: { type: Number, required: true, default: 0},
    orders: [{type: mongoose.Schema.Types.ObjectId, ref: 'CartUser'}]
});

cartOrderSchema.plugin(uniqueValidator);

export default mongoose.model('Cart', cartOrderSchema);