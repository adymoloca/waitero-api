import jwt from 'jsonwebtoken';
import { getSecret } from './generateSecret.js';

export const decodeToken = (token) => {
    const secret = getSecret();
    const decoded = jwt.verify(token, secret);

    return decoded;
}