import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { mongoose } = pkg;

const extraSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    extraName: { type: String, required: true, default: 'Extra' },
    extraPrice: { type: Number, required: true, default: 0 },
    extraPhoto: { type: String }
}, { timestamps: true });

extraSchema.plugin(uniqueValidator);

export default mongoose.model('Extra', extraSchema);