const axios = require('axios');
const { urls } = require('../../api');

const { get_shipping_address_URL, count_customerP_loyalty_point_URL, GET_CART_URL } = urls;


const checkout = async (req, res) => {
    const userData = req.session.userData;

    try {
        const userProfileData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const GET_CART_response = await axios.post(GET_CART_URL, userProfileData, { headers: req.headers });
        const carts_Amount = GET_CART_response.data.result;



        const shipping_address = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const response = await axios.post(get_shipping_address_URL, shipping_address, { headers: req.headers });
        const shipping_address_data = response.data.result;


        const customerP_loyalty_point = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const customerP_loyalty_pointresponse = await axios.post(count_customerP_loyalty_point_URL, customerP_loyalty_point, { headers: req.headers });
        const loyalty_point = customerP_loyalty_pointresponse.data.result;

        res.render('cart/checkout', {
            userData: userData,
            shipping_address_data: shipping_address_data,
            loyalty_point: loyalty_point,
            carts_Amount: carts_Amount
        })

    } catch (error) {

        //(error.message);

    }


}

const checkoutPost = async (req, res) => {
    try {
        // Extract address_id and payment_mode from the request body
        const { address_id, payment_mode } = req.body;
        // Set address_id and payment_mode in the session
        req.session.address_id = address_id;
        req.session.payment_mode = payment_mode;

        // Redirect the user to the order summary page with the selected address_id and payment_mode
        res.redirect('/OrderSummery',);
    } catch (error) {
        console.error(error.message);
        // Handle any errors that may occur during processing
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
};


module.exports = {
    checkout: checkout,
    checkoutPost: checkoutPost
}