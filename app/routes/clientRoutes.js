import { Router } from 'express';
import registerClient from '../../controllers/clientControllers/registerClient.js'
import loginClient from '../../controllers/clientControllers/loginClient.js';
import addRestaurant from '../../controllers/clientControllers/restaurantControllers/addRestaurant.js';
import getRestaurants from '../../controllers/clientControllers/restaurantControllers/getRestaurants.js';
import getRestaurant from '../../controllers/clientControllers/restaurantControllers/getRestaurant.js';
import addPlate from '../../controllers/clientControllers/restaurantControllers/menu/category/plate/addPlate.js';
import addDrink from '../../controllers/clientControllers/restaurantControllers/drinks/addDrink.js';
import deleteRestaurant from '../../controllers/clientControllers/restaurantControllers/deleteRestaurant.js';
import validateToken from '../../controllers/utils/validateToken.js';
import validateRefreshToken from '../../controllers/utils/validateRefreshToken.js';
import deleteDrink from '../../controllers/clientControllers/restaurantControllers/drinks/deleteDrink.js';
import deleteMenu from '../../controllers/clientControllers/restaurantControllers/menu/deleteMenu.js';
import updateRestaurant from '../../controllers/clientControllers/restaurantControllers/updateRestaurant.js';
import addMenu from '../../controllers/clientControllers/restaurantControllers/menu/addMenu.js';
import getDrinks from '../../controllers/clientControllers/restaurantControllers/drinks/getDrinks.js';
import getDrink from '../../controllers/clientControllers/restaurantControllers/drinks/getDrink.js';
import updateDrink from '../../controllers/clientControllers/restaurantControllers/drinks/updateDrink.js';
import getCategory from '../../controllers/clientControllers/restaurantControllers/menu/category/getCategory.js';
import getCategories from '../../controllers/clientControllers/restaurantControllers/menu/category/getCategories.js';
import updateCategory from '../../controllers/clientControllers/restaurantControllers/menu/category/updateCategory.js';
import addCategory from '../../controllers/clientControllers/restaurantControllers/menu/category/addCategory.js';
import updateMenu from '../../controllers/clientControllers/restaurantControllers/menu/updateMenu.js';
import getMenus from '../../controllers/clientControllers/restaurantControllers/menu/getMenus.js';
import getMenu from '../../controllers/clientControllers/restaurantControllers/menu/getMenu.js';
import updatePlate from '../../controllers/clientControllers/restaurantControllers/menu/category/plate/updatePlate.js';
import getPlates from '../../controllers/clientControllers/restaurantControllers/menu/category/plate/getPlates.js';
import getPlate from '../../controllers/clientControllers/restaurantControllers/menu/category/plate/getPlate.js';
import addExtra from '../../controllers/clientControllers/restaurantControllers/extras/addExtra.js';
import addReview from '../../controllers/clientControllers/restaurantControllers/reviews/addReview.js';
import getExtra from '../../controllers/clientControllers/restaurantControllers/extras/getExtra.js';
import getExtras from '../../controllers/clientControllers/restaurantControllers/extras/getExtras.js';
import updateExtra from '../../controllers/clientControllers/restaurantControllers/extras/updateExtra.js';
import deleteExtra from '../../controllers/clientControllers/restaurantControllers/extras/deleteExtra.js';
import forgotUserPassword from '../../controllers/userControllers/forgotUserPassword.js';
import addOffer from '../../controllers/clientControllers/restaurantControllers/offers/addOffer.js';
import deleteOffer from '../../controllers/clientControllers/restaurantControllers/offers/deleteOffer.js';
import getOffers from '../../controllers/clientControllers/restaurantControllers/offers/getOffers.js';
import getOffer from '../../controllers/clientControllers/restaurantControllers/offers/getOffer.js';
import updateOffer from '../../controllers/clientControllers/restaurantControllers/offers/updateOffer.js';
import updateClient from '../../controllers/clientControllers/updateClient.js';
import updateClientPassword from '../../controllers/clientControllers/updateClientPassword.js';
// import updateUser from '../../controllers/userControllers/updateUser.js';
import addTable from '../../controllers/clientControllers/restaurantControllers/table/addTable.js';
import getMinPricePlate from '../../controllers/clientControllers/restaurantControllers/menu/category/plate/getMinPricePlate.js';
import deleteCategory from '../../controllers/clientControllers/restaurantControllers/menu/category/deleteCategory.js';
import deletePlate from '../../controllers/clientControllers/restaurantControllers/menu/category/plate/deletePlate.js';
import getTable from '../../controllers/clientControllers/restaurantControllers/table/getTable.js';
import getTables from '../../controllers/clientControllers/restaurantControllers/table/getTables.js';
import deleteTable from '../../controllers/clientControllers/restaurantControllers/table/deleteTable.js';
// import addActualOrder from '../../controllers/userControllers/addActualOrder.js';
import getOrders from '../../controllers/clientControllers/restaurantControllers/orders/getOrders.js';
import getRestaurantReview from '../../controllers/clientControllers/restaurantControllers/reviews/getRestaurantReview.js';
import isServedUserOrderPlate from '../../controllers/clientControllers/restaurantControllers/orders/updateUserOrderPlate.js';
import getCheckouts from '../../controllers/clientControllers/restaurantControllers/orders/getCheckouts.js';
import updateUserOrderExtra from '../../controllers/clientControllers/restaurantControllers/orders/updateUserOrderExtra.js';
import updateUserOrderPlate from '../../controllers/clientControllers/restaurantControllers/orders/updateUserOrderPlate.js';
import updateUserOrderDrink from '../../controllers/clientControllers/restaurantControllers/orders/updateUserOrderDrink.js';
import updateUserOrder from '../../controllers/clientControllers/restaurantControllers/orders/updateUserOrder.js';
import updateProductsPayment from '../../controllers/clientControllers/restaurantControllers/orders/updateProductsPayment.js';
import payTableOrder from '../../controllers/clientControllers/restaurantControllers/orders/payTableOrder.js';


