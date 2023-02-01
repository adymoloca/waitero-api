import 'dotenv/config';
import crypto from 'crypto';

export const getSecret = () => {
    
    const secret = process.env.SECRET; // first secret for encoding the token stored locally - PRIVATE MODE
    const hash = crypto.createHmac('sha256', secret).update(process.env.UPDATE_SECRET).digest('hex'); // second secret for encoding the token stored locally - PRIVATE MODE
    
    return hash;
}
