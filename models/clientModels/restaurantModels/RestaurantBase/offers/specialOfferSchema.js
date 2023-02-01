import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { mongoose, Schema } = pkg;

const specialOfferSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    plateName: { type: String, default: 'Specialitatea Casei', required: true },
    platePrice: { type: Number, default: 0, required: true  },
    offer: { type: String, default: 'Numele ofertei', required: true  }
}, {timestamps: true});

specialOfferSchema.plugin(uniqueValidator);

export default mongoose.model('SpecialOffer', specialOfferSchema);