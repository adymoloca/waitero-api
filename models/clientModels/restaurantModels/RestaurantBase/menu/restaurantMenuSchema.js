import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autopopulate from 'mongoose-autopopulate';
import MenuCategory from './category/menuCategorySchema.js';
import Plate from './category/plates/plateSchema.js';

const { mongoose } = pkg;

const restaurantMenuSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    menuName: { type: String, required: true, default: 'Waitero-Client' },
    menuCategories: [{type: mongoose.Schema.Types.ObjectId, ref: MenuCategory, autopopulate: true}]
}, {timestamps: true});


restaurantMenuSchema.pre('deleteOne', { document: true, query: false }, async function() {
    await MenuCategory.deleteMany({ menuId: this._id });
    await Plate.deleteMany({menuId: this._id});
});

restaurantMenuSchema.plugin(autopopulate);
restaurantMenuSchema.plugin(uniqueValidator);

export default mongoose.model('RestaurantMenu', restaurantMenuSchema);