const clientRoutes = Router({mergeParams: true});

// const defaultRoute = '/:clientId/restaurant/:restaurantId';
// path for controllers - without validation
clientRoutes.post('/login', loginClient);
clientRoutes.post('/register', registerClient);

// POST for controllers - with validation
clientRoutes.post('/:clientId/add-restaurant', validateToken, addRestaurant);
clientRoutes.post('/:clientId/restaurant/:restaurantId/add-drink', validateToken, addDrink);
clientRoutes.post('/:clientId/restaurant/:restaurantId/add-extra', validateToken, addExtra);
clientRoutes.post('/:clientId/restaurant/:restaurantId/add-review', validateToken, addReview);
clientRoutes.post('/:clientId/restaurant/:restaurantId/add-menu', validateToken, addMenu);
clientRoutes.post('/:clientId/restaurant/:restaurantId/menu/:menuId/add-category', validateToken, addCategory);
clientRoutes.post('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/add-plate', validateToken, addPlate);
clientRoutes.post('/:clientId/restaurant/:restaurantId/add-offer', validateToken, addOffer);
clientRoutes.post('/:clientId/restaurant/:restaurantId/add-table', validateToken, addTable);

// clientRoutes.post('/:clientId/restaurant/:restaurantId/user/:userId/add-actual-order', validateToken, addActualOrder);

// GET for controllers - with validation
clientRoutes.get('/:clientId/get-restaurants', validateToken, getRestaurants);
clientRoutes.get('/:clientId/restaurant/:restaurantId/get-restaurant', validateToken, getRestaurant);

clientRoutes.get('/:clientId/restaurant/:restaurantId/get-drinks', validateToken, getDrinks);
clientRoutes.get('/:clientId/restaurant/:restaurantId/drink/:drinkId/get-drink', validateToken, getDrink);

