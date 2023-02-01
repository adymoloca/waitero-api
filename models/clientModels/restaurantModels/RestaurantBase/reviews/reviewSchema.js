import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { mongoose } = pkg;

const reviewSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    food: { type: Number, required: true, min: 0, max: 5, default: 0 },
    service: { type: Number, required: true, min: 0, max: 5, default: 0 },
    ambience: { type: Number, required: true, min: 0, max: 5, default: 0 },
    experience : { type: Number, required: true, min: 0, max: 5, default: 0 },
    value: {type: Number, min: 0, max: 5, default: 0}
}, {timestamps: true});

reviewSchema.plugin(uniqueValidator);

export default mongoose.model('Review', reviewSchema);
