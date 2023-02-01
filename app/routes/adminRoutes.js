import { Router } from 'express';
import loginAdmin from '../../controllers/adminControllers/loginAdmin.js';
import getClients from '../../controllers/adminControllers/clients/getClients.js';
import validateToken from '../../controllers/utils/validateToken.js';
import deleteClient from '../../controllers/adminControllers/clients/deleteClient.js';
import validate from 'mongoose-validator';
import registerAdmin from '../../controllers/adminControllers/registerAdmin.js';
import updateAdminPassword from '../../controllers/adminControllers/updateAdminPassword.js';
import getUsers from '../../controllers/adminControllers/users/getUsers.js';
import deleteUser from '../../controllers/adminControllers/users/deleteUser.js';
import getClientsNumber from '../../controllers/adminControllers/statistics/getClientsNumber.js';
import getRestaurantsNumber from '../../controllers/adminControllers/statistics/getRestaurantsNumber.js';
import getReviewsNumber from '../../controllers/adminControllers/statistics/getReviewsNumber.js';
import getTablesNumber from '../../controllers/adminControllers/statistics/getTablesNumber.js';
import getPlatesNumber from '../../controllers/adminControllers/statistics/getPlatesNumber.js';
import getFoodReview from '../../controllers/adminControllers/statistics/getFoodReview.js';
import getServiceReview from '../../controllers/adminControllers/statistics/getServiceReview.js';
import getAmbienceReview from '../../controllers/adminControllers/statistics/getAmbienceReview.js';
import getExperienceReview from '../../controllers/adminControllers/statistics/getExperienceReview.js';
import updateClient from '../../controllers/adminControllers/clients/updateClient.js';
// import createStripeCustomerId from '../../controllers/adminControllers/clients/createStripeCustomerId.js';
import changeClientPassword from '../../controllers/adminControllers/clients/changeClientPassword.js';
//Use Router from express for sharing the routes
const adminRoutes = Router();

//path for controllers
adminRoutes.post('/login', loginAdmin);
adminRoutes.post('/register', registerAdmin);
adminRoutes.get('/get-clients', validateToken, getClients);
adminRoutes.delete('/delete-client', validateToken, deleteClient);
adminRoutes.patch('/:adminId/update-admin-password',validateToken, updateAdminPassword);
adminRoutes.get('/get-users', validateToken, getUsers);
adminRoutes.delete('/delete-user', validateToken, deleteUser);
adminRoutes.patch('/client/:clientId/update-client', validateToken, updateClient);
// adminRoutes.post('/client/:clientId/create-stripe-customer-id', validateToken, createStripeCustomerId);
adminRoutes.patch('/client/:clientId/change-client-password',validateToken, changeClientPassword)

//Statistics
adminRoutes.get('/statistics/get-clients-number',validateToken, getClientsNumber);
adminRoutes.get('/statistics/client/:clientId/get-restaurants-number', validateToken, getRestaurantsNumber);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-reviews-number', validateToken, getReviewsNumber);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-tables-number', validateToken, getTablesNumber);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-plates-number', validateToken, getPlatesNumber);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-food-review', validateToken, getFoodReview);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-service-review', validateToken, getServiceReview);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-ambience-review', validateToken, getAmbienceReview);
adminRoutes.get('/statistics/restaurant/:restaurantId/get-experience-review', validateToken, getExperienceReview);

export default adminRoutes;