clientRoutes.get('/:clientId/restaurant/:restaurantId/menu/:menuId/get-categories', validateToken, getCategories);
clientRoutes.get('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/get-category', validateToken, getCategory);

clientRoutes.get('/:clientId/restaurant/:restaurantId/get-menus', validateToken, getMenus);
clientRoutes.get('/:clientId/restaurant/:restaurantId/menu/:menuId/get-menu', validateToken, getMenu);

clientRoutes.get('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/get-plates', validateToken, getPlates);
clientRoutes.get('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/plate/:plateId/get-plate', validateToken, getPlate);
clientRoutes.get('/:clientId/restaurant/:restaurantId/get-minimum-price-plate', getMinPricePlate);

clientRoutes.get('/:clientId/restaurant/:restaurantId/get-offers', validateToken, getOffers);
clientRoutes.get('/:clientId/restaurant/:restaurantId/offer/:offerId/get-offer', validateToken, getOffer);

clientRoutes.get('/:clientId/restaurant/:restaurantId/extras/get-extras', validateToken, getExtras);
clientRoutes.get('/:clientId/restaurant/:restaurantId/extras/:extraId/get-extra', validateToken, getExtra);

clientRoutes.get('/:clientId/restaurant/:restaurantId/table/:tableId/get-table', validateToken, getTable);
clientRoutes.get('/:clientId/restaurant/:restaurantId/table/get-tables', validateToken, getTables);

clientRoutes.get('/:clientId/restaurant/:restaurantId/orders/get-orders', validateToken, getOrders);
clientRoutes.get('/:clientId/restaurant/:restaurantId/checkouts/get-checkouts', validateToken, getCheckouts);

clientRoutes.get('/:clientId/restaurant/:restaurantId/reviews/get-restaurant-review', validateToken, getRestaurantReview);


clientRoutes.delete('/:clientId/restaurant/:restaurantId/delete-restaurant', validateToken, deleteRestaurant);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/drink/:drinkId/delete-drink', validateToken, deleteDrink);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/extras/:extraId/delete-extra', validateToken, deleteExtra);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/offer/:offerId/delete-offer', validateToken, deleteOffer);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/table/:tableId/delete-table', validateToken, deleteTable);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/menu/:menuId/delete-menu', validateToken, deleteMenu);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/delete-category', validateToken, deleteCategory);
clientRoutes.delete('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/plate/:plateId/delete-plate', validateToken, deletePlate);

clientRoutes.patch('/:clientId/restaurant/:restaurantId/update-restaurant', validateToken, updateRestaurant);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/drink/:drinkId/update-drink', validateToken, updateDrink);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/update-category', validateToken, updateCategory);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/menu/:menuId/update-menu', validateToken, updateMenu);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/menu/:menuId/category/:categoryId/plate/:plateId/update-plate', validateToken, updatePlate);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/extras/:extraId/update-extra', validateToken, updateExtra);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/offer/:offerId/update-offer', validateToken, updateOffer);
clientRoutes.patch('/:clientId/update-client', validateToken, updateClient);
clientRoutes.patch('/:clientId/update-client-password', validateToken, updateClientPassword);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/user/:userId/order/:cartUserId/productPlate/:productPlateId/update-user-order-plate', validateToken, updateUserOrderPlate);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/user/:userId/order/:cartUserId/productDrink/:productDrinkId/update-user-order-drink', validateToken, updateUserOrderDrink);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/user/:userId/order/:cartUserId/productExtra/:productExtraId/update-user-order-extra', validateToken, updateUserOrderExtra);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/user/:userId/order/:cartUserId/update-user-order', validateToken, updateUserOrder);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/user/:userId/order/:cartUserId/update-products-payment', validateToken, updateProductsPayment);
clientRoutes.patch('/:clientId/restaurant/:restaurantId/pay-table-order', validateToken, payTableOrder);

clientRoutes.post('/send', forgotUserPassword);

export default clientRoutes;