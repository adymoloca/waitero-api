import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autopopulate from 'mongoose-autopopulate';
import RestaurantMenu from './menu/restaurantMenuSchema.js';
import waiteroImg from '../utils/base64DefaultImage.js';
import SpecialOffer from './offers/specialOfferSchema.js';
import Drink from './drinks/drinkSchema.js';
import Review from './reviews/reviewSchema.js';
import MenuCategory from './menu/category/menuCategorySchema.js';
import Plate from './menu/category/plates/plateSchema.js';
import Extra from './extras/extraSchema.js';
import Table from './tables/tableSchema.js';

const { mongoose } = pkg;

const restaurantSchema = new mongoose.Schema({
    //Generated fields from token authorization header
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    
    //Requireds fields
    restaurantName: { type: String, minlength: 2, maxlength: 40, required: true },
    cuisines: {type: [String], enum: ["Traditional", "Pizza", "Burger", "Fast-Food", "Ciorbe/Supe", "Desert", "Aperitive", "Asiatic", "Buritto", "Bauturi", "Cofetarie", "Patiserie", "Fructe de mare", "Gratar", "Noodles", "Paste", "Peste", "Salate", "Sandwich", "Sushi", "Taco", "Vegan", "Vegetarian", "Kebab"],required: true},

    location: { 
        address: {
            city: {type: String},
            street: {type: String},
            number: {type: String},
            postalCode: {type: String},
            country: {type: String, default: "Romania"}
        },
        coordinates: {
            lat: {type: String, default: "45"},
            long: {type: String, default: "45"}
        } 
    },

    //Optional Fields with default value
    paymentOptions: { type: [String], enum: ["Cash", "Card", "Online"], default: ["Cash"]},
    entertainment: { type: [String], enum: ["Live Music", "Stand Up", "Live Sports", "Events", "Karaoke", "Games", "Others"], default: ["Events"] },
    description: { type: String, default: "Waitero Restaurant with the best food from the town - Choose what do you want whitout to wait for others"},
    contact: {
        website: { type: String, default: "www.waitero.com"},
        phoneNumber: {type: String, default: "0700 000 000"},
        socialMedia: {
            facebookLink: { type: String, default: "www.facebook.com/waitero" },
            instagramLink: { type: String, default: "www.instagram.com/waitero"},
        },
        orar: {
            mondayToFriday: {
                    openAt: { type: String, default: "08:00" },
                    closeAt: {type: String, default: "23:00"},
            },
            saturday: {
                openAt: { type: String, default: "09:00" },
                closeAt: {type: String, default: "00:00"},
            },
            sunday: {
                openAt: { type: String, default: "10:00" },
                closeAt: {type: String, default: "23:30"},
            },
        },
    },

    //Photo fields with default template value
    photos: [{ type: String}],
    coverPicture: { type: String, default: "" },

    //Other schema inside
    tables: [{type: mongoose.Schema.Types.ObjectId, ref: Table, autopopulate: true}],
    restaurantMenu: [{type: mongoose.Schema.Types.ObjectId, ref: RestaurantMenu, autopopulate: true}],
    rating: [{ type: mongoose.Schema.Types.ObjectId, ref: Review, autopopulate: true}],
    specialOffers: [{type: mongoose.Schema.Types.ObjectId, ref: SpecialOffer, autopopulate: true}],
    drinks: [{type: mongoose.Schema.Types.ObjectId, ref: Drink, autopopulate: true}],
    extras: [{type: mongoose.Schema.Types.ObjectId, ref: Extra, autopopulate: true}]
}, {timestamps: true});

restaurantSchema.pre('deleteOne', { document: true, query: false }, async function() {
    await RestaurantMenu.deleteMany({ restaurantId: this._id });
    await MenuCategory.deleteMany({restaurantId: this._id});
    await Plate.deleteMany({restaurantId: this._id});
    await Extra.deleteMany({restaurantId: this._id});
    await SpecialOffer.deleteMany({ restaurantId: this._id });
    await Drink.deleteMany({ restaurantId: this._id });
    await Table.deleteMany({ restaurantId: this._id });
    await Review.deleteMany({ restaurantId: this._id });
});

restaurantSchema.plugin(autopopulate);
restaurantSchema.plugin(uniqueValidator);

export default mongoose.model('Restaurant', restaurantSchema);