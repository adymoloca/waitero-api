import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';;

const { mongoose } = pkg;

const plateSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    menuId: {type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantMenu'},
    categoryId: {type: mongoose.Schema.Types.ObjectId, ref: 'MenuCategory'},
    plateName: { type: String, required: true, default: 'New'},
    platePrice: { type: Number, required: true, default: 0},
    plateIngredients: [{type:String, required: true, default: ["Ingrediente de baza"]}],
    platePhoto: { type: String}
}, {timestamps: true});

plateSchema.plugin(uniqueValidator);

export default mongoose.model('Plate', plateSchema);
