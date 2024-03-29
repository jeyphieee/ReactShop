const express = require('express')
const router = express.Router();

const { newOrder,
		getSingleOrder,
	    myOrders,
	    allOrders,
	    updateOrder,
	    deleteOrder,
		totalOrders,
		totalSales,
		customerSales,
		salesPerMonth

	} = require('../controllers/orderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.post('/order/new', isAuthenticatedUser, newOrder);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);
router.get('/admin/orders/', isAuthenticatedUser, authorizeRoles('admin'), allOrders);
router.get('/print-receipt/:id', newOrder, updateOrder);

router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

router.get('/admin/total-orders', totalOrders);
router.get('/admin/total-sales', totalSales);
router.get('/admin/customer-sales', customerSales);
router.get('/admin/sales-per-month', salesPerMonth);

module.exports = router;