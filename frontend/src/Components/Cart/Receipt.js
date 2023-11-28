function generateReceipt(orderId, items, totalPrice) {
    const receiptTemplate = `
        <html>
            <head>
                <title>Receipt for Order #${orderId}</title>
                <style>
                </style>
            </head>
            <body>
                <h1>Receipt for Order #${orderId}</h1>
                <h3>Order Items:</h3>
                <ul>
                    ${items.map(item => `<li>${item.name} - ${item.quantity} x $${item.price}</li>`).join('')}
                </ul>
                <p>Total Price: $${totalPrice}</p>
                <p>Thank you for your purchase!</p>
            </body>
        </html>
    `;
    
    return receiptTemplate;
}

module.exports = {
    generateReceipt
};
