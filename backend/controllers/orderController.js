const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

exports.newOrder = async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    });

    if (!order) {
        return res.status(400).json({ message: `Order not saved` });
    }

    const orderId = order._id;
    const order1 = await Order.findById(orderId).populate('user');
    
    if (!order1) {
        return res.status(400).json({ message: `Order not found` });
    }

    const user = order1.user;

    if (user) {
        const pdfLink = `${req.protocol}://localhost:3000/print-receipt/${orderId}`;
        let message = '';

        if (order1.orderStatus === 'Processing') {
            message = `Your order with ID ${orderId} has been processed successfully.
            You will receive a confirmation email shortly once your order has been confirmed. 
            Thank you for shopping with us, Happy Collecting! <a href="${pdfLink}">Print Receipt</a>`;

            await sendEmail({
                email: user.email,
                subject: 'Order Processed',
                message
            });
        }
    }

    res.status(200).json({
        success: true,
        order
    });
};


exports.getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })
    }
    res.status(200).json({
        success: true,
        order
    })
}

exports.myOrders = async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    if (!orders) {
        return res.status(404).json({ message: `Order found` })
    }

    res.status(200).json({
        success: true,
        orders

    })


}

exports.allOrders = async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
}
exports.updateOrder = async (req, res, next) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (order.orderStatus === 'Delivered') {
        return res.status(404).json({ message: `You have already delivered this order` })
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()

    const user = await User.findById(order.user);

    if (user){
        const pdfLink = `${req.protocol}://localhost:3000/print-receipt/${order}`;
        let message = '';

         if (order.orderStatus === 'Shipped'){
            message = `Your order with ID ${orderId} has been shipped. Please allow 2-3 
            business days for shipment and delivery. Thank you for shopping with us, Happy Collecting!
            <a href="${pdfLink}">Print Receipt</a>`;
            await sendEmail({
                email: user.email,
                subject: 'Order Shipped',
                message
            })
        } else if (order.orderStatus === 'Delivered'){
            message = `Your order with ID ${orderId} has been delivered. We hope your package arrived in 
            perfect condition and that you're delighted with your purchase. Your satisfaction is our priority.
            Thank you for shopping with us, Happy Collecting!
            <a href="${pdfLink}">Print Receipt</a>`;
            await sendEmail({
                email: user.email,
                subject: 'Order Delivered',
                message
            });
    }
    res.status(200).json({
        success: true,
    })
}
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false })
}

exports.deleteOrder = async (req, res, next) => {

    const order = await Order.findByIdAndRemove(req.params.id)

    if (!order) {
        return res.status(404).json({ message: `No Order found with this ID` })

    }


    res.status(200).json({
        success: true
    })
}

exports.totalOrders = async (req, res, next) => {
    const totalOrders = await Order.aggregate([
        {
            $group: {
                _id: null,
                count: { $sum: 1 }
            }
        }
    ])
    if (!totalOrders) {
        return res.status(404).json({
            message: 'error total orders',
        })
    }
    res.status(200).json({
        success: true,
        totalOrders
    })

}

exports.totalSales = async (req, res, next) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$totalPrice" }
            }
        }
    ])
    if (!totalSales) {
        return res.status(404).json({
            message: 'error total sales',
        })
    }
    res.status(200).json({
        success: true,
        totalSales
    })
}

exports.customerSales = async (req, res, next) => {
    const customerSales = await Order.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'userDetails'
            },
        },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //     }
        // },

        { $unwind: "$userDetails" },
        // {
        //     $group: {
        //         _id: "$user",
        //         total: { $sum: "$totalPrice" },
        //         doc: { "$first": "$$ROOT" },

        //     }
        // },

        // {
        //     $replaceRoot: {
        //         newRoot: { $mergeObjects: [{ total: '$total' }, '$doc'] },
        //     },
        // },
        {
            $group: {
                _id: "$userDetails.name",
                total: { $sum: "$totalPrice" }
            }
        },
        {
            $project: {
                _id: 0,
                "userDetails.name": 1,
                total: 1,
            }
        },
        { $sort: { total: 1 } },

    ])
    console.log(customerSales)
    if (!customerSales) {
        return res.status(404).json({
            message: 'error customer sales',
        })


    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        customerSales
    })

}
exports.salesPerMonth = async (req, res, next) => {
    const salesPerMonth = await Order.aggregate([

        {
            $group: {
                // _id: {month: { $month: "$paidAt" } },
                _id: {
                    year: { $year: "$paidAt" },
                    month: { $month: "$paidAt" }
                },
                total: { $sum: "$totalPrice" },
            },
        },

        {
            $addFields: {
                month: {
                    $let: {
                        vars: {
                            monthsInString: [, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', ' Sept', 'Oct', 'Nov', 'Dec'],
                            
                        },
                        in: {
                            $arrayElemAt: ['$$monthsInString', "$_id.month"]
                        }
                    }
                }
            }
        },
        { $sort: { "_id.month": 1 } },
        {
            $project: {
                _id: 0,
                month: 1,
                total: 1,
            }
        }

    ])
    if (!salesPerMonth) {
        return res.status(404).json({
            message: 'error sales per month',
        })
    }
    // return console.log(customerSales)
    res.status(200).json({
        success: true,
        salesPerMonth
    })

}

exports.OrderSuccess = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })
        // return next(new ErrorHandler('User not found with this email', 404));
    }
    // Get reset token
    const message = `Thank you for choosing Collector's Corner for your latest acquisition! We're thrilled to have you join our community of collectors.

    Your purchase details are all set, and your receipt is available for download below:
        
    If you have any questions about your purchase or need further assistance, feel free to reach out. We're here to ensure your collecting experience with us is top-notch.
    
    Happy collecting!`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Purchase Confirmation',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
        // return next(new ErrorHandler(error.message, 500))
    }
}