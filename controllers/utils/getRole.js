import Admin from "../../models/adminModels/adminSchema.js";
import Client from "../../models/clientModels/clientSchema.js";
import User from "../../models/userModels/userSchema.js";

export const getRole = async (tokenResponse) => {
    const role = await tokenResponse.authToken.role;
    const id = await tokenResponse.authToken.id;
    let usedBy;
    switch (role) {
        case "admin":
            usedBy = await Admin.findById(id);
            break;
        case "client":
            usedBy = await Client.findById(id);
            break;
        case "user":
            usedBy = await User.findById(id);
            break;
        default:
            usedBy = null;
    }
    return usedBy;
}