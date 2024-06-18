const axios = require('axios');
const { urls } = require('../../api');

const { get_shipping_address_URL, GET_CART_URL } = urls;


const OrderSummery = async (req, res) => {
    const userData = req.session.userData;
    try {
        // Retrieve address_id and payment_mode from the session
        const payment_mode = req.session.payment_mode;
        const address_id = req.session.address_id;

        const shipping_address = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const response = await axios.post(get_shipping_address_URL, shipping_address, { headers: req.headers });
        const shipping_address_data = response.data.result;

        let foundAddress = null;

        shipping_address_data.forEach(address => {
            if (String(address.id) === address_id) { // Convert product_id to string before comparison
                foundAddress = address;
            }
        });

        const userProfileData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const GET_CART_response = await axios.post(GET_CART_URL, userProfileData, { headers: req.headers });
        const carts_Amount = GET_CART_response.data.result;

        //(carts_Amount);
        res.render('OrderSummery/index', { userData: userData, carts_Amount: carts_Amount, address: foundAddress, payment_mode: payment_mode });

    } catch (error) {
        //(error.message);
    }
};


module.exports = { OrderSummery: OrderSummery }