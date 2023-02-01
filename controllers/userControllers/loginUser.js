import User from '../../models/userModels/userSchema.js';
import  bcrypt from 'bcrypt';
import { createToken } from '../utils/createToken.js';

const loginUser = async (req, res) => {
    const body = req.body;
    let emailLowerCase = body.email.toLowerCase();
    const user = await User.findOne({ email: emailLowerCase });
    if (user) {
      const validPassword = await bcrypt.compare(body.password, user.password);
      if (validPassword) {
        const userResponse = await User.findOne({ email: emailLowerCase }).select("-password");
        userResponse.loggedIn = true;
        const {token, refreshToken} = createToken(userResponse);
        res.status(200).json({ message: "Logged in successfully - Valid password", user: userResponse, token: token, refreshToken: refreshToken });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  };

  export default loginUser;