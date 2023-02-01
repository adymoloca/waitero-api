import jwt from 'jsonwebtoken';
import { getRefreshSecret } from './generateRefreshSecrete.js';
import { getRole } from './getRole.js';

const validateRefreshToken = async (req, res, next) => {
    
    const auhorizationHeader = req.headers.authorization;

    let result;

    if (!auhorizationHeader) {
        return res.status(401).json({
            error: true,
            message: "Refresh token is missing",
        });
    }

    const refreshToken = req.headers.authorization.split(" ")[1];
    
    const refreshSecret = getRefreshSecret();

    try {
        result = jwt.verify(refreshToken, refreshSecret);
        
        let usedByResponse = await getRole(result);

        if (!usedByResponse) {
            result = {
                error: true,
                message: "Authorization error",
            };

            return res.status(403).json(result);
        }
        

        if (!usedByResponse.email === result.email) {
            result = {
                error: true,
                message: "Invalid token",
            };

            return res.status(401).json(result);
        }

        req.decoded = result;

        next();

    } catch (error) {

        if (error.name === "RefreshTokenExpiredError") {
            return res.status(403).json({
                error: true,
                message: "Refresh Token expired",
            });
        }

        return res.status(403).json({
            error: true,
            message: "Authentication error",
        });
    }
}

export default validateRefreshToken;