const axios = require('axios');
const { urls } = require('../../api');

const {

    TOP_SELLING_PRODUCT_URL,
} = urls;





const TOP_SELLING = async (req, res,) => {
    try {
        const userData = req.session.userData;
        if (!userData) {
            return res.redirect('/page');
        }

        const TOP_SELLING_PRODUCT_data = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status
        };

        const config_cart = {
            method: 'post',
            url: TOP_SELLING_PRODUCT_URL,
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`,
            },
            data: TOP_SELLING_PRODUCT_data
        };

        // Make the request to add the cart data
        const response = await axios.request(config_cart);

        const TOP_SELLING_PRODUCT_PRODUCT = response.data.result; // Assuming the response contains TOP_SELLING_PRODUCT_PRODUCT


        res.send({
            message: 'TOP_SELLING_PRODUCT_PRODUCT as String',
            TOP_SELLING_PRODUCT_PRODUCT // Send the JSON string
        });
    } catch (error) {
        console.error("Internal server error:", error.message);
        res.status(500).send("Internal server error");
    }
};



const TOP_SELLING_Page = async (req, res) => {
    try {
        const userData = req.session.userData;
        if (!userData) {
            return res.redirect('/page');
        }

        res.render('TopBrands/TopBrands', { userData });


    } catch (error) {
        console.error("Internal server error:", error.message);
        res.status(500).send("Internal server error");
    }
};

module.exports = {
    TOP_SELLING,
    TOP_SELLING_Page
};
