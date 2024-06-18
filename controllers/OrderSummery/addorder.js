const axios = require('axios');
const { urls } = require('../../api');

const { add_order_URL, GET_CART_URL } = urls;


const add_order = async (req, res) => {
    const userData = req.session.userData;

    const address_id = req.body.address_id;
    const payment_mode = req.body.payment_mode;




    try {
        const userProfileData = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        const config_cart = {
            method: 'post',
            url: GET_CART_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: userProfileData
        };

        const GET_CART_response = await axios.request(config_cart);
        const Order_Amount_Add = GET_CART_response.data.result;
        const cartId = Order_Amount_Add.product_details[0].cart_id;

        let data__ = {
            login_id: userData.login_id,
            cart_id: cartId,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            total: Order_Amount_Add.total,
            total_tax_value: Order_Amount_Add.total_tax_value,
            total_discount_amount: Order_Amount_Add.total_discount_amount,
            grand_total: Order_Amount_Add.grand_total,
            shipping_address_id: address_id,
            express_delivery: "0",
            schedule_date: "",
            time_slot_id: "",
            from_time: "",
            to_time: "",
            redeem_loyalty_point: "",
            loyalty_point_amount: "",
            loyalty_point_status: "0",
            payment: {

                payment_mode: payment_mode
            },
            product_details: Order_Amount_Add.product_details
        };


        const config_cart_add = {
            method: 'post',
            url: add_order_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: data__
        };

        const GET_response = await axios.request(config_cart_add);
        const order = GET_response.data.result


        if (order) {
            // Redirect with query parameters
            res.redirect(`/order-success?order_id=${order.order_id}&grand_total=${order.grand_total}&payment_mode=${order.payment_mode}`);
        } else {
            res.status(500).send({ error: 'An error occurred while processing your request.' });
        }



    } catch (error) {
        console.error("Error:", error);

        // Send an error response back to the client
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
}


module.exports = { add_order: add_order }