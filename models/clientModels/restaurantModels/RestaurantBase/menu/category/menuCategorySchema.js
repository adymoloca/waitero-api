import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autopopulate from 'mongoose-autopopulate';
import Plate from './plates/plateSchema.js';

const { mongoose } = pkg;

const menuCategorySchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    menuId: {type: mongoose.Schema.Types.ObjectId, ref: 'RestaurantMenu'},
    categoryName: { type: String, required: true, default: 'Section menu' },
    plates: [{type: mongoose.Schema.Types.ObjectId, ref: Plate, autopopulate: true}],
}, {timestamps: true});


menuCategorySchema.pre('deleteOne', { document: true, query: false }, async function() {
    await Plate.deleteMany({ categoryId: this._id });
});

menuCategorySchema.plugin(autopopulate);
menuCategorySchema.plugin(uniqueValidator);

export default mongoose.model('MenuCategory', menuCategorySchema);