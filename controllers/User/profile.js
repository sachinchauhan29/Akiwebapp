
const axios = require('axios');

const { urls } = require('../../api');
const { GET_FAQS_URL,
    PAYMENT_URL,
    GET_CUSTOMER_LOYALTY_POINT_URL,
    give_away_URL,
    return_get_orders_URL,
    INVOICED_get_orders_URL,
    get_order_by_id_URL, PENDING_PAYMENT_ORDER_URL } = urls


const ProfilePage = (req, res) => {
    // Your logic to  the profile page

    try {
        const userData = req.session.userData;

        res.render('User/profile', { Profile: response.data, userData: userData });

    } catch (error) {
        //(error);

    }

};

module.exports = {
    ProfilePage,

};
