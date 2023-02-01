import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autopopulate from 'mongoose-autopopulate';
import pkgg from 'validator';

import Restaurant from './restaurantModels/RestaurantBase/restaurantSchema.js';
import RestaurantMenu from './restaurantModels/RestaurantBase/menu/restaurantMenuSchema.js';
import MenuCategory from './restaurantModels/RestaurantBase/menu/category/menuCategorySchema.js';
import Plate from './restaurantModels/RestaurantBase/menu/category/plates/plateSchema.js';
import Extra from './restaurantModels/RestaurantBase/extras/extraSchema.js';
import Drink from './restaurantModels/RestaurantBase/drinks/drinkSchema.js';
import Review from './restaurantModels/RestaurantBase/reviews/reviewSchema.js';
import SpecialOffer from './restaurantModels/RestaurantBase/offers/specialOfferSchema.js';
import Table from './restaurantModels/RestaurantBase/tables/tableSchema.js';

const { isEmail } = pkgg;

const { mongoose } = pkg;

const clientSchema = new mongoose.Schema({
    name: { type: String, minLength: 2, maxLength: 128, required: true },
    email: { type: String, validate: isEmail, required: true, unique : true },
    phone: { type: String, minLength: 10,  maxLength: 13, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'client' },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        autopopulate: true
    }],
    loggedIn: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }
}, {timestamps: true});

clientSchema.pre('deleteOne', { document: true, query: false }, async function() {    
    await Restaurant.deleteMany({ clientId: this._id });
    await RestaurantMenu.deleteMany({ clientId: this._id });
    await MenuCategory.deleteMany({ clientId: this._id});
    await Plate.deleteMany({clientId: this._id});
    await Extra.deleteMany({clientId: this._id});
    await Drink.deleteMany({ clientId: this._id });
    await Table.deleteMany({clientId: this._id});
    await Review.deleteMany({clientId: this._id});
    await SpecialOffer.deleteMany({clientId: this._id});
});

clientSchema.plugin(autopopulate);
clientSchema.plugin(uniqueValidator);

export default mongoose.model('Client', clientSchema);