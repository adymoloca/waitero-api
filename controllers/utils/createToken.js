import jwt from 'jsonwebtoken';
import { getRefreshSecret } from './generateRefreshSecrete.js';
import { getSecret } from './generateSecret.js';


export const createToken = (objectEncoded) => {

    const decoded = objectEncoded.toObject();
    const secret = getSecret();
    const refreshSecret = getRefreshSecret();
    const authToken = {id: decoded._id, role: decoded.role, email: decoded.email}
    const token = jwt.sign({authToken: authToken}, secret, {expiresIn: "15m"});
    const refreshToken = jwt.sign({authToken: authToken}, refreshSecret, { expiresIn: "24h" });

    return {token, refreshToken};
}