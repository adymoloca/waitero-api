import { Router } from 'express';

//User Controllers
import registerUser from '../../controllers/userControllers/registerUser.js';
import loginUser from '../../controllers/userControllers/loginUser.js';
import updateUser from '../../controllers/userControllers/updateUser.js';
import validateToken from '../../controllers/utils/validateToken.js';
import deleteUser from '../../controllers/userControllers/deleteUser.js';
import updateUserPassword from '../../controllers/userControllers/updateUserPassword.js';
import createTable from '../../controllers/clientControllers/restaurantControllers/table/addTable.js';
import getRestaurantsForUsers from '../../controllers/userControllers/getRestaurantsForUsers.js';
import getUser from '../../controllers/userControllers/getUser.js';
import addReview from '../../controllers/userControllers/addReview.js';
import getRestaurantForUsers from '../../controllers/userControllers/getRestaurantForUsers.js';
import setActualTableForUser from '../../controllers/userControllers/setActualTableForUser.js';
import userLogout from '../../controllers/userControllers/logoutUser.js';
import addActualOrder from '../../controllers/userControllers/addActualOrder.js';
import getUserOrders from '../../controllers/userControllers/getUserOrders.js';
import getNearByRestaurants from '../../controllers/userControllers/getNearByRestaurants.js';
import getActualCheckout from '../../controllers/userControllers/getActualCheckout.js';
// import addCard from '../../controllers/userControllers/addCard.js';
// import createCharge from '../../controllers/userControllers/createCharge.js';

//Use Router from express for sharing the routes
const userRoutes = Router({mergeParams: true});

//path for controllers
userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/:userId/restaurant/:restaurantId/add-review', validateToken, addReview);
userRoutes.post('/:userId/client/:clientId/restaurant/:restaurantId/add-user-order',validateToken, addActualOrder);
// userRoutes.post('/:userId/add-card', validateToken, addCard);
// userRoutes.post('/:userId/create-charge', validateToken, createCharge);

userRoutes.patch('/:userId/update-user', validateToken, updateUser);
userRoutes.patch('/:userId/client/:clientId/restaurant/:restaurantId/table/:tableNumber/update-actual-table', validateToken, setActualTableForUser);
userRoutes.patch('/:userId/update-user-password', validateToken, updateUserPassword);
userRoutes.patch('/:userId/user-logout', userLogout);
userRoutes.delete('/:userId/delete-user', validateToken, deleteUser);

userRoutes.get('/get-restaurants', getRestaurantsForUsers);
userRoutes.get('/:userId/get-user', validateToken, getUser);
userRoutes.get('/get-restaurants-for-users', getRestaurantsForUsers);
userRoutes.get('/restaurant/:restaurantId/get-restaurant-for-users', getRestaurantForUsers);
userRoutes.get('/:userId/get-user-orders', validateToken, getUserOrders);
userRoutes.get('/get-nearby-restaurants', getNearByRestaurants);
userRoutes.get('/:userId/client/:clientId/restaurant/:restaurantId/checkout/get-actual-checkout/:tableNumber', getActualCheckout);

export default userRoutes;
