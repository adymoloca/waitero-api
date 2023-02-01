import Client from '../../models/clientModels/clientSchema.js';
import  bcrypt from 'bcrypt';
import { createToken } from '../utils/createToken.js';

const loginClient = async (req, res, next) => {

    const body = req.body;
    let emailLowerCase = body.email.toLowerCase();

    const client = await Client.findOne({ email: emailLowerCase });
    if (client) {

      const validPassword = await bcrypt.compare(body.password, client.password);
      if (validPassword) {

        const clientResponse = await Client.findOne({ email: emailLowerCase }).select("-password");
      
        if (client.isBlocked === false) {

          clientResponse.loggedIn = true;
          const {token, refreshToken} = createToken(clientResponse);
  
          res.status(200).json({ 
            message: "Logged in succesfully - valid password",
            client: clientResponse,
            token: token,
            refreshToken: refreshToken
          });

        } else if (client.isBlocked === true) {
          res.status(403).json({
            error: "You've been blocked."
          })
        }

      } else {

        res.status(400).json({ 
          error: "Invalid Password"
        });
      }
    } else {
      res.status(404).json({
        error: "User does not exist"
      });
    }
  };

  export default loginClient;