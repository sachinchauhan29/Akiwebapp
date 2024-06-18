const axios = require('axios');

const { urls } = require('../../api');
const { BANNER_URL, CATEGORY_LIST_URL, GET_CART_URL } = urls;



const Deals = async (req, res) => {
    // Payload for the POST request

    const userData = req.session.userData;



    ////(userData);
    // Check if userData exists in session
    if (userData) {
        const postData = {
            login_id: userData.login_id,
            banner_type: "HOME"
        };

        const CATEGORYLIST = {
            login_id: userData.login_id,
            customer_id: Number(userData.aki_customer_id),
            channel_id: userData.channel_id,
            customer_mapping_status: userData.customer_mapping_status,
            skip: 0,
            limit: "10"
        };

        const cart_count = {
            login_id: userData.login_id,
            customer_id: userData.id,
            channel_id: userData.channel_id
        };

        // Make the request to the profile endpoint
        const responsecart = await axios.post(GET_CART_URL, cart_count, { headers: req.headers });
        const carts = responsecart.data.result
        const CartCount = carts ? carts.product_details.length : 0; // If carts is truthy, get the length of product_details array, otherwise set CartCount to 0


        const _CATEGORYLIST = await axios.post(CATEGORY_LIST_URL, CATEGORYLIST, { headers: req.headers });
        // Assuming response_c contains the response data from your API call TOP_SELLING_PRODUCT_URL
        const categories = _CATEGORYLIST.data.result;

        let bannerUrl; // Define bannerUrl variable outside the if block

        try {
            const response = await axios.post(BANNER_URL, postData, { headers: req.headers });

            if (response.data && response.data.result && response.data.result.length > 0) {
                bannerUrl = response.data.result[0].banner_url; // Assign bannerUrl inside the if block
                ////("Banner URL:", bannerUrl);
            } else {
                console.error("Banner data not available or response structure is unexpected.");
                // Handle this case as per your application's requirements
            }
        } catch (error) {
            console.error("Error occurred while fetching or processing banner data:", error.message);
            // Handle the error gracefully, such as logging or displaying an appropriate message to the user
        }

        // If userData exists, render a page with userData
        res.render('Deals/Deals', { userData: userData, banner: bannerUrl, categories: categories, CartCount: CartCount });

    } else {
        // If userData doesn't exist, redirect to login page or handle accordingly
        res.redirect('/page');
    }
}


module.exports = {
    Deals
}

