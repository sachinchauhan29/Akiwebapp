const axios = require('axios');
const { urls } = require('../../api');

const {

    TOP_BRAND_PRODUCT_URL,
} = urls;

const TOP_BRAND_Page = async (req, res) => {
    try {
        const userData = req.session.userData;
        if (!userData) {
            return res.redirect('/page');
        }

        res.render('BestSellers/BestSellers', { userData })

    } catch (error) {
        console.error("Internal server error:", error.message);
        res.status(500).send("Internal server error");
    }
};



const TOP_BRAND = async (req, res) => {
    try {
        const userData = req.session.userData;
        if (!userData) {
            return res.redirect('/page');
        }




        const TOP_BRAND_PRODUCT_data = {
            login_id: userData.login_id,
            customer_id: userData.id, channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status
        };


        const config_cart = {
            method: 'post',
            url: TOP_BRAND_PRODUCT_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: TOP_BRAND_PRODUCT_data // Include cartData inside the data field
        };

        // Make the request to add the cart data
        const response = await axios.request(config_cart);

        const TOP_BRAND_PRODUCT = response.data.result; // Assuming the response contains TOP_BRAND_PRODUCT

        //("TOP_BRAND_PRODUCTTOP_BRAND_PRODUCT********************************", TOP_BRAND_PRODUCT);


        // Send the stringifiedData as a JSON response
        res.send({
            message: 'TOP_BRAND_PRODUCT as String', // Custom message
            TOP_BRAND_PRODUCT // Sending the stringified data as part of the response
        });


        //(TOP_BRAND_PRODUCT);
    } catch (error) {
        console.error("Internal server error:", error.message);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    TOP_BRAND,
    TOP_BRAND_Page
};
