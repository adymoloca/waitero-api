import pkg from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const { mongoose } = pkg;

const tableSchema = new mongoose.Schema({
    clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'},
    restaurantId: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'},
    tableNumber: {type: Number, required: true, default: 1},
    qrCode: { type: String, required: true, default: 'qrcode' },
    isEmpty: { type: Boolean, default: true },
    password: {type: String, default: ""}
}, {timestamps: true});

tableSchema.plugin(uniqueValidator);

export default mongoose.model('Table', tableSchema);