import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { mongoose, Schema } = pkg;

const drinkSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    drinkName: { type: String, required: true, default: "Coca-Cola"},
    drinkCategory:{type: String, required: true, enum:["Juice", "Coffee", "Wine", "Cognac", "Whiskey", "Vodka", "Shoots", "Water", "Beer"], default: "Juice"}, 
    drinkPrice: { type: Number, required: true, default: 0 },
    drinkPhoto: { type: String}
}, {timestamps: true});

drinkSchema.plugin(uniqueValidator);

export default mongoose.model('Drink', drinkSchema);