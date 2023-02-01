import Admin from '../../models/adminModels/adminSchema.js';
import  bcrypt from 'bcrypt';
import { createToken } from '../utils/createToken.js';

const loginAdmin = async (req, res) => {
    const body = req.body;
    let emailLowerCase = body.email.toLowerCase();
    const admin = await Admin.findOne({ email: emailLowerCase });
    if (admin) {
      const validPassword = await bcrypt.compare(body.password, admin.password);
      if (validPassword) {
        const adminResponse = await Admin.findOne({ email: emailLowerCase }).select("-password");
        adminResponse.loggedIn = true;
        const {token, refreshToken} = createToken(adminResponse);
        res.status(200).json({ message: "Valid password", admin: adminResponse, token: token, refreshToken: refreshToken });
      } else {
        res.status(400).json({ error: "Invalid Password" });
      }
    } else {
      res.status(404).json({ error: "User does not exist" });
    }
  };

  export default loginAdmin;