import { mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique : true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'admin' },
    access: {type: String, default: 'all'},
    loggedIn: { type: Boolean, default: false }
});

adminSchema.plugin(uniqueValidator);

export default mongoose.model('Admin', adminSchema);