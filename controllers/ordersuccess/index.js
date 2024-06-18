const axios = require('axios');
const { urls } = require('../../api');

const { get_shipping_address_URL } = urls;


const order_success = async (req, res) => {
    const userData = req.session.userData;
    const { order_id, grand_total, payment_mode } = req.query;


    try {

        if (order_id) {

            // Pass userData and order details to the view
            res.render('order-success', { userData, order_id, grand_total, payment_mode });

        } else {

            res.redirect('/')

        }

    } catch (error) {
        //(error.message);
    }
}


module.exports = { order_success: order_success }