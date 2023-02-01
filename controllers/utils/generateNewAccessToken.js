import jwt from 'jsonwebtoken';
import { createToken } from './createToken.js';
import { getRefreshSecret } from './generateRefreshSecrete.js';
import { getRole } from './getRole.js';

export const generateNewAccessToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    const refreshSecret = getRefreshSecret();
    let result;

    try {
        result = jwt.verify(refreshToken, refreshSecret);

        let role = await getRole(result);

        if (role) {
            const {token, refreshToken} = createToken(role);
            res.status(201).json({
                token: token,
                refreshToken: refreshToken
            })
        } else {
            console.log("Error: Cannot get role.");
        }


    } catch (error) {
        res.status(400).json({
            error: "Cannot verify refreshToken."
        })
    }

    
}