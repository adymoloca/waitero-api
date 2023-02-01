import { mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import pkg from 'validator';

const { isEmail } = pkg;

const userSchema = new mongoose.Schema({
    name: { type: String, minLength: 2, maxLength: 128, required: true },
    email: { type: String, validate: isEmail, required: true, unique : true },
    phone: { type: String, minLength: 10,  maxLength: 13, required: true, unique: true },
    password: { type: String, required: true},
    role: { type: String, required: true, default: 'user' },
    loggedIn: { type: Boolean, default: false },
    actualTable: {
        clientId: {type: String},
        restaurantId: { type: String },
        tableNumber: { type: String },
        password: { type: String }
    }
}, {timestamps: true});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);