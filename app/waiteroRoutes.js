import express from 'express';

const waiteroRoutes = express.Router();

//Users
import userRoutes from './routes/userRoutes.js';

//Client Routes
import clientRoutes from './routes/clientRoutes.js';

//Admin Routes
import adminRoutes from './routes/adminRoutes.js';
import tokenRoutes from './routes/tokenRoutes.js';

//path
waiteroRoutes.use('/users', userRoutes);
waiteroRoutes.use('/clients', clientRoutes);
waiteroRoutes.use('/admins', adminRoutes);
waiteroRoutes.use('/tokens', tokenRoutes);

export default waiteroRoutes;