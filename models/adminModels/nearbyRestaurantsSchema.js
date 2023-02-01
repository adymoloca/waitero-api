import { mongoose } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const nearbyRestaurantsSchema = new mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    cuisines: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    cheapestPlate: { type: Number, required: true }
});

nearbyRestaurantsSchema.plugin(uniqueValidator);

export default mongoose.model('NearbyRestaurants', nearbyRestaurantsSchema);