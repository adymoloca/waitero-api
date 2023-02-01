import 'dotenv/config';
import crypto from 'crypto';

export const getRefreshSecret = () => {
    
    const refreshSecret = process.env.REFRESH_SECRET; // first secret for encoding the token stored locally - PRIVATE MODE
    const hash = crypto.createHmac('sha256', refreshSecret).update(process.env.UPDATE_REFRESH_SECRET).digest('hex'); // second secret for encoding the token stored locally - PRIVATE MODE
    
    return hash;
}
