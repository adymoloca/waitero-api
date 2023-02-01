import { Router } from "express";
import { generateNewAccessToken } from "../../controllers/utils/generateNewAccessToken.js";

const tokenRoutes = Router();

tokenRoutes.post('/refresh-token', generateNewAccessToken);

export default tokenRoutes;