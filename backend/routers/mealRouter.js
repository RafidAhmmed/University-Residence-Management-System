const express = require('express');
const MealController = require('../controllers/mealController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();
const mealController = new MealController();

// More specific routes first
// Admin routes
router.get('/admin/all-orders', auth, admin, (req, res) => mealController.getAllMealOrders(req, res));
router.put('/prices/:mealType', auth, admin, (req, res) => mealController.updateMealPrices(req, res));
router.get('/admin/closures', auth, admin, (req, res) => mealController.getMealClosures(req, res));
router.post('/admin/closures', auth, admin, (req, res) => mealController.createMealClosure(req, res));
router.delete('/admin/closures/:id', auth, admin, (req, res) => mealController.deleteMealClosure(req, res));
router.get('/admin/specials', auth, admin, (req, res) => mealController.getAdminSpecialMeals(req, res));
router.post('/admin/specials', auth, admin, (req, res) => mealController.createSpecialMeal(req, res));
router.delete('/admin/specials/:id', auth, admin, (req, res) => mealController.deleteSpecialMeal(req, res));

// Student deposit routes (authenticated)
router.get('/my-orders', auth, (req, res) => mealController.getStudentMealOrders(req, res));
router.get('/deposit/info', auth, (req, res) => mealController.getStudentDeposit(req, res));
router.post('/deposit/add', auth, (req, res) => mealController.addDeposit(req, res));

// Student meal order
router.post('/', auth, (req, res) => mealController.createMealOrder(req, res));
router.get('/specials', auth, (req, res) => mealController.getSpecialMeals(req, res));

// Public routes (no auth required)
router.get('/prices', (req, res) => mealController.getMealPrices(req, res));
router.get('/can-order', (req, res) => mealController.canOrderMeals(req, res));

module.exports = router